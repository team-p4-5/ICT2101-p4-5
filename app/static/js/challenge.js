// JavaScript source code challenge generate numbers



$(document).ready(function () {
    $("#selection").on('change', function () {
        $(".data").hide();
        $("#" + $(this).val()).fadeIn(700);
    }).change();
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