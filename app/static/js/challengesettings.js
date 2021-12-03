// Function to query server for challenge settings once it is ready
$(window).on('load', function() {
    getDefaultSettings();
});

// Function to update fields on the webpage based on given values
function updateSettingsFields(settings) {
	document.getElementById('easy').value = settings["easy"];
	document.getElementById('medium').value = settings["medium"];
	document.getElementById('hard').value = settings["hard"];
}

// Function to retrieve default (current) challenge settings
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
            }, 500);
        }
    });
}

// Function for validating form values input for challenge settings
function validateInputFields() {
	// Get the values from DOM
	let easy = document.getElementById('easy').value
	let medium = document.getElementById('medium').value
	let hard = document.getElementById('hard').value

	// If any input is not a whole number, return 'false'
	if ((easy % 1 != 0) || (medium % 1 != 0) || (hard % 1 != 0)){
		return false;
	}
	return true;
}

// Function to update current challenge settings with values provided in the HTML form
function updateDefaultSettings(csrf_token) {
	// If user inputs are all valid (whole numbers)
	if (validateInputFields() == true) {
		$.ajaxSetup({
	        beforeSend: function(xhr, settings) {
	            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
	                xhr.setRequestHeader("X-CSRFToken", csrf_token);
	            }
	        }
	    });

		// Serialize form data into a 'settings' variable
		let settings = $("#updatechallengesettings").serialize();;

		$.ajax({
	        url: "/updateDefaultSettings",
	        type: "POST",
	        dataType: "json",
	        data: settings,
	        success: function (response) {
	            alert("Successfully updated settings!");
	        },
	        error: function(response) {
	            alert("Failed to update settings!");
	        }
	    });
	}
	// Else if any user input is invalid
	else {
		alert("Invalid input detected!\nWhole numbers only.")
	}
}
