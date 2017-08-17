
const endOfX = 735; //user's expected path's end location in x
const endOfY = 535; //user's expected path's end location in y
const startOfX = 125; //user's starting location in x
const startOfY = 115; //user's starting location in y

let x = startOfX;
let y = startOfY;

let POLYGON1 = new Path(); //map
let PATH1 = new Path(); //user's expected path

//make rectangle map with closed doors - each door is 50 px in x (width) and 3 px in y (depth), each door is seperated by 100 px 
POLYGON1.pathPoints = [ new Point(50, 100), new Point(100, 100),
						new Point(100, 97), new Point(150, 97), new Point(150, 100), new Point(250, 100),
						new Point(250, 97), new Point(300, 97), new Point(300, 100), new Point(400, 100),
						new Point(400, 97), new Point(450, 97), new Point(450, 100), new Point(550, 100),
						new Point(550, 97), new Point(600, 97), new Point(600, 100), new Point(700, 100),
						new Point(700, 97), new Point(750, 97), new Point(750, 100), new Point(750, 200),
						new Point(753, 200), new Point(753, 250), new Point(750, 250), new Point(750, 350),
						new Point(753, 350), new Point(753, 400), new Point(750, 400), new Point(750, 500),
						new Point(753, 500), new Point(753, 550), new Point(50, 550),
						];

/*
//make rectangle map with open doors - each door is 50 px in x (width) and to simulate open doors, 
//the depth of each door is 40 px (y) (~ 200 cm / 80 inches) and each door is seperated by 100 px 
POLYGON1.pathPoints = [ new Point(50, 100), new Point(100, 100),
						new Point(100, 60), new Point(150, 60), new Point(150, 100), new Point(250, 100),
						new Point(250, 60), new Point(300, 60), new Point(300, 100), new Point(400, 100),
						new Point(400, 60), new Point(450, 60), new Point(450, 100), new Point(550, 100),
						new Point(550, 60), new Point(600, 60), new Point(600, 100), new Point(700, 100),
						new Point(700, 60), new Point(750, 60), new Point(750, 100), new Point(750, 200),
						new Point(790, 200), new Point(790, 250), new Point(750, 250), new Point(750, 350),
						new Point(790, 350), new Point(790, 400), new Point(750, 400), new Point(750, 500),
						new Point(790, 500), new Point(790, 550), new Point(50, 550)
						];				
*/
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

//fake user points for testing the points-csv feature
let userPoints = [
        new Point(50, 100), new Point(100, 100),
		new Point(100, 60), new Point(150, 60), new Point(150, 100), new Point(250, 100),
		new Point(250, 60), new Point(300, 60), new Point(300, 100), new Point(400, 100),
		new Point(400, 60), new Point(450, 60), new Point(450, 100), new Point(550, 100),
		new Point(550, 60), new Point(600, 60), new Point(600, 100), new Point(700, 100),
		new Point(700, 60), new Point(750, 60), new Point(750, 100), new Point(750, 200),
		new Point(790, 200), new Point(790, 250), new Point(750, 250), new Point(750, 350),
		new Point(790, 350), new Point(790, 400), new Point(750, 400), new Point(750, 500),
		new Point(790, 500), new Point(790, 550), new Point(50, 550)
    ];

//fake footpath points for testing the points-csv feature
let footpathPoints = [
    new Point(50, 100), new Point(100, 100),
	new Point(100, 60), new Point(150, 60), new Point(150, 100), new Point(250, 100),
	new Point(250, 60), new Point(300, 60), new Point(300, 100), new Point(400, 100),
	new Point(400, 60), new Point(450, 60), new Point(450, 100), new Point(550, 100),
	new Point(550, 60), new Point(600, 60), new Point(600, 100), new Point(700, 100),
	new Point(700, 60), new Point(750, 60), new Point(750, 100), new Point(750, 200),
	new Point(790, 200), new Point(790, 250), new Point(750, 250), new Point(750, 350),
	new Point(790, 350), new Point(790, 400), new Point(750, 400), new Point(750, 500),
	new Point(790, 500), new Point(790, 550), new Point(50, 550)
];

//fake particle filter points for testing the points-csv feature
let particlePoints = [
    new Point(50, 100), new Point(100, 100),
	new Point(100, 60), new Point(150, 60), new Point(150, 100), new Point(250, 100),
	new Point(250, 60), new Point(300, 60), new Point(300, 100), new Point(400, 100),
	new Point(400, 60), new Point(450, 60), new Point(450, 100), new Point(550, 100),
	new Point(550, 60), new Point(600, 60), new Point(600, 100), new Point(700, 100),
	new Point(700, 60), new Point(750, 60), new Point(750, 100), new Point(750, 200),
	new Point(790, 200), new Point(790, 250), new Point(750, 250), new Point(750, 350),
	new Point(790, 350), new Point(790, 400), new Point(750, 400), new Point(750, 500),
	new Point(790, 500), new Point(790, 550), new Point(50, 550)
];

let userAngles = [0,1,2,3,4,4,4,3,4,5,4,4]; //fake array of user's angle for each step
let footpathAngles = [3,4,5,6,7,8,8,1,1,1,1,]; //fake array of footpath's estimate of user's angle for each step
let particleAngles = [1,1,2,3,4,4,4,3,4,5,4,4]; //fake array of particle filter's estimate of user's angle for each step

function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data, data2;

        //user's points
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = 'User Actual Points\n';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        //footpath points
        result += "\nFootpath Points\n"

        keys = Object.keys(data[1]);

        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        //footpath points
        result += "\nParticle Points\n"
    
        keys = Object.keys(data[2]);

        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
 
        return result;
    }


    function downloadPointCSV(args) {
        var data, filename, link;

        var csv = convertArrayOfObjectsToCSV({
            data: userPoints, footpathPoints, particlePoints
        });

        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }

        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    function convertArrayToCSV(array, array2, array3){
    	 var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        //user's points
        data = array.data || null;
        if (data == null || !data.length) {
        	console.log("data is null");
            return null;
        }

        columnDelimiter = array.columnDelimiter || ',';
        lineDelimiter = array.lineDelimiter || '\n';

        result = 'User Actual Angle';
        result += columnDelimiter;
        result += lineDelimiter;

        for(let i = 0; i < data.length; i++){
        	result += data[i];
        	result += lineDelimiter;
        }

        data = array2.data;

        result += '\nfootpath Angle';
        result += columnDelimiter;
        result += lineDelimiter;

        for(let i = 0; i < data.length; i++){
        	result += data[i];
        	result += lineDelimiter;
        }

        data = array3.data;

        result += '\nParticle Filter Angle';
        result += columnDelimiter;
        result += lineDelimiter;

        for(let i = 0; i < data.length; i++){
        	result += data[i];
        	result += lineDelimiter;
        }
        

        return result;
    }

     function downloadAngleCSV(args) {
        var data, filename, link;

        var csv = convertArrayToCSV({data: userAngles}, {data:footpathAngles}, {data:particleAngles});

        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }

        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
