const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.querySelector("button");
canvas.width = 900;
canvas.height = 450;
const storedLines = [];
let startX = 0;
let startY = 0;
let isDown;

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
button.addEventListener("click", clearCanvas);

function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    isDown = true;
    startX = mouseX;
    startY = mouseY;
}

function handleMouseMove(event) {
    if (isDown) {
        redrawStoredLines();
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }
}

function handleMouseUp(event) {
    if (event.button !== 0) {
        redrawStoredLines();
    } else {
        isDown = false;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        storedLines.push({
            x1: startX,
            y1: startY,
            x2: mouseX,
            y2: mouseY
        });
        redrawStoredLines();
    }
}

function redrawStoredLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (storedLines.length == 0) {
        return;
    }
    for (var i = 0; i < storedLines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
        ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
        ctx.stroke();
    }
}

function clearCanvas() {
    storedLines.length = 0;
    redrawStoredLines();
}

