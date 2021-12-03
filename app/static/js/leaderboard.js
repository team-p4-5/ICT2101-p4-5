// JavaScript source code
function leaderboard() {
    var leaderboard = document.getElementById('leaderboard');
    var tbody = leaderboard.querySelector('tbody');
    var printresult = '';

    var player1 = { name: "KWThePro", time: "00:05:05" };
    var player2 = { name: "Serena", time: "00:12:10" };
    var player3 = { name: "Chek", time: "00:18:20" };
    var player4 = { name: "Thiru", time: "00:16:25" };

    var players = [
        player1,
        player2,
        player3,
        player4
    ];

        //Sorting of score
        players.sort(function (a, b) {
            return a.time.localeCompare(b.time);
        });

    for (var player of players) {
        printresult += '<tr><td>' + player.name + '</td><td>' + player.time + '</td></tr>';
    }

    tbody.innerHTML = printresult;
}

leaderboard();