/*
JS File containing all functions related to the virtual map

Authors: Xiu Qi & Kah Wei
Last Updated: 5th December 2021
*/

// Global Variables
var direction = 0;
var ctx = null;
var gameMap = Array(100).fill(0);		// Initialise map
var cleared_checkpoints = [];			// Initialise list to track cleared checkpoints

var tileW = 40, tileH = 40;				// Tile width & height (px)
var mapW = 10, mapH = 10;				// Number of x and y tiles in the map
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;

var car = new Car();

var command_buffer = [];
var active_cmd = null;

// Constants
const FORWARD = 0;
const BACKWARD = 1;
const LEFT = 2;
const RIGHT = 3;

const NORTH = "0";
const EAST = "90";
const SOUTH = "180";
const WEST = "270";

var move = {
	NORTH : 0,
	EAST : 0,
	SOUTH : 0,
	WEST : 0
};


// Function to place checkpoints randomly into the virtual map
function randomizeCheckpointPlacements() {
	// Reset game map and cleared_checkpoints list
	gameMap = Array(100).fill(0);
	cleared_checkpoints = []
	car_current_position = ((car.position[0] - 5)/10)/4 + (((car.position[1] - 5)/10)/4)*10

	for (var i = 0; i < checkpoint_list.length; i++) {
		let random_location = Math.floor(Math.random() * ((gameMap.length - 1) - 0 + 1));
		// Get a new location as long as the position already has already been allocated a checkpoint / the car is on it
		while (gameMap[random_location] == 2 || random_location == car_current_position) {
			random_location = Math.floor(Math.random() * ((gameMap.length - 1) - 0 + 1));
		}
		// Assign the random location the current checkpoint
		gameMap[random_location] = checkpoint_list[i];
	}
}

// Function to manually generate a virtual map for System State Test + static checkpoint
function generateTestMap() {
	gameMap = Array(100).fill(0);
	cleared_checkpoints = [];
	gameMap[1] = 1;
}

function Car()
{
	this.tileFrom  = [1,1];
	this.tileTo    = [1,1];
	this.timeMoved  = 0;
	this.dimensions  = [30,30];
	this.position  = [45,45];
	this.delayMove  = 700;
}

Car.prototype.placeAt = function(x, y)
{
	this.tileFrom  = [x,y];
	this.tileTo    = [x,y];
	this.position  = [((tileW*x)+((tileW-this.dimensions[0])/2)),
	((tileH*y)+((tileH-this.dimensions[1])/2))];
};

// Function to buffer commands
function appendCommand(cmd) {
	command_buffer.push(cmd);
}

// Function to move car forward based on given cmd (constants FORWARD/BACKWARD/LEFT/RIGHT)
function reflectCommandOnVirtualMap() {
	// Check if command_buffer has available command to execute
	if (command_buffer.length > 0) {
		// Fully change the angle of the car first:
		while (command_buffer[0] == LEFT || command_buffer[0] == RIGHT && active_cmd == null) {
			if (command_buffer[0] == LEFT) {
				direction = direction - 90;
				// If it goes negative, make it positive
				if (direction < 0) {
					direction = direction + 360;
				}
				console.log("[*] Turning Left to: "+direction);
				command_buffer.shift();
			}
			// Or if turn right command requested
			else if (command_buffer[0] == RIGHT) {
				direction = direction + 90;
				// If it goes greater than or equalt to 360, make it positive
				if (direction >= 360) {
					direction = direction - 360;
				}
				console.log("[*] Turning Right to: "+direction);
				command_buffer.shift();
			}
		}
		
		// If no active cmd currently, take one out of the buffer
		if (active_cmd == null && car.tileFrom[0]==car.tileTo[0] && car.tileFrom[1]==car.tileTo[1]) {
			active_cmd = command_buffer[0];
			
			if (active_cmd == FORWARD) {
				// Set direction to move in
				if (parseInt(NORTH) == direction) {
					move.NORTH = move.NORTH + 1;
				}
				else if (parseInt(EAST) == direction) {
					move.EAST = move.EAST + 1;
				}
				else if (parseInt(SOUTH) == direction) {
					move.SOUTH = move.SOUTH + 1;
				}
				else if (parseInt(WEST) == direction) {
					move.WEST = move.WEST + 1;
				}
			}
			
			// If move forward command received
			else if (active_cmd == BACKWARD) {
				active_cmd = command_buffer[0];
				// Get opposite direction first
				opp_direction = Math.abs((direction+180)%360);

				// Set direction to move in
				if (parseInt(NORTH) == opp_direction) {
					move.NORTH = move.NORTH + 1;
				}
				else if (parseInt(EAST) == opp_direction) {
					move.EAST = move.EAST + 1;
				}
				else if (parseInt(SOUTH) == opp_direction) {
					move.SOUTH = move.SOUTH + 1;
				}
				else if (parseInt(WEST) == opp_direction) {
					move.WEST = move.WEST + 1;
				}
			}
		}
	}
}

