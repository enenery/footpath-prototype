"use strict"

let CANVAS_ID = "simulationWorld";
let BACKGROUND_COLOR = "#eeeeee";
let FOREGROUND_COLOR = "#abcdef";
let BLACK = "#000000";
let YELLOW = "#ffeeee"
let DARK_BLUE = "#4444ff";

CanvasUtils.setCanvasAndContext(CANVAS_ID);
CanvasUtils.setBackgroundColor(BACKGROUND_COLOR);

let world = new World( POLYGON1 );
//world.addObstacle( POLYGON2 );
//world.addObstacle( POLYGON3 );
let idealPath = PATH1;

CanvasUtils.drawWorld(world, FOREGROUND_COLOR, BACKGROUND_COLOR, DARK_BLUE);
CanvasUtils.drawPath(idealPath, DARK_BLUE);

UserUtils.initUser(idealPath);
CanvasUtils.drawSprite(UserUtils.user, BLACK);

let updateUser = function() {
    UserUtils.updateUser(idealPath, world, true);
    CanvasUtils.drawSprite(UserUtils.user, BLACK);
}

let updateUserTwo = function() {
    UserUtils.updateUser(idealPath, world, false);
    CanvasUtils.drawSprite(UserUtils.user, BLACK);
}


//CanvasUtils.drawPoint(START, BLACK);
//CanvasUtils.drawPoint(END, BLACK);

//let dijkstra = function(START, END) {
//    let r = Array     
//}


//let path = FootPathUtils.generateIdealPath(world, START, END);
//CanvasUtils.drawPath(path, BLACK);


/*
CanvasUtils.setCanvasAndContext("simulationWorld");

let world = POLYGON1;

let idealPath1 = PATH1;

let cornerPath1 = FootPathGenUtils.getCornerPath(idealPath1);

let userPath1 = FootPathUtils.generateUserMovement(70, 70, cornerPath1, world);

let userPathIndex = 0, footpathIndex = 0;
let dynamicProgrammingTable = FootPathUtils.generateInitDPTable();

let reDraw = function() {
    CanvasUtils.setBackgroundColor("#eeeeee");
    CanvasUtils.drawPolygon(world, "#abcdef");
    CanvasUtils.drawPath(idealPath1, "#000000");
    CanvasUtils.drawPath(cornerPath1, "#4444ff");
    CanvasUtils.drawPath(userPath1, "#774453");
    if (userPathIndex == 0) {
        let userPoint = userPath1.pathPoints[userPathIndex];
        let nextUserPoint = userPath1.pathPoints[userPathIndex + 1];
        let userAngle = PointUtils.relativeAngle(nextUserPoint, userPoint);
        CanvasUtils.drawPosition(userPoint, userAngle, "#ffff00");  
    } else {
        let userPoint = userPath1.pathPoints[userPathIndex];
        let prevUserPoint = userPath1.pathPoints[userPathIndex - 1];
        let userAngle = PointUtils.relativeAngle(userPoint, prevUserPoint);
        CanvasUtils.drawPosition(userPoint, userAngle, "#ffff00"); 
    }
    if (footpathIndex == 0) {
        let idealPoint = idealPath1.pathPoints[footpathIndex];
        let nextIdealPoint = idealPath1.pathPoints[footpathIndex + 1];
        let idealAngle = PointUtils.relativeAngle(nextIdealPoint, idealPoint);
        CanvasUtils.drawPosition(idealPoint, idealAngle, "#ff0000");
    } else {
        let idealPoint = idealPath1.pathPoints[footpathIndex];
        let prevIdealPoint = idealPath1.pathPoints[footpathIndex - 1];
        let idealAngle = PointUtils.relativeAngle(idealPoint, prevIdealPoint);
        CanvasUtils.drawPosition(idealPoint, idealAngle, "#ff0000");
    }
};   

reDraw();

let updateUser = function() {
    if (userPathIndex < userPath1.pathPoints.length - 1) {
        userPathIndex++;
        dynamicProgrammingTable = 
            FootPathUtils.updateDPTable(dynamicProgrammingTable, userPath1, userPathIndex, idealPath1);
        reDraw();
    }
}

let updateFootpath = function() {
    footpathIndex = FootPathUtils.footpathEstimate(dynamicProgrammingTable);
    reDraw();  
}
*/

/*

let point6 = new Point(400, 300);
let point7 = new Point(170, 500);
//CanvasUtils.drawPoint(point1, "#000000"); 
//CanvasUtils.drawPoint(point2, "#736298");
//CanvasUtils.drawPoint(point3, "#766554");
CanvasUtils.drawPoint(point6, "#000000");
CanvasUtils.drawPoint(point7, "#777777");
let point8 = PolygonUtils.vistaPoint(path, point6, point7);
CanvasUtils.drawPoint(point8, "#000000");
//console.log(PolygonUtils.isInside(path, point6));
//console.log(PolygonUtils.isInside(path, point7));
CanvasUtils.drawSegment(point6, point8, "#000000");
CanvasUtils.drawSegment(point6, point7, "#000000");

*/
