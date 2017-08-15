"use strict" 

let RandomUtils = {
    NUMUNIFORMVARS: 6,
    // Approximates a Standard Normal Random Variable by Averaging 6 Uniform Random Variables and subtracting 0.5
    normalRandom: function(mean, variance) {
        let uniformRandomSum = 0;
        for (let i = 0; i < this.NUMUNIFORMVARS; i++) {
            uniformRandomSum += Math.random();
        }
        let normalRandomNumber = (uniformRandomSum - 3)*Math.sqrt(2);
        return mean + Math.sqrt(variance)*normalRandomNumber;
    },
    uniformRandom: function(a, b) {
        return (a + (b - a)*Math.random());
    }
}


let FootPathUtils = {
    idealPath: null,
    PATHNUMBERSTEPS: null,
    dpTable: null,
    // Initialize the ideal path number of steps
    initIdealPath: function(idealPath) {
        this.idealPath = idealPath;
        this.PATHNUMBERSTEPS = idealPath.pathPoints.length;
    }
   // Initializes the first row of the Dynamic Programming table (FootPath Algorithm)
    generateInitDPTable: function() {
        this.dpTable = Array();
        this.dpTable.push(0); 
        for (let i = 1; i <= this.PATHNUMBERSTEPS; i++) {
            this.dpTable.push(Infinity);
        }
    },
    // Takes in two angle values and finds the score function value (FootPath Algorithm)
    scoreFunction: function(firstAngle, secondAngle) {
        let radianDifference1 = Math.abs(firstAngle - secondAngle);
        let radianDifference2 = Math.abs(firstAngle - secondAngle + 2*Math.PI);
        let radianDifference3 = Math.abs(firstAngle - secondAngle - 2*Math.PI);
        let radianDifference = Math.min(radianDifference1, radianDifference2, radianDifference3);
        let degreeDifference = radianDifference * 180 / Math.PI;
        if (degreeDifference <= 45) {
            return 0;
        } else if (degreeDifference <= 90) {
            return 1;
        } else if (degreeDifference <= 120) {
            return 2;
        } else {
            return 10;
        }
    },
    // Fills in the next row of the Dynamic Programming table
    //    corresponding to the next step the user has taken (FootPath Algorithm)
    updateDPTable: function(userAngle, prevUserAngle) {
        let newDPTable = Array();
        newDPTable.push(Infinity);
        for (let i = 1; i <= this.PATHNUMBERSTEPS; i++) {
            let idealIAngle = PointUtils.relativeAngle(this.idealPath.pathPoints[i], this.idealPath.pathPoints[i-1]);
            let idealIm1Angle;
            if (i >= 2) {
                idealIm1Angle = PointUtils.relativeAngle(this.idealPath.pathPoints[i-1], this.idealPath.pathPoints[i-2]);     
            } else {
                idealIm1Angle = 0;
            }

            let firstScore = this.dpTable[i-1] + this.scoreFunction(userAngle, idealIAngle);
            let secondScore = newDPTable[i-1] + this.scoreFunction(prevUserAngle, idealIAngle) + 1.5;
            let thirdScore = this.dpTable[i] + this.scoreFunction(userAngle, idealIm1Angle) + 1.5; 
        
            let score = Math.min(firstScore, secondScore, thirdScore)
            newDPTable.push(score);
        }
        this.dpTable = newDPTable;
    }, 
    // Finds the spot on the ideal path with the minimal score
    //   FootPath's estimation of where user is on the path (FootPath Algorithm)
    footpathEstimate: function() {
        let optimalPathIndex = 0;
        for (let i = 0; i < dpTable.length; i++) {
            if (dpTable[i] < dpTable[optimalPathIndex]) {
                optimalPathIndex = i;
            }
        } 
        return optimalPathIndex;
    }, 
}

