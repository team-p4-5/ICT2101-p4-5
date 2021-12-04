// Function to populate retreved leaderboard data into corresponding fields on the webpage
function populateLeaderboard(data) {
    console.log(data.items);

    var easytable = document.getElementById('easytbody');
    var mediumtable = document.getElementById('mediumtbody');
    var hardtable = document.getElementById('hardtbody');


    sortRecordTime(data);
    // Reset leaderboard information on the web page
    easytable.innerHTML = "";
    mediumtable.innerHTML = "";    
    hardtable.innerHTML = "";

    var easydata = data.filter(e => e.difficulty === 'Easy');
    for (var i = 0; i < easydata.length; i++){
            var row = `<tr>
                            <td>${easydata[i].name}</td>
                            <td>${easydata[i].time}</td>
                            <td>${easydata[i].difficulty}</td>
                      </tr>`;
            easytable.innerHTML += row;
        }

    var mediumdata = data.filter(m => m.difficulty === 'Medium');
    console.log(mediumdata);
    for (var j = 0; j < mediumdata.length; j++){
        var row = `<tr>
                        <td>${mediumdata[j].name}</td>
                        <td>${mediumdata[j].time}</td>
                        <td>${mediumdata[j].difficulty}</td>
                  </tr>`;
        mediumtable.innerHTML += row;
    }

    var harddata = data.filter(h => h.difficulty === 'Hard');


    for (var k = 0; k < harddata.length; k++){
        var row = `<tr>
                        <td>${harddata[k].name}</td>
                        <td>${harddata[k].time}</td>
                        <td>${harddata[k].difficulty}</td>
                  </tr>`;
        hardtable.innerHTML += row;
    }
}


// Function to make request to retrieve leaderboard information from the web server
function retrieveLeaderboard()
{
    $.ajax({
        url: "/getLeaderboard",
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            // Call function to update leaderboard fields in the webpage
            populateLeaderboard(data);
        },
        error: function(response) {
            setTimeout(function(){
                retrieveLeaderboard();
            }, 1000);
        }
    })
}


// Function to sort data by challenge record times (in ascending order)
function sortRecordTime(data)
{
    data.sort(function (a, b) {
       return a.time.localeCompare(b.time);
     });
}


// Function to initialise leaderboard data
function initLeaderboard() {
    // Call function to retrieve past challenge records (leaderboard data)
    retrieveLeaderboard();
}
