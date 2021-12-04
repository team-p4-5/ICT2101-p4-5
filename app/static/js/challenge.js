/*
JS File containing all functions related to Create, Start & Stop Challenges

Authors: Bernard & Xiu Qi
Last Updated: 3rd December 2021
*/

// Global variables
var checkpoint_list = [];           // for storing list of generated checkpoints (in sequence)
var time_elapsed = "";              // for storing record time upon completing a challenge

// Function to update dropdown list on the controldashboard based on retrieved values from DB
function updateSettingsFields(settings) {
    document.getElementById('easy').value = settings["easy"];
    document.getElementById('medium').value = settings["medium"];
    document.getElementById('hard').value = settings["hard"];
}

// Function to query current challenge settings (# of checkpoints, by difficulty lvl)
function getDefaultSettings() {
    $.ajax({
        url: "/getDefaultSettings",
        type: "GET",
        dataType: "json",
        success: function (data) {
            updateSettingsFields(data);
        },
        error: function(response) {
            setTimeout(function(){
                getDefaultSettings();
            }, 1000);
        }
    });
}

// Timer variable
var Timer = {
    TimerID: null,
    elapsed: 0,

    changeTimer: function () {
        this.elapsed = 0;
        this.TimerID = setInterval(() => this.timerTick(), 1000);
    },

    timerTick: function () {
        this.elapsed++;
        var elapsed = this.elapsed;
        var minutes = Math.floor(elapsed / 60);
        var seconds = elapsed - (minutes * 60);

        if (minutes < 10)
            minutes = "0" + minutes;

        if (seconds < 10)
            seconds = "0" + seconds;

        let minuteElement = document.querySelector(".minute_time");
        let secondElement = document.querySelector(".second_time");

        minuteElement.innerText = minutes;
        secondElement.innerText = seconds;
    },

    stopTimer: function () {
        clearInterval(this.TimerID);

        let minuteElement = document.querySelector(".minute_time");
        let secondElement = document.querySelector(".second_time");

        // Store elapsed time
        time_elapsed = minuteElement.innerText + ":" + secondElement.innerText
    }
};


// Function to make the upload (creation) of a new challenge on the server
function createChallenge() {
    // Get CSRF token from controldashboard's DOM
    let csrf_token = document.getElementById("csrf_token").value;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    // Save global variable 'time_elasped' into a dictionary format
    let difficulty = $( "#selection option:selected" ).text();
    let challenge_info = {}
    challenge_info["difficulty"] = difficulty;
    challenge_info["checkpoints"] = checkpoint_list.join();

    // Send record time to server
    $.ajax({
        url: "/createChallenge",
        type: "POST",
        dataType: "json",
        data: challenge_info,
        success: function (response) {
            // Disable 'createButton' and Enable 'startButton'
            let createBtn = document.getElementById("createButton");
            let selection = document.getElementById("selection");
            let startBtn = document.getElementById("startButton");
            createBtn.disabled = true;
            selection.disabled = true;
            startBtn.disabled = false;

            // Update timer text to 00:00
            let minuteElement = document.querySelector(".minute_time");
            let secondElement = document.querySelector(".second_time");
            minuteElement.innerText = '00';
            secondElement.innerText = '00';
        }
    });
}


// Function to handle the starting of a challenge
function startChallenge() {
    // POST generated checkpoints to server
    // Get CSRF token from controldashboard's DOM
    let csrf_token = document.getElementById("csrf_token").value;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    // Make POST request to server to signify start of challenge
    $.ajax({
        url: "/startChallenge",
        type: "POST",
        dataType: "json",
        success: function (response) {
            // On success, start timer and disable button (error SHOULD NOT happen here)
            Timer.changeTimer();
            let startBtn = document.getElementById("startButton");
            startBtn.disabled = true;
        }
    });
}


// Function to handle uploading of a completed challenge's record time to server
function saveChallengeRecord() {
    // Get CSRF token from controldashboard's DOM
    let csrf_token = document.getElementById("csrf_token").value;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    // Save global variable 'time_elasped' into a dictionary format
    let record_time = {"record_time":time_elapsed};

    // Send record time to server
    $.ajax({
        url: "/saveChallenge",
        type: "POST",
        dataType: "json",
        data: record_time,
        success: function (response) {
            console.log("[*] Completed challenge with record time: "+time_elapsed);
        }
    });
}


// Function to handle the completion of a challenge
function completeChallenge() {
    // Stop Timer and track it
    Timer.stopTimer();

    // Enable 'createButton' and 'selection' dropdown list
    let createBtn = document.getElementById("createButton");
    let selection = document.getElementById("selection");
    createBtn.disabled = false;
    selection.disabled = false;

    // Call function to upload new challenge record
    saveChallengeRecord();

    // Display "Challenge Completed!" message with "Time Taken: \nMM:SS" message below
    record_time_array = time_elapsed.split(":");
    alert("Challenge Completed!\nRecord Time: " + record_time_array[0] + "min " + record_time_array[1] + "sec");

    // Call function to de-pair student with the car
    depairWithCar();
    
    // Call function to retrieve latest leaderboard information from server 
    retrieveLeaderboard();

}


// Function to initialise all features related to challenge creation and starting
function initChallengeFeatures() {
    // Add event handler to display data content
    $("#selection").on('change', function () {
        $(".data").show();
        $("#" + $(this).val()).fadeIn(700);
    }).change();

    // First retrieve challenge settings (# of checkpoints, by difficulty level)
    getDefaultSettings()

    // Add event listener for "Create Challenge" button
    $("#createButton").on('click', function () {
        // Retrieve # of checkpoints to generate based on selected difficulty level
        let selectionList = document.getElementById("selection");
        let checkpointCount = selectionList.value

        let numbersArray = createArrayOfNumbers(1, checkpointCount);

        checkpoint_list = [];       //reset the list fisrt
        while (checkpoint_list.length != numbersArray.length) {
            let randomIndex = getRandomNumber(0, numbersArray.length - 1);

            if (checkpoint_list.includes(numbersArray[randomIndex]))
                continue;
            checkpoint_list.push(numbersArray[randomIndex]);
        }

        // Build the random checkpoint sequence (string)
        var str = '';
        for (i = 0; i < checkpoint_list.length; i++) {
            str += checkpoint_list[i] + ' ';
        }

        // Add the randomly generated sequence of checkpoint numbers into the page
        $('#checkpoint_list').text(str);

        // Call function to create the challenge on the server
        createChallenge();
    });

    // Add event listener for "Start Challenge"
    $("#startButton").on('click', function () {
        // Call function to send created checkpoint list
        startChallenge();
    });
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createArrayOfNumbers(start, end) {

    let myArray = [];

    for (let i = start; i <= end; i++) {
        myArray.push(i);
    }

    return myArray;
}