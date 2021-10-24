/* 
 * To Drag and drop commands event listener for Control.html
 .
 */
/* For First box event listener */
function doFirst() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox1 = document.getElementById('setbox1');
    setbox1.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox1.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox1.addEventListener("drop", dropped, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped(e) {
    e.preventDefault();
    setbox1.innerHTML = e.dataTransfer.getData('Text/html')

}

window.addEventListener("load", doFirst, false);

/*For second box event-listener*/
function doSecond() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox2 = document.getElementById('setbox2');
    setbox2.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox2.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox2.addEventListener("drop", dropped1, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped1(e) {
    e.preventDefault();
    setbox2.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doSecond, false);

/*For Third box event-listener*/
function doThird() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox3 = document.getElementById('setbox3');
    setbox3.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox3.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox3.addEventListener("drop", dropped2, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped2(e) {
    e.preventDefault();
    setbox3.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doThird, false);

/*For fourth box event-listener*/
function doFourth() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox4 = document.getElementById('setbox4');
    setbox4.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox4.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox4.addEventListener("drop", dropped3, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped3(e) {
    e.preventDefault();
    setbox4.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doFourth, false);

/*For firth box event-listener*/
function doFirth() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox5 = document.getElementById('setbox5');
    setbox5.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox5.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox5.addEventListener("drop", dropped4, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped4(e) {
    e.preventDefault();
    setbox5.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doFirth, false);

/*For Sixth box event-listener*/
function doSixth() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox6 = document.getElementById('setbox6');
    setbox6.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox6.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox6.addEventListener("drop", dropped5, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped5(e) {
    e.preventDefault();
    setbox6.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doSixth, false);

/*For Seventh box event-listener*/
function doSeventh() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox7 = document.getElementById('setbox7');
    setbox7.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox7.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox7.addEventListener("drop", dropped6, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped6(e) {
    e.preventDefault();
    setbox7.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doSeventh, false);

/*For Eightth box event-listener*/
function doEightth() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox8 = document.getElementById('setbox8');
    setbox8.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox8.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox8.addEventListener("drop", dropped7, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped7(e) {
    e.preventDefault();
    setbox8.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doEightth, false);

/*For Nineth box event-listener*/
function doNineth() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox9 = document.getElementById('setbox9');
    setbox9.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox9.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox9.addEventListener("drop", dropped8, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped8(e) {
    e.preventDefault();
    setbox9.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doNineth, false);

/*For Tenth box event-listener*/
function doTenth() {
    pic = document.getElementById('car');
    pic.addEventListener("dragstart", startDrag, false);
    setbox10 = document.getElementById('setbox10');
    setbox10.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    setbox10.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    setbox10.addEventListener("drop", dropped9, false);

}
/*Image Target and Drop*/
function startDrag(e) {
    var code = '<img id ="car" src="img/component1.jpg">';
    e.dataTransfer.setData('Text', code);
}
function dropped9(e) {
    e.preventDefault();
    setbox10.innerHTML = e.dataTransfer.getData('Text/html')
}

window.addEventListener("load", doTenth, false);

