/*
JS File containing all functions related to defining our own blockly blocks

Authors: Bernard & Xiu Qi
Last Updated: 5th December 2021
*/

// Constant Declarations
const MOVE_FORWARD = "moveForward";
const MOVE_BACKWARD = "moveBackward";
const TURN_LEFT = "turnLeft";
const TURN_RIGHT = "turnRight";


// Function to command car to move forward
function moveForward() {
    let car_response = issueCommand(MOVE_FORWARD);
    if (car_response == "") {
        console.log("[-] Could not send command to car");
    }
    else if (car_response != "0") {
        appendCommand(FORWARD);
    }
}

// Function to command car to move backward
function moveBackward() {
    let car_response = issueCommand(MOVE_BACKWARD);
    if (car_response == "") {
        console.log("[-] Could not send command to car");
    }
    else if (car_response != "0") {
        appendCommand(BACKWARD);
    }
}

// Function to command car to turn left
function turnLeft() {
    let car_response = issueCommand(TURN_LEFT);
    if (car_response == "") {
        console.log("[-] Could not send command to car");  
    }
    else if (car_response != "0") {
        appendCommand(LEFT);
    }
}

// Function to command car to turn right
function turnRight() {
    let car_response = issueCommand(TURN_RIGHT);
    if (car_response == "") {
        console.log("[-] Could not send command to car");
    }
    else if (car_response != "0") {
        appendCommand(RIGHT);
    }
}

// Function to send given command to server for relaying to car
function issueCommand(cmd) {
    // Get CSRF token from controldashboard's DOM
    let csrf_token = document.getElementById("csrf_token").value;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    let car_response = "";

    // Make POST request to server to signify start of challenge
    $.ajax({
        url: "/issueCommand",
        type: "POST",
        dataType: "json",
        data: {'command':cmd},
        async: false,
        success: function (data) {
            // console.log("[*] Data Response: " + data.msg);
            car_response = data.msg;
        },
        error: function (response) {
            car_response = "";
        }
    });

    return car_response;
}


// Function to populate retreved command history entries into the webpage
function populateCommandHistory(data) {
    let commandHistory = document.getElementById('commandHistory');

    // Reset command history information on the web page
    commandHistory.innerHTML = "";

    // Populate each command history entry into the webpage
    let row = null;

    // 
    for (var i = 0; i < data.length; i++) {
        if (data[i] == MOVE_FORWARD) {
            row = `<p style="text-align: center;">Step ${i+1}: Move Forward</p>`;
        }
        else if (data[i] == MOVE_BACKWARD) {
            row = `<p style="text-align: center;">Step ${i+1}: Move Backward</p>`;
        }
        else if (data[i] == TURN_LEFT) {
            row = `<p style="text-align: center;">Step ${i+1}: Turn Left</p>`;
        }
        else if (data[i] == TURN_RIGHT) {
            row = `<p style="text-align: center;">Step ${i+1}: Turn Right</p>`;
        }
        else {
            row = `<p style="text-align: center;">-</p>`;
        }

        commandHistory.innerHTML += row;
    }
}


// Function to make request to retrieve command history from the web server
function retrieveCommandHistory()
{
    $.ajax({
        url: "/getCommandHistory",
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            // Call function to update leaderboard fields in the webpage
            populateCommandHistory(data.history);
        },
        error: function(response) {
            setTimeout(function(){
                retrieveCommandHistory();
            }, 1000);
        }
    })
}

function initInstructionFeatures() {
    // Add event listener for "Command History" button
    $("#commandHistoryBtn").on('click', function () {
        // Call function to retrieve command history
        retrieveCommandHistory();
    });

    // Definition of custom 'moveForward' block
    Blockly.Blocks[MOVE_FORWARD] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move Forward");
            this.setInputsInline(false);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript[MOVE_FORWARD] = function (block) {
        return 'moveForward();\n';
    };


    // Definition of custom 'moveBackward' block
    Blockly.Blocks[MOVE_BACKWARD] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move Backward");
            this.setInputsInline(false);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript[MOVE_BACKWARD] = function (block) {
        return 'moveBackward();\n';
    };


    // Definition of custom 'turnLeft' block
    Blockly.Blocks[TURN_LEFT] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Turn Left");
            this.setInputsInline(false);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript[TURN_LEFT] = function (block) {
        return 'turnLeft();\n';
    };


    // Definition of custom 'turnRight' block
    Blockly.Blocks[TURN_RIGHT] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Turn Right");
            this.setInputsInline(false);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript[TURN_RIGHT] = function (block) {
        return 'turnRight();\n';
    };
}