// Function to make request to server for removing specific checkpoint on its Challenge instance
function removeCheckpointOnServerChallengeInstance(checkpoint) {
    // Get CSRF token from controldashboard's DOM
    let csrf_token = document.getElementById("csrf_token").value;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    // Make POST request to server to instruct removal of checkpoint on its instance of the Challenge
    $.ajax({
        url: "/removeCheckpoint",
        type: "POST",
        dataType: "json",
        data: {'checkpoint':checkpoint},
        async: false,
        success: function (data) {
            console.log("[*] Removed checkpoint '"+checkpoint+"' on server")
        },
        error: function (response) {
            console.log("[*] Failed to checkpoint '"+checkpoint+"' on server")
        }
    });
}


Car.prototype.processMovement = function(t)
{
	if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) {active_cmd = null; command_buffer.shift(); return false; }

	if((t-this.timeMoved)>=this.delayMove)
	{
		tile_value = gameMap[toIndex(this.tileTo[0], this.tileTo[1])];
		// Check if car stepped on a checkpoint
		if (tile_value != 0) {
			// Check if is first remaining checkpoint in checkpoint_list
			if (checkpoint_list.indexOf(tile_value) == 0) {
				// Add to cleared checkpoints
				cleared_checkpoints.push(tile_value);
				// Remove from checkpoint_list
				checkpoint_list.shift();
				// Call function to remove checkpoint on server's Challenge instance
				removeCheckpointOnServerChallengeInstance(tile_value);

				if (checkpoint_list.length == 0) {
					completeChallenge();
				}
			}
		}
		this.placeAt(this.tileTo[0], this.tileTo[1]);     // actual code to update new pos

		// After moving, reset the 'move' object
		move.NORTH = 0;
		move.SOUTH = 0;
		move.EAST = 0;
		move.WEST = 0;
		
	}
	else
	{
		this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

		if(this.tileTo[0] != this.tileFrom[0])
		{
			var diff = (tileW / this.delayMove) * (t-this.timeMoved);
			this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
		}
		if(this.tileTo[1] != this.tileFrom[1])
		{
			var diff = (tileH / this.delayMove) * (t-this.timeMoved);
			this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		}

		this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);

	}

	return true;
}

function toIndex(x, y)
{
	return((y * mapW) + x);
}

window.onload = function()
{
	ctx = document.getElementById('game').getContext("2d");
	requestAnimationFrame(drawGame);
	ctx.font = "bold 10pt sans-serif";
};


function drawGame()
{
	if(ctx==null) { return; }

	var currentFrameTime = Date.now();
	var timeElapsed = currentFrameTime - lastFrameTime;

	var sec = Math.floor(Date.now()/1000);
	if(sec!=currentSecond)
	{
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}
	else { frameCount++; }
	
	// Call function to pull any available command in the buffer to run
	reflectCommandOnVirtualMap();

	if(!car.processMovement(currentFrameTime))
	{
		// Move Up
		if(move.NORTH > 0 && car.tileFrom[1]>0) { car.tileTo[1]-= 1; console.log("moving up");}
		// Move Down
		else if(move.SOUTH > 0 && car.tileFrom[1]<(mapH-1)) { car.tileTo[1]+= 1; console.log("moving down");}
		// Move Left
		else if(move.WEST > 0 && car.tileFrom[0]>0) { car.tileTo[0]-= 1; console.log("moving left");}
		// Move Right
		else if(move.EAST > 0 && car.tileFrom[0]<(mapW-1)) { car.tileTo[0]+= 1; console.log("moving right");}

		if(car.tileFrom[0]!=car.tileTo[0] || car.tileFrom[1]!=car.tileTo[1])
			{ car.timeMoved = currentFrameTime; }
	}

	for(var y = 0; y < mapH; ++y)
	{
		for(var x = 0; x < mapW; ++x)
		{
			tile_value = gameMap[((y*mapW)+x)];
			// Non-checkpoint tile
			if (tile_value == 0) {
				ctx.fillStyle = "#000000";
			}
			// Cleared checkpoint
			else if (cleared_checkpoints.includes(tile_value)) {
				ctx.fillStyle = "#27d655";
			}
			// Un-cleared checkpoint
			else {
				ctx.fillStyle = "#db362a";
			}
			// Set border brush style
			ctx.strokeStyle = "#FFFFFF"
			// Fill the box and its border
			ctx.fillRect(x*tileW, y*tileH, tileW, tileH);
			ctx.strokeRect(x*tileW, y*tileH, tileW, tileH);
			ctx.font = '12pt Calibri';
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.fillText(tile_value, (x*tileW)+(tileW/2), (y*tileH)+(tileH/2)+5);
		}
	}
	ctx.fillStyle = "#0c2bf2";
	ctx.fillRect(car.position[0], car.position[1],
		car.dimensions[0], car.dimensions[1]);

	let direction_indicator = document.getElementById("direction");
	// Update the direction display
	if (direction == NORTH) {
		direction_indicator.innerHTML = "Car's Current Direction: <b>NORTH<b/>"
	}
	else if (direction == SOUTH) {
		direction_indicator.innerHTML = "Car's Current Direction: <b>SOUTH<b/>"
	}
	else if (direction == EAST) {
		direction_indicator.innerHTML = "Car's Current Direction: <b>EAST<b/>"
	}
	else if (direction == WEST) {
		direction_indicator.innerHTML = "Car's Current Direction: <b>WEST<b/>"
	}

	lastFrameTime = currentFrameTime;
	requestAnimationFrame(drawGame);
}