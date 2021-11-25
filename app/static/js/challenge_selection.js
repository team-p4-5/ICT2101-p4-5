// JavaScript source code



const tour2 = new Tour("demo");//start challenge
const tour3 = new Tour("demo");//pairing unsucessful
const tour4 = new Tour("demo");//pairing successful


$("#startButton").on('click', function () {
    if ($('#selection').val() === 'level') {
        alert('Invalid Input! Please select the level');
        return false;
    }

    const step2 = new Step(
        'Start', 'Start', 'Challenge Started', '.started', 1000, function () { }, function () { }, [{ text: "Close", action: "tour2.stop()" }], []
    );

    tour2.steps.push(step2);
    tour2.start();

    Timer.changeTimer();
});

$('#stopButton').on('click', function () {
    Timer.stopTimer();
});
//pairing
$("#pairButton").on('click', function () {
    if ($('#selection_pair').val() !== 'Car ID') {
        const step3 = new Step(
            'Pairing Success', 'Pairing Success', 'Pairing Successful', '.pairing', 3000, function () { }, function () { }, [{ text: "Close", action: "tour3.stop()" }], []
        );

        tour3.steps.push(step3);
        tour3.start();

        $('#red').removeClass('led-red');
        $('#green').removeClass('led-green').addClass('led-green');

    } else { //false
        const step4 = new Step(
            'Error', 'Pair error', 'Pairing Not Successful', '.pairing', 3000, function () { }, function () { }, [{ text: "Close", action: "tour4.stop()" }], []
        );

        tour4.steps.push(step4);
        tour4.start();

        $('#green').removeClass('led-green');
        $('#red').removeClass('led-red').addClass('led-red');
    }
});