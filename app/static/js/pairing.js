// JavaScript source code

function initPairingListener() {

    
    //pairing
    $("#pairButton").on('click', function () {
        if ($('#selection_pair').val() !== 'Car ID') {
          //  const step3 = new Step(
            //    'Pairing Success', 'Pairing Success', 'Pairing Successful', '.pairing', 3000, function () { }, function () { }, [{ text: "Close", action: "pairing_tour.stop()" }], []
           // );
            
           // pairing_tour.steps.push(step3);
           // pairing_tour.start();
            alert('pair successful');
            $('#red').removeClass('led-red');
            $('#green').removeClass('led-green').addClass('led-green');

        } else { //false
            //const step4 = new Step(
            //    'Error', 'Pair error', 'Pairing Not Successful', '.pairing', 3000, function () { }, function () { }, [{ text: "Close", action: "pairing_tour.stop()" }], []
            //);

            //pairing_tour.steps.push(step4);
            //pairing_tour.start();
            alert('failed to pair');

            $('#green').removeClass('led-green');
            $('#red').removeClass('led-red').addClass('led-red');
        }
    });

}
