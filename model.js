/*
Model
Dustin Hurst
*/
var ship =  [[[1,5], [1,2,5], [1,2,3,5], [1,2,3,4,5]], [[6,10], [6,7,10], [6,7,8,10], [6,7,8,9,10]]];

//Dead ships
var dead = [[[201,203], [201,202,203], [201,202,202,203], [201,202,202,202,203]], [[204,206], [204,205,206], [204,205,205,206], [204,205,205,205,206]]];

//Ship types
var shiptypes = [["Patrol Boat",2,4],["Submarine",3,4],[ "Destroyer",4,2],[ "Carrier",5,1]];

var rows = 16, cols = 16;
var player = [], computer = [], playersships = [], computersships = [];
var playerlives = 0, computerlives = 0, playflag=true;

//Ship layout on grid
function setupPlayer(ispc) {
	var y, x;
	grid = [];
	for (y = 0; y < rows; ++y) {
		grid[y] = [];
		for (x = 0; x < rows; ++x)
			grid[y][x] = [100,-1,0];
	}
	var shipno = 0;
	var s;
	for (s = shiptypes.length - 1; s >= 0; --s) {
		var i;
		for (i = 0; i < shiptypes[s][2]; ++i) {
			var d = Math.floor(Math.random() * 2);
			var len = shiptypes[s][1], lx = rows, ly = cols, dx = 0, dy = 0;
			if (d==0) {
				lx = rows - len;
				dx = 1;
			}
			else {
				ly = cols - len;
				dy = 1;
			}
			var x, y, ok;
			do {
				y = Math.floor(Math.random() * ly);
				x = Math.floor(Math.random() * lx);
				var j, cx = x, cy = y;
				ok = true;
				for (j = 0; j < len; ++j) {
					if (grid[cy][cx][0] < 100) {
						ok = false;
					break;
					}
					cx += dx;
					cy += dy;
				}
			} while(!ok);
			var j, cx = x, cy = y;
			for ( j = 0; j < len; ++j) {
				grid[cy][cx][0] = ship[d][s][j];
				grid[cy][cx][1] = shipno;
				grid[cy][cx][2] = dead[d][s][j];
				cx+=dx;
				cy+=dy;
			}
			if (ispc) {
				computersships[shipno] = [s,shiptypes[s][1]];
				computerlives++;
			}
			else {
				playersships[shipno] = [s,shiptypes[s][1]];
				playerlives++;
			}
			shipno++;
		}
	}
	return grid;
}



//Clicker handler
function onClick( y, x) {
	if ( playflag ) {
		if (computer[y][x][0] < 100) {
			setImage( y, x, 103, true);
			var shipno = computer[y][x][1];
			if ( --computersships[shipno][1] == 0 ) {
				sinkShip(computer, shipno, true);
				alert("You sank my " + shiptypes[computersships[shipno][0]][0] + "!");
				if ( --computerlives == 0 ) {
					alert("You win! Press the Restart button\n"+
					"to play another game.");
					playflag = false;
				}
			}
			if ( playflag ) computerMove();
		}
		else if (computer[y][x][0] == 100) {
			setImage(y, x, 102, true);
			computerMove();
		}
	}
}

function computerMove() {
	var x, y, pass;
	var sx, sy;
	var selected = false;

	/* Make two passes during 'shoot to kill' mode*/
	for (pass = 0; pass < 2; ++pass) {
		for (y = 0; y < cols && !selected; ++y) {
			for (x = 0; x < rows && !selected; ++x) {
			/* Explosion shown at this position*/
				if (player[y][x][0] == 103) {
					sx = x; sy = y;
					var nup = (y > 0 && player[y-1][x][0] <= 100);
					var ndn = (y < cols-1 && player[y+1][x][0] <= 100);
					var nlt = (x > 0 && player[y][x-1][0] <= 100);
					var nrt = (x < rows-1 && player[y][x+1][0] <= 100);
					if ( pass == 0 ) {
						/* On first pass look for two explosions
						in a row - next shot will be inline*/
						var yup = (y > 0 && player[y-1][x][0] == 103);
						var ydn = (y < cols - 1 && player[y+1][x][0] == 103);
						var ylt = (x > 0 && player[y][x-1][0] == 103);
						var yrt = (x < rows - 1 && player[y][x+1][0] == 103);
						if ( nlt && yrt) { sx = x - 1; selected = true; }
						else if ( nrt && ylt) { sx = x + 1; selected = true; }
						else if ( nup && ydn) { sy = y - 1; selected = true; }
						else if ( ndn && yup) { sy = y + 1; selected = true; }
					}
					else {
					/* Second pass look for single explosion -
					fire shots all around it*/
					if ( nlt ) { sx = x - 1; selected = true; }
					else if ( nrt ) { sx = x + 1; selected = true; }
					else if ( nup ) { sy = y - 1; selected = true; }
					else if ( ndn ) { sy = y + 1; selected = true; }
					}
				}
			}
		}
	}
	if ( !selected ) {
	/* Nothing found in 'shoot to kill' mode, so we're just taking
	potshots. Random shots are in a chequerboard pattern for
	maximum efficiency, and never twice in the same place*/
		do{
			sy = Math.floor(Math.random() * cols);
			sx = Math.floor(Math.random() * rows / 2) * 2 + sy % 2;
		} while( player[sy][sx][0] > 100 );
	}
	if (player[sy][sx][0] < 100) {
		/* Hit something*/
		setImage(sy, sx, 103, false);
		var shipno = player[sy][sx][1];
		if ( --playersships[shipno][1] == 0 ) {
			sinkShip(player, shipno, false);
			alert("I sank your " + shiptypes[playersships[shipno][0]][0] + "!");
			if ( --playerlives == 0 ) {
				knowYourEnemy();
				alert("I win! Press the Restart button\n" + 
				"to play another game.");
				playflag = false;
			}
		}
	}
	else {
		/* Missed*/
		setImage(sy, sx, 102, false);
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