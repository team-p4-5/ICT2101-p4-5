// JavaScript source code for challenge timer
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