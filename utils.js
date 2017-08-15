"use strict"

/* Point (Vector) Class Constructor - Tested */
let Point = function(nx, ny) {
    this.x = nx;
    this.y = ny;
};

/* Utility functions for points */
let PointUtils = {
    /* Check if two points are equal - Tested */
    areEqual: function(point1, point2) {
        return ((point1.x == point2.x) && (point1.y == point2.y));
    },
    /* Checks if one point is lexiographically greater than another - Tested */
    isGreater: function(point1, point2) {
        if (point1.x > point2.x) { return true; }
        else if (point1.x == point2.x) { return (point1.y > point2.y); }
        else  { return false; }
    },
    /* Gives the square of the distance between the two points - Tested */
    distanceSquared: function(point1, point2) {
        return (point1.x - point2.x)*(point1.x - point2.x) + (point1.y - point2.y)*(point1.y - point2.y);
    },
    /* (Vector Interpretation) Adds two vectors together - Tested */
    add: function(point1, point2) {
        return new Point(point1.x + point2.x, point1.y + point2.y);
    },
    /* (Vector Interpretation) Adds two vectors together, where the second vector is given in polar coordinates - Tested */
    addPolar: function(point1, mag, angle) {
        let point2 = new Point( Math.round(mag*Math.cos(angle)) , Math.round(mag*Math.sin(angle)) );
        return this.add(point1, point2);  
    },
    /* (Vector Interpretation) Subtract second vector from the first - Tested */
    subtract: function(point1, point2) {
        return new Point(point1.x - point2.x, point1.y - point2.y);
    },
    /* (Vector Interpretation) Find the norm of the vector - Tested */
    normSquared: function(point1) {
        return (point1.x*point1.x) + (point1.y*point1.y);
    },
    /* (Vector Interpretation) The angle of the vector - Tested */
    angle: function(point1) {
        let norm = Math.sqrt( this.normSquared(point1) );
        if (norm == 0) { return undefined; }
        if (point1.y >= 0)
            return Math.acos( point1.x / norm );
        else if (point1.y < 0) {
            return -Math.acos( point1.x / norm );
        }
    },
    /* (Vector Interpretation) Multiply the vector by a scalar scaleFactor - Tested */
    scale: function(point1, scaleFactor) {
        return new Point( Math.round(point1.x * scaleFactor), Math.round(point1.y * scaleFactor) );
    },
    /* (Vector Interpretation) Get the dot product of two vectors - Tested */
    dot: function(point1, point2) {
        return (point1.x*point2.x) + (point1.y*point2.y);
    },
    /* (Vector Interpretation) Get the signed cross product magnitude of the two vectors - Tested */
    cross: function(point1, point2) {
        return (point1.x*point2.y) - (point1.y*point2.x);
    },
    /* Find the distance from point 1 to the line determined by the base and tip - Tested */
    distanceSquaredToLine: function(point1, base, tip) {
        let v1 = this.subtract(point1, base);
        let v2 = this.subtract(tip, base);
        let v2normSquared = this.normSquared(v2);
        if (v2normSquared == 0) { return this.distanceSquared(point1, base); }
        let crossProductMagnitudeSquared = this.cross(v1, v2)*this.cross(v1, v2);
        return crossProductMagnitudeSquared / v2normSquared;
    },
    /* Find the orientation of three points - whether they are heading clockwise or counterclockwise or colinear - Tested */
    crossSign: function(point1, point2, point3) {
        // Positive means clockWise, Negative means CounterclockWise
        let v1 = this.subtract(point3, point2);
        let v2 = this.subtract(point1, point2);
        return Math.sign( this.cross(v1, v2) );
    },
    /* Get the angle between three points - always positive - Tested */
    absoluteAngle: function(point1, point2, point3) {
        let v1 = this.subtract(point3, point2);
        let v2 = this.subtract(point1, point2);
        let dotProduct = this.dot(v1, v2);
        let v1mag = Math.sqrt( this.normSquared(v1) );
        let v2mag = Math.sqrt( this.normSquared(v2) );
        return Math.acos( dotProduct / (v1mag * v2mag) );
    },
    /* Gets the relative angle of a line*/
    relativeAngle: function(tip, base) {
        return this.angle( this.subtract( tip, base ) );
    }
};

/* Path (Polygon) - Array of Points */
let Path = function() {
    this.pathPoints = [];
    this.addPoint = function(point) { this.pathPoints.push(point); }
};

/* Utility functions for polygons */
let PolygonUtils = {
    /* Tests to see if a point is in the polygon - uses winding angle of point - Tested */
    isInside: function(polygon, point) {
        if (polygon.pathPoints.length >= 3) {
            let totalAngle = 0;
            for (let i = 0; i < polygon.pathPoints.length; i++) {
                let j = (i + 1) % polygon.pathPoints.length;
                if (PointUtils.crossSign(point, polygon.pathPoints[i], polygon.pathPoints[j]) == 1) {
                    totalAngle += PointUtils.absoluteAngle(polygon.pathPoints[i], point, polygon.pathPoints[j]);
                } else if (PointUtils.crossSign(point, polygon.pathPoints[i], polygon.pathPoints[j]) == -1) {
                    totalAngle -= PointUtils.absoluteAngle(polygon.pathPoints[i], point, polygon.pathPoints[j]);
                } else {
                    return true; 
                }
                if (PointUtils.areEqual(polygon.pathPoints[i], point)) { return true; } 
            }
            if (Math.abs( 2*Math.PI - Math.abs(totalAngle) ) < 1e-9) {
                return true;
            }
            return false;
        } else {
            console.log("Degenerate Polygon");
            return undefined;
        }
    },
    /* Gives the intersection points between the polygon edges and the 
        ray starting at userPoint in the direction of directionPoint - Tested */
    vistaPoints: function(polygon, userPoint, directionPoint) {
        if (polygon.pathPoints.length >= 3) {
            let i, j, vPoints = [];
            for (i = 0; i < polygon.pathPoints.length; i++) {
                j = (i + 1) % polygon.pathPoints.length;
                let a = PointUtils.crossSign(polygon.pathPoints[i], userPoint, directionPoint);
                let b = PointUtils.crossSign(polygon.pathPoints[j], userPoint, directionPoint);
                let angle = PointUtils.absoluteAngle(polygon.pathPoints[i], userPoint, directionPoint)
                        + PointUtils.absoluteAngle(polygon.pathPoints[j], userPoint, directionPoint);
                if (a != b && angle < (Math.PI)) {
                    let v1 = PointUtils.subtract(directionPoint, userPoint);
                    let v2 = PointUtils.subtract(userPoint, polygon.pathPoints[i]);
                    let v3 = PointUtils.subtract(polygon.pathPoints[j], polygon.pathPoints[i]); 
        
                    let crossP1 = PointUtils.cross(v1, v2);
                    let crossP2 = PointUtils.cross(v1, v3); 
                    let disp = PointUtils.scale(v3, crossP1 / crossP2);
                    vPoints.push( PointUtils.add(polygon.pathPoints[i], disp) );
                }
            }
            return vPoints;
        } else {
            console.log("Degenerate Polygon");
            return undefined; 
        }
    }, 
}

/* World Class - Basically polygon (bigPolygon) with holes (obstacles) */
let World = function(polygon) {
    this.bigPolygon = polygon;
    this.obstacles = [];
    this.addObstacle = function(poly) { this.obstacles.push(poly); }
}

