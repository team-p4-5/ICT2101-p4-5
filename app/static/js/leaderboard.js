function leaderboard() {
	    var leaderboard = document.getElementById('leaderboard');
        var tbody = leaderboard.querySelector('tbody');
        var printresult = '';

        var players = [
        name:"KWThePro",time:"00:05:05",
        name:"Serena",time:"00:12:10",
        name:"Chek",time:"00:18:20",
        name:"Thiru",time:"00:16:25"
        ];

        <!-- Sorting of score -->
        players.sort(function (a, b) {
        	return a.time.localeCompare(b.time);
        });

        for (var player of players) {
            printresult += '<tr><td>' + player.name + '</td><td>' + player.time + '</td></tr>';
        }

        tbody.innerHTML = printresult;
}
leaderboard();
