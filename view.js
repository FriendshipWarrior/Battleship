/*
View
Dustin Hurst
*/
function init(){
	var shipDiv = document.getElementById("shipsDiv");
	shipDiv.innerHTML = getShips();
	var fleetLabel = document.getElementById("gameLoad");
	fleetLabel.innerHTML = gameBoard();
}
function gameBoard(){
	document.write('<center><a href="project.html" target="_blank">Project Description</a></center>');
	document.write('<center><audio src="sonar.wav" controls="controls"></audio></center>');
	imageLoad();
	player = setupPlayer(false);
	computer = setupPlayer(true);
	document.write("<center><table><tr><td align=center><p class='heading'>COMPUTER'S FLEET</p></td>"+
					"<td align=center><p class='heading'>PLAYER'S FLEET</p></td></tr><tr><td>");
	showGrid(true);
	document.write("</td><td>");
	showGrid(false);
	document.write("</td></tr></table></center>");
	document.write('<center><input type="button" onclick="javascript:location.reload(true)" value="Restart Game"></center>');
}
var imageLoaded = [];
function imageLoad(){
var i,ids = [1,2,3,4,5,6,7,8,9,10,100,101,102,103,201,202,203,204,205,206];
	for (i=0;i<ids.length;++i) {
		var img = new Image, name = "batt"+ids[i]+".gif";
		img.src = name;
		imageLoaded[i] = img;
	}
	window.status = "";
}
function showGrid(ispc) {
	var y, x; 
	for (y=0;y<cols;++y) {
		for (x=0;x<rows;++x) {
			if ( ispc ){
				document.write ('<a href="javascript:onClick('+y+','+x+');"><img name="pc'+y+'_'+x+'" src="batt100.gif" width=16 height=16></a>');
			}
			else
				document.write('<a href="javascript:void(0);"><img name="ply'+y+'_'+x+'" src="batt'+player[y][x][0]+'.gif" width=16 height=16></a>');
			}
		document.write('<br>');
	}
}
//Change image on grid
function setImage(y,x,id,ispc) {
	if ( ispc ) {
		computer[y][x][0] = id;
		document.images["pc"+y+"_"+x].src = "batt"+id+".gif";
	}
	else {
		player[y][x][0] = id;
		document.images["ply"+y+"_"+x].src = "batt"+id+".gif";
   }
}

function sinkShip(grid, shipno, ispc) {
	var y, x;
	for (y = 0; y < rows; ++y) {
		for (x = 0; x < rows; ++x) {
			if ( grid[y][x][1] == shipno )
			if (ispc) setImage(y, x, computer[y][x][2], true);
			else setImage(y, x, player[y][x][2], false);
		}
	}
}

function knowYourEnemy() {
	var y, x;
	for (y = 0; y < rows; ++y) {
		for (x = 0; x < rows; ++x) {
			if ( computer[y][x][0] == 103 )
				setImage(y, x, computer[y][x][2], true);
			else if ( computer[y][x][0] < 100 )
				setImage(y, x, computer[y][x][0], true);
		}
	}
}

function getShips() {
    var request = new XMLHttpRequest();
    request.open("GET", "ships.xml", false);
    request.send(null);

    var shipsDiv = document.getElementById("shipsDiv");
    var xmldoc = request.responseXML;

    var xmlrows = xmldoc.getElementsByTagName("ship");

    for (var r = 0; r < xmlrows.length; r++) {
	var xmlrow = xmlrows[r];
	document.write("Ship: " + xmlrow.getAttribute("name"));

	var xsize = xmlrow.getElementsByTagName("size")[0];
	document.write(", Size: " + xsize.firstChild.data);
	
	var xamount = xmlrow.getElementsByTagName("amount")[0];
	document.write(", Amount: " + xamount.firstChild.data);
	document.write("<br>");
    }
}
