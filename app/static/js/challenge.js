// JavaScript source code challenge generate numbers

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

        minuteElement.innerText = '00';
        secondElement.innerText = '00';
    }
};

function initlistener() {
    $("#selection").on('change', function () {
        $(".data").hide();
        $("#" + $(this).val()).fadeIn(700);
    }).change();

    $("#startButton").on('click', function () {
        if ($('#selection').val() === 'level') {
            alert('Invalid Input! Please select the level');
            return false;
        }

        //const step2 = new Step(
        //    'Start', 'Start', 'Challenge Started', '.started', 1000, function () { }, function () { }, [{ text: "Close", action: "tour.stop()" }], []
        //);

        //tour.steps.push(step2);
        //tour.start();
        alert('Challenge Started');

        Timer.changeTimer();
    });

    $('#stopButton').on('click', function () {
        Timer.stopTimer();
    });
    $("#generateButton").on('click', function () {
        let numbersArray = createArrayOfNumbers(1, 3);

        let result = [];
        while (result.length != numbersArray.length) {
            let randomIndex = getRandomNumber(0, numbersArray.length - 1);

            if (result.includes(numbersArray[randomIndex]))
                continue;
            result.push(numbersArray[randomIndex]);
        }
        var str = '';
        for (i = 0; i < result.length; i++) {
            str += result[i] + ' ';
        }

        $('#Easy').text(str);

    });
    $("#generateButton").on('click', function () {
        if ($('#selection').val() === 'level') {
            alert('Please select the level');
            return false;
        }

        let numbersArray = createArrayOfNumbers(1, 4);

        let result = [];
        while (result.length != numbersArray.length) {
            let randomIndex = getRandomNumber(0, numbersArray.length - 1);

            if (result.includes(numbersArray[randomIndex]))
                continue;
            result.push(numbersArray[randomIndex]);
        }
        var str = '';
        for (i = 0; i < result.length; i++) {
            str += result[i] + ' ';
        }

        $('#Medium').text(str);

    });
    $("#generateButton").on('click', function () {
        let numbersArray = createArrayOfNumbers(1, 5);

        let result = [];
        while (result.length != numbersArray.length) {
            let randomIndex = getRandomNumber(0, numbersArray.length - 1);

            if (result.includes(numbersArray[randomIndex]))
                continue;
            result.push(numbersArray[randomIndex]);
        }
        var str = '';
        for (i = 0; i < result.length; i++) {
            str += result[i] + ' ';
        }

        $('#Hard').text(str);

    });

}
$(document).ready(function () {

});
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