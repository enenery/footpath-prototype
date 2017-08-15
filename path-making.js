
const endOfX = 735; //user's expected path's end location in x
const endOfY = 535; //user's expected path's end location in y
const startOfX = 125; //user's starting location in x
const startOfY = 115; //user's starting location in y

let x = startOfX;
let y = startOfY;

let POLYGON1 = new Path(); //map
let PATH1 = new Path(); //user's expected path

//make rectangle map with doors - each door is 50 px in x (width) and 7 px in y (depth), each door is seperated by 100 px 
POLYGON1.pathPoints = [ new Point(50, 100), new Point(100, 100),
						new Point(100, 93), new Point(150, 93), new Point(150, 100), new Point(250, 100),
						new Point(250, 93), new Point(300, 93), new Point(300, 100), new Point(400, 100),
						new Point(400, 93), new Point(450, 93), new Point(450, 100), new Point(550, 100),
						new Point(550, 93), new Point(600, 93), new Point(600, 100), new Point(700, 100),
						new Point(700, 93), new Point(750, 93), new Point(750, 100), new Point(750, 200),
						new Point(757, 200), new Point(757, 250), new Point(750, 250), new Point(750, 350),
						new Point(757, 350), new Point(757, 400), new Point(750, 400), new Point(750, 500),
						new Point(757, 500), new Point(757, 550), new Point(50, 550),
						];

//make basic rectangle map with NO doors
//POLYGON1.pathPoints = [ new Point(50, 100), new Point(750, 100), new Point(750, 550), new Point(50, 550)];


	//make user's expected path involving a turn

	while(x <= endOfX){
		PATH1.addPoint(new Point(x, startOfY));
		x += 15;
	}

	while(y <= endOfY){
		PATH1.addPoint(new Point(endOfX, y));
		y += 15;
	}

/*
	//make user's expected path NOT involving a turn
	while(x <= endOfX){
		PATH1.addPoint(new Point(x, startOfY));
		x += 15;
	}
*/