let UserUtils = {
    DESTINATIONREACHEDEPSILON: 9,
    ANGLEVARIANCE: 1,
    STEPVARIANCE: 25,
    PATHSTEPLENGTH: 15,
    // Approximates a Standard Normal Random Variable by Averaging 6 Uniform Random Variables and subtracting 0.5
    user: null,
    userPath: null,
    initUser: function(path) {
        if (path != null && path.pathPoints.length > 1) {
            let point = new Point(path.pathPoints[0].x, path.pathPoints[0].y); 
            this.userPath = new Path();
            this.userPath.addPoint(point);
            let pos = point;
            let orient = PointUtils.angle( PointUtils.subtract(path.pathPoints[1], path.pathPoints[0]) );
            this.user = new Particle(pos, orient); 
        } else {
            console.log("Give Proper Ideal Path to Initialize User");
        }
    },
    updateUser: function(path, world, followPath) {
        if (this.user == null) {
            console.log("InitUser first!");
            return;
        } 
        
        let userIndex = 0;
        for (let i = 0; i < path.pathPoints.length; i++) {  
            if (PointUtils.distanceSquared( this.user.position, path.pathPoints[i] ) < 
                    PointUtils.distanceSquared( this.user.position, path.pathPoints[userIndex] ) ) {
                userIndex = i;    
            }
        }
        let lastPoint = path.pathPoints[path.pathPoints.length - 1];

        if (PointUtils.distanceSquared( this.user.position, lastPoint ) < DESTINATIONREACHEDEPSILON) {
            console.log("User Reached Destination");
            return;
        }

            let angleNoError;
            if (followPath) {
                if (userIndex + 1 >= path.pathPoints.length) {
                    angleNoError = PointUtils.angle(PointUtils.subtract(lastPoint, this.user.position) );
                } else {
                    angleNoError = PointUtils.angle(PointUtils.subtract(path.pathPoints[userIndex+1], this.user.position) );
                }
            } else {
                angleNoError = RandomUtils.normalRandom(this.user.orientation, this.ANGLEVARIANCE);
            }

            let userStepLength = RandomUtils.normalRandom(this.PATHSTEPLENGTH, this.STEPVARIANCE);
            let userAngle = RandomUtils.normalRandom(angleNoError, this.ANGLEVARIANCE);
            let newUserPosition = PointUtils.addPolar(this.user.position, userStepLength, userAngle);
            while ( ! WorldUtils.isInside(world, newUserPosition) ) {
                userStepLength = RandomUtils.normalRandom(this.PATHSTEPLENGTH, this.STEPVARIANCE);
                if (!followPath) { 
                    angleNoError = RandomUtils.uniformRandom(-Math.PI, Math.PI); 
                }
                userAngle = RandomUtils.normalRandom(angleNoError, this.ANGLEVARIANCE);
                newUserPosition = PointUtils.addPolar(this.user.position, userStepLength, userAngle);
            }
            this.userPath.addPoint(newUserPosition);    
            this.user = new Particle(newUserPosition, userAngle);
            
    }
}

let ParticleFilterUtils = {
    ANGLEVARIANCE: 1,
    STEPVARIANCE: 25,
    MEASUREMENTVARIANCE: 25;
    VISTAMIN = 2;
    VISTAMAX = 25;
    world: null,
    addWorld: function(_world)  {
        this.world = _world;
    },
    // State is a particle and control is a point
    getNextState: function(state, control) {
        let nextAngle = RandomUtils.normalRandom( PointUtils.angle(control), this.ANGLEVARIANCE );
        let stepLength = Math.sqrt( PointUtils.normSquared(control) );
        let nextStepLength = RandomUtils.normalRandom( stepLength, this.STEPVARIANCE ); 
        let nextPos = PointUtils.addPolar(state.position, nextStepLength, nextAngle); 
        return new Particle(nextPos, nextAngle);                
    },
    getErrorlessMeasurement: function(state) {
        let userPt = state.position;
        let vistaOrientation = state.orientation - Math.PI;
        let directionPt = PointUtils.addPolar( userPt, 1, vistaOrientation );
        let vistaPt = WorldUtils.vistaPoint(this.world, userPt, directionPt);
        let measurement = Math.sqrt( PointUtils.distanceSquared(userPt, vistaPt) );
        if (measurement < this.VISTAMIN) { measurement = this.VISTAMIN; }
        if (measurement > this.VISTAMAX) { measurement = this.VISTAMAX; }
        return measurement;
    },
    getMeasurement: function(state) {
        return RandomUtils.normalRandom( this.getErrorlessMeasurement(state), this.MEASUREMENTVARIANCE);
    },
    getProbOfMeasurement: function(state, measurement) {
        let stMeasurement = this.getErrorlessMeasurement(state);
        let prob = ()
    },
    genParticles: function() {

    },
    deepCopy: function() {

    }
}