let WorldUtils = {
    /* Check to see if the point is in the polygon - in the bigPolygon but not in the obstacles - Tested */
    isInside: function(world, point) {
        if (PolygonUtils.isInside(world.bigPolygon, point)) {
            for (let i = 0; i < world.obstacles.length; i++) {
                if (PolygonUtils.isInside(world.obstacles[i], point)) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },
    /* Gives the *first* intersection point between the ray determined by userPoint and directionPoint
                        and an edge of either the world or an obstacle - Tested */
    vistaPoint: function(world, userPoint, directionPoint) {
        let vPoints = PolygonUtils.vistaPoints(world.bigPolygon, userPoint, directionPoint);
        for (let i = 0; i < world.obstacles.length; i++) {
            vPoints = vPoints.concat(PolygonUtils.vistaPoints(world.obstacles[i], userPoint, directionPoint));
        }
        let minIndex = 0;
        for (let i = 0; i < vPoints.length; i++) {
            if (PointUtils.distanceSquared(vPoints[minIndex], userPoint) > 
                    PointUtils.distanceSquared(vPoints[i], userPoint)) {
                minIndex = i;
            }  
        }
        return vPoints[minIndex];
    }
}

let Particle = function(point, angle) {
    this.position = point;
    this.orientation = angle;
}


/* Utilities to draw on Canvas */
let CanvasUtils = {
    /* Initialize canvas and context - Tested */
    canvas: null,
    context: null,
    setCanvasAndContext: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
    },
    /* Set the background color - also clears the screen - Tested */
    setBackgroundColor: function(color) {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = color;
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    },
    /* Draw a point in a given color - Tested */
    drawPoint: function(point, color) {
        this.context.fillStyle = color;
        this.context.fillRect(point.x - 2, point.y - 2, 4, 4);
    },
    /* Draw a segment connecting two points in a given color - Tested */
    drawSegment: function(base, tip, color) {
        this.context.beginPath();
        this.context.moveTo(base.x, base.y);
        this.context.lineTo(tip.x, tip.y);
        this.context.strokeStyle = color;
        this.context.stroke();
    },
    /* draw a path in a given color - Tested */
    drawPath: function(path, color) {
        for (let i = 0; i < path.pathPoints.length; i++) {
            this.drawPoint(path.pathPoints[i], color);
        }
        this.context.beginPath();
        this.context.moveTo(path.pathPoints[0].x, path.pathPoints[0].y);
        for (let i = 1; i < path.pathPoints.length; i++) {
            this.context.lineTo(path.pathPoints[i].x, path.pathPoints[i].y);
        }
        this.context.strokeStyle = color;
        this.context.stroke();
    },
    /* Draw a path and connect the last point to first - Tested */
    drawClosedPath: function(path, color) {
        for (let i = 0; i < path.pathPoints.length; i++) {
            this.drawPoint(path.pathPoints[i], color);
        }
        this.context.beginPath();
        this.context.moveTo(path.pathPoints[0].x, path.pathPoints[0].y);
        for (let i = 1; i < path.pathPoints.length; i++) {
            this.context.lineTo(path.pathPoints[i].x, path.pathPoints[i].y);
        }
        this.context.lineTo(path.pathPoints[0].x, path.pathPoints[0].y);
        this.context.strokeStyle = color;
        this.context.stroke();
    },
    /* draw a polygon and fill it in with a given color - Tested */
    drawPolygon: function(path, color) { 
        this.context.beginPath();
        this.context.moveTo(path.pathPoints[0].x, path.pathPoints[0].y);
        for (let i = 1; i < path.pathPoints.length; i++) {
            this.context.lineTo(path.pathPoints[i].x, path.pathPoints[i].y);
        }   
        this.context.fillStyle = color;
        this.context.fill();
    },
    /* Draw a world - fill in the area of the polygon, and draw the perimeter - Tested */
    drawWorld: function(world, color1, color2, color3) {
        this.drawPolygon(world.bigPolygon, color1);
        this.drawClosedPath(world.bigPolygon, color3);
        for (let i = 0; i < world.obstacles.length; i++) {
            this.drawPolygon(world.obstacles[i], color2);
            this.drawClosedPath(world.obstacles[i], color3);
        }
    },
    /* draw a sprite to show position estimation */
    drawSprite: function(particle, color) {
        let point = particle.position;
        let angle = particle.orientation;

        let point1 = PointUtils.addPolar(point, 6, angle);
        let point2 = PointUtils.addPolar(point, 5, angle + Math.PI);
        let point3 = PointUtils.addPolar(point2, 6, angle + (2*Math.PI / 3));
        let point4 = PointUtils.addPolar(point2, 6, angle + (4*Math.PI / 3));

        let polygon = new Path();
        polygon.pathPoints = [point1, point3, point2, point4];
        this.drawPolygon(polygon, color); 
    } 
};



