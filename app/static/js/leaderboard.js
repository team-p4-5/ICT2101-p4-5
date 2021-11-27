var testdata = [
{
'name' : 'KWThePro',
'time' : '00:05:05',
'difficulty' : 'Easy'
},
{
'name' : 'Serena',
'time' : '00:12:10',
'difficulty' : 'Medium'
},
{
'name' : 'Chek',
'time' : '00:18:20',
'difficulty' : 'Hard'
},
{
'name' : 'Thiru',
'time' : '00:16:25',
'difficulty' : 'Easy'
},
{
'name' : 'KWThePro',
'time' : '00:05:05',
'difficulty' : 'Medium'
},
{
'name' : 'KWThePro',
'time' : '00:05:05',
'difficulty' : 'Hard'
}
]

function retrieve_leaderboard()
{
    console.log("Before ajax call");
    $.ajax({
        url: "/get_leaderboard",
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            // Store data array in a variable
            // nodeData = nodeData.concat(data['data']); //difficulty
            //console.log(nodeData.length); debug purpose
            //data_response = data;
            //console.log(data.length);
            //console.log("After ajax response");
            //return data_response;
            testdata = data_response
            leaderboard(testdata)
        }
    })


//    setTimeout(function(){
//        getNodeData();
//    }, 500);

    //Make a ajax request for leaderboard information
    //Parse leaderboard information to ajax array
    //Js array return to leaderboard function
    //Return parsed leaderboard array
}

function sortRecordTime(data)
{
    data.sort(function (a, b) {
       return a.time.localeCompare(b.time);
     });
}

function leaderboard(data) {
//    console.log("Before function call");
//    var data = retrieve_leaderboard();
//    console.log(data.length);
//    console.log("After function call");
    var easytable = document.getElementById('easytbody');
    var mediumtable = document.getElementById('mediumtbody');
    var hardtable = document.getElementById('hardtbody');


    sortRecordTime(data);

    var easydata = data.filter(e => e.difficulty === 'Easy');
    for (var i = 0; i < easydata.length; i++){
//        console.log(data[i]["name"] + " " + data[i]["time"] + " " + data[i]["difficulty"]);
			var row = `<tr>
							<td>${easydata[i].name}</td>
							<td>${easydata[i].time}</td>
							<td>${easydata[i].difficulty}</td>
					  </tr>`
			easytable.innerHTML += row
		}

	 var mediumdata = data.filter(m => m.difficulty === 'Medium');
	 console.log(mediumdata);
     for (var j = 0; j < mediumdata.length; j++){
//        console.log(data[i]["name"] + " " + data[i]["time"] + " " + data[i]["difficulty"]);
			var row = `<tr>
							<td>${mediumdata[j].name}</td>
							<td>${mediumdata[j].time}</td>
							<td>${mediumdata[j].difficulty}</td>
					  </tr>`
			mediumtable.innerHTML += row
		}

     var harddata = data.filter(h => h.difficulty === 'Hard');
	 console.log(harddata);
     for (var k = 0; k < harddata.length; k++){
//        console.log(data[i]["name"] + " " + data[i]["time"] + " " + data[i]["difficulty"]);
			var row = `<tr>
							<td>${harddata[k].name}</td>
							<td>${harddata[k].time}</td>
							<td>${harddata[k].difficulty}</td>
					  </tr>`
			hardtable.innerHTML += row
		}

//    $.each(data, function(key, value) {
//           console.log(value["name"] + " " + value["time"] + " " + value["difficulty"]);
//            });
}
leaderboard(testdata);