let ParticleFilter = {
    NUMPARTICLES: 0,
    particles: [],
    initParticles: function(_particles) {
        this.particles = _particles;
        this.NUMPARTICLES = _particles.length;
    }
    updateParticles: function(measurement, control) {
        let priorParticles = [], weights = [];
        for (let i = 0 ; i < this.NUMPARTICLES; i++) {
            priorParticles.push( 
                ParticleFilterUtils.getNextState(this.particles[i], control) 
            );    
        }
        let sum = 0;
        for (let i = 0; i < priorParticles.length; i++) {
            let weight = ParticleFilterUtils.getProbOfMeasurement(priorParticles[i], measurement);
            sum += weight;
            weights.push(weight); 
        }
        for (let i = 0; i < weights.length; i++)  {
            weights[i] /= sum; 
        }
        this.particles = [];
        for (let i = 0; i < this.NUMPARTICLES; i++) {
            let j = 0;
            let cumulativeWeight = weights[j];
            let r = RandomUtils.uniformRandom(0, 1);
            while (cumulativeWeight < r) {
                j++;
                cumulativeWeight = weights[j];
            } 
            this.particles = ParticleFilterUtils.deepCopy(priorParticles[j]);
        }
    }  
}


/*
let FootPathUtils = {
    NUMUNIFORMVARS: 6,
    PATHSTEPLENGTH: 15,
    PATHNUMBERSTEPS: 70,
    PROBANGLECHANGE: 0.05,
    ANGLECHANGE: Math.PI/4,
    USERSTEPERROR: 20,
    USERANGLEERROR: 1.5,
    EPSILON: 15,
    // Gives the probabilities that the Path should go 45 degrees left, 45 degrees right or straight at each step
    angleChange: function() {
        let rnumber = Math.random();
        if (rnumber < this.PROBANGLECHANGE) { return -this.ANGLECHANGE; }
        else if (rnumber > (1 - this.PROBANGLECHANGE)) { return this.ANGLECHANGE; }
        else { return 0; }
    },
    // Generates the ideal path for Footpath Algorithm
    goToNearestNextPoint: function(world, currentPoint, endPoint) {
        let pointsArray = world.bigPolygon.pathPoints;
        for (let i = 0; i < world.obstacles.length; i++) {
            pointsArray = pointsArray.concat(world.obstacles[i].pathPoints);
        }
        let minDistanceSq = Infinity;
        let nextPoint;
        for (let i = 0; i < pointsArray.length; i++) {
            let neDistanceSq = PointUtils.distanceSquared(pointsArray[i], endPoint);
            let ceDistanceSq = PointUtils.distanceSquared(currentPoint, endPoint);
            let cnDistanceSq = PointUtils.distanceSquared(pointsArray[i], currentPoint);  

            if ( neDistanceSq < ceDistanceSq ){
                if ( cnDistanceSq < minDistanceSq ) {
                    nextPoint = new Point(pointsArray[i].x, pointsArray[i].y);
                    minDistanceSq = cnDistanceSq;
                }
            }
        }
        return nextPoint;
    },    
    generateIdealPath: function(world, startPoint, endPoint) {
        let nextPoint, path = new Path();
        path.addPoint(startPoint);
        nextPoint = this.goToNearestNextPoint(world, startPoint, endPoint);
        while (!PointUtils.areEqual(nextPoint, endPoint)) {
            path.addPoint(nextPoint);
            nextPoint = this.goToNearestNextPoint(world, nextPoint, endPoint);
        }
        path.addPoint(endPoint);
        return path;
    },
    // Generates the ideal path for Footpath Algorithm
    generatePathPoints: function(initX, initY, polygon) {
        if (PolygonUtils.isInside(polygon, new Point(initX, initY))) {
            let path = new Path();
            let nextPoint, currentPoint = new Point(initX, initY);
            let currentAngle = 0;
            if (PolygonUtils.isInside(polygon, currentPoint)) {
                path.addPoint(currentPoint);
                for (let i = 1; i <= this.PATHNUMBERSTEPS; i++) {
                    let nextAngle = currentAngle + this.angleChange();
                    nextPoint = PointUtils.addPolar(currentPoint, this.PATHSTEPLENGTH, nextAngle);
                    while (!(PolygonUtils.isInside(polygon, nextPoint))) {
                        nextAngle += this.ANGLECHANGE;
                        nextPoint = PointUtils.addPolar(currentPoint, this.PATHSTEPLENGTH, nextAngle);
                    }
                    currentPoint = nextPoint;
                    currentAngle = nextAngle;
                    path.addPoint( currentPoint );
                } 
            } 
            return path;
        } else {
            console.log("Start ideal path from within the polygon");
            return undefined;
        }
    },
    // Generates a path based on the corners of another path
    getCornerPath: function(path) {
        if (path.pathPoints.length >= 2) { 
            let cornerPath = new Path();
            cornerPath.addPoint(path.pathPoints[0]);
            for (let i = 1; i < path.pathPoints.length - 1; i++) {
                let angle = PointUtils.absoluteAngle(path.pathPoints[i-1], path.pathPoints[i], path.pathPoints[i+1]);
                if (Math.abs(angle - Math.PI) >= 1e-9) {
                    cornerPath.addPoint(path.pathPoints[i]);
                }
            }
            cornerPath.addPoint(path.pathPoints[ path.pathPoints.length - 1 ]);
            return cornerPath;
        } else {
            return path;
        }
    },
    // Generates a path that the user takes, which is more noisy than the ideal path
    generateUserMovement: function(initX, initY, cornerPath, polygon) {

        if (PolygonUtils.isInside(polygon, new Point(initX, initY)) && cornerPath.pathPoints.length >= 2) {
            let userPath = new Path();
            let cornerIndex = 0, distance, userStepLength;
            let currentUserPoint = new Point(initX, initY);
            userPath.addPoint(  currentUserPoint );

            while (cornerIndex < cornerPath.pathPoints.length) {
                distance = PointUtils.distanceSquared( currentUserPoint, cornerPath.pathPoints[cornerIndex] );
                if (distance > this.PATHSTEPLENGTH*this.PATHSTEPLENGTH) {
                    userStepLength = Math.round( this.PATHSTEPLENGTH + this.USERSTEPERROR*this.normalRandom() );
                } else if (distance > this.EPSILON*this.EPSILON) {
                    userStepLength = Math.round( distance + this.normalRandom() );
                } else {
                    cornerIndex++;
                    continue;
                }
                let angle = PointUtils.relativeAngle(cornerPath.pathPoints[cornerIndex], currentUserPoint );
                let userAngle = angle + this.USERANGLEERROR*this.normalRandom();
                let nextPoint = PointUtils.addPolar( currentUserPoint, userStepLength, userAngle);
            
                while (!(PolygonUtils.isInside(polygon, nextPoint))) {
                    angle += this.ANGLECHANGE; 
                    userAngle = angle + this.USERANGLEERROR*this.normalRandom();
                    let nextPoint = PointUtils.addPolar( currentUserPoint, userStepLength, userAngle);
                }
                currentUserPoint = nextPoint;
                userPath.addPoint( currentUserPoint );    
            }
            return userPath;
        } else { 
            console.log("Start user path from within the polygon and use proper cornerPath");
            return undefined;
        }
    },
    // Generates a path that the user takes, which is completely different from the ideal path
    generateUserMovement2: function(initX, initY, polygon) {
        
        if (PolygonUtils.isInside(polygon, new Point(initX, initY))) {
            let userPath = new Path();
            let currentUserPosition = new Point(initX, initY);
            userPath.addPoint( currentUserPosition );
            let userStepLength, angle = 0, nextPoint;
            for (let i = 0; i < this.PATHNUMBERSTEPS; i++) {
                userStepLength = Math.round( this.PATHSTEPLENGTH + this.USERSTEPERROR*this.normalRandom() );
                angle += (this.angleChange() + this.USERANGLEERROR*this.normalRandom());
                nextPoint = PointUtils.addPolar( currentUserPosition, userStepLength, angle);
                while( !(PolygonUtils.isInside(polygon, nextPoint)) ) {    
                    angle += this.ANGLECHANGE;
                    nextPoint = PointUtils.addPolar( currentUserPosition, userStepLength, angle);
                }
                currentUserPosition = nextPoint;    
                userPath.addPoint( currentUserPosition );
            }
            return userPath;
        } else {
            console.log("Start user path from within the polygon");
            return undefined;
        }
    },
    // Approximates a Standard Normal Random Variable by Averaging 6 Uniform Random Variables and subtracting 0.5
    normalRandom: function() {
        let uniformRandomSum = 0;
        for (let i = 0; i < this.NUMUNIFORMVARS; i++) {
            uniformRandomSum += Math.random();
        }
        let normalRandomNumber = (uniformRandomSum / this.NUMUNIFORMVARS) - 0.5;
        return normalRandomNumber;
    },
    // Initializes the first row of the Dynamic Programming table (FootPath Algorithm)
    generateInitDPTable: function() {
        let dpTable = Array();
        dpTable.push(0); 
        for (let i = 1; i <= this.PATHNUMBERSTEPS; i++) {
            dpTable.push(Infinity);
        }
        return dpTable;
    },
    // Takes in two angle values and finds the score function value (FootPath Algorithm)
    scoreFunction: function(firstAngle, secondAngle) {
        let radianDifference1 = Math.abs(firstAngle - secondAngle);
        let radianDifference2 = Math.abs(firstAngle - secondAngle + 2*Math.PI);
        let radianDifference3 = Math.abs(firstAngle - secondAngle - 2*Math.PI);
        let radianDifference = Math.min(radianDifference1, radianDifference2, radianDifference3);
        let degreeDifference = radianDifference * 180 / Math.PI;
        if (degreeDifference <= 45) {
            return 0;
        } else if (degreeDifference <= 90) {
            return 1;
        } else if (degreeDifference <= 120) {
            return 2;
        } else {
            return 10;
        }
    },
    // Fills in the next row of the Dynamic Programming table
    //    corresponding to the next step the user has taken (FootPath Algorithm)
    updateDPTable: function(dpTable, userPath, userIndex, idealPath) {
        let newDPTable = Array();
        newDPTable.push(Infinity);
        let j = userIndex;
        for (let i = 1; i <= this.PATHNUMBERSTEPS; i++) {
            let userJAngle = PointUtils.relativeAngle(userPath.pathPoints[j], userPath.pathPoints[j-1]);
            let idealIAngle = PointUtils.relativeAngle(idealPath.pathPoints[i], idealPath.pathPoints[i-1]);
               
            let userJm1Angle; 
            if (j >= 2) {
                userJm1Angle = PointUtils.relativeAngle(userPath.pathPoints[j-1], userPath.pathPoints[j-2]);     
            } else {
                userJm1Angle = 0; 
            }
            
            let idealIm1Angle;
            if (i >= 2) {
                idealIm1Angle = PointUtils.relativeAngle(idealPath.pathPoints[i-1], idealPath.pathPoints[i-2]);     
            } else {
                idealIm1Angle = 0;
            }

            let firstScore = dpTable[i-1] + this.scoreFunction(userJAngle, idealIAngle);
            let secondScore = newDPTable[i-1] + this.scoreFunction(userJm1Angle, idealIAngle) + 1.5;
            let thirdScore = dpTable[i] + this.scoreFunction(userJAngle, idealIm1Angle) + 1.5; 
        
            let score = Math.min(firstScore, secondScore, thirdScore)
            newDPTable.push(score);
        }
        return newDPTable;
    }, 
    // Finds the spot on the ideal path with the minimal score
    //   FootPath's estimation of where user is on the path (FootPath Algorithm)
    footpathEstimate: function(dpTable) {
        let optimalPathIndex = 0;
        for (let i = 0; i < dpTable.length; i++) {
            if (dpTable[i] < dpTable[optimalPathIndex]) {
                optimalPathIndex = i;
            }
        } 
        return optimalPathIndex;
    },
    NUMPARTICLES: 10000,
    particles: [],
    getNextState: function() { },
    getMeasurement: function() { },
    getProbOfMeasurement: function() { },
    initParticles: function() {
        for (let i = 0; i < this.NUMPARTICLES; i++) {
            this.particles.push( new Point(800*Math.random(), 600*Math.random()) ); 
        }   
    },
    normalize: function(array) {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        for (let i = 0; i < array.length; i++) {
            array[i] /= sum;
        }
    },
    resample: function(particles, weights) {
        let newParticles = [];
        for (let i = 0; i < this.NUMPARTICLES; i++) {
            let r = Math.random();
            let i, s = 0;
            for (i = 0; i < this.NUMPARTICLES; i++) {
                s += weights[i];
                if (s > r) {
                    break;
                }
            }
            let p = new Point(this.particles[i].x, this.particles[i].y);
            newParticles.push(p);
        } 
        return newParticles; 
    },
    update: function(control, measurement) {
        for (let i = 0 ; i < this.NUMPARTICLES; i++) {
            this.particles[i] += this.getNextState(control, this.particles[i]);
        }
        let weights = [];
        for (let i = 0; i < this.NUMPARTICLES; i++) {
            this.weights = this.getProbOfMeasurement(measurement, this.particles[i]);
        }
        weights = this.normalize(weights);
        this.particles = this.resample(this.particles, weights);
    }, 
};

*/

