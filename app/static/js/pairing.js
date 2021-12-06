/*
JS File containing all functions related to Pairing of Student with a Car

Authors: Bernard & Xiu Qi
Last Updated: 4th December 2021
*/

// Global variables
var paired = "";


// Function to update car ID dropdown list options
function updateCarIdOptions(data) {
    let carSelection = document.getElementById('carSelection');
    let new_option = document.createElement("option");
    new_option.text = data["id"];
    new_option.value = data["id"];
    carSelection.add(new_option);
}


// Function to make query to server for retrieving available Car IDs
function getCarID() {
    $.ajax({
        url: "/getCarID",
        type: "GET",
        dataType: "json",
        success: function (data) {
            updateCarIdOptions(data);
        },
        error: function(response) {
            setTimeout(function(){
                getCarID();
            }, 1000);
        }
    });
}


// Function to make request to server for pairing with a car
function pairWithCar() {
    // Get the selected car's ID
    let car_id = document.getElementById('carSelection').value;

    // Get CSRF token from controldashboard's DOM
    let csrf_token = document.getElementById("csrf_token").value;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    // Make Ajax POST request to server
    $.ajax({
        url: "/pairWithCar",
        type: "POST",
        dataType: "json",
        data: {"id":car_id},
        async: false,
        success: function (response) {
            console.log(response.msg);
            // Turn LED from red to green
            $('#pairing_led').removeClass('led-red');
            $('#pairing_led').removeClass('led-green').addClass('led-green');

            // Disable 'pairButton'
            let pairBtn = document.getElementById("pairButton");
            pairBtn.disabled = true;

            alert("Successfully paired with <"+car_id+">");
        },
        error: function (response) {
            alert("Unable to pair with <"+car_id+">");
            depairWithCar();
        }
    });
}


// Function to make request to server for depairing with a car
function depairWithCar() {
    // Get the selected car's ID
    let car_id = document.getElementById('carSelection').value;

    // Get CSRF token from controldashboard's DOM
    let csrf_token = document.getElementById("csrf_token").value;

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    // Make Ajax POST request to server
    $.ajax({
        url: "/depairWithCar",
        type: "POST",
        dataType: "json",
        data: {"id":car_id},
        async: false,
        success: function (response) {
            // Turn LED from green to red
            $('#pairing_led').removeClass('led-green');
            $('#pairing_led').removeClass('led-red').addClass('led-red');

            // Enable 'pairButton'
            let pairBtn = document.getElementById("pairButton");
            pairBtn.disabled = false;
        }
    });
}

// Function to initialise pairing features (e.g. event listeners for 'pair' button)
function initPairingFeatures() {
    // Call function to retrieve Car ID (car that is assumed to be already connected to the flask web server)
    getCarID();

    // Add onclick event handler for 'pairButton'
    $("#pairButton").on('click', function () {
        // If not default selection
        if ($('#carSelection').val() !== '----') {
            pairWithCar();
        }
    });
}
