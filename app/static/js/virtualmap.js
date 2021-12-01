let board=document.querySelector("#map");
let context=board.getContext("2d");
context.strokeStyle="black";
document.addEventListener("DOMContentLoaded", () => {
    drawmap();
})

function drawmap()
{
    for(let i=0;i<5;i++)
    {
        context.beginPath();
        context.moveTo(i*60,0);
        context.lineTo(i*60,300);
        context.stroke();
        context.moveTo(0, i*60);
        context.lineTo(300, i*60);
        context.stroke();
    }
}


