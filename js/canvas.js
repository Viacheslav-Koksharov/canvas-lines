const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.querySelector("button");
canvas.width = 900;
canvas.height = 450;
let storedLines = [];
let x = 0;
let y = 0;
let isDown;

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
button.addEventListener("click", clearCanvas);

function handleMouseDown(event) {
    const { mouseX, mouseY } = getCanvasCoords(event);
    isDown = true;
    x = mouseX;
    y = mouseY;
}

function handleMouseMove(event) {
    if (isDown) {
        redrawStoredLines();
        const { mouseX, mouseY } = getCanvasCoords(event);
        drawLines(x, y, mouseX, mouseY);
        let newLine = [x, y, mouseX, mouseY]
        if (storedLines.length) { checkCross(newLine) }
    }
}

function handleMouseUp(event) {
    if (event.button !== 0) {
        redrawStoredLines();
    } else {
        isDown = false;
        const { mouseX, mouseY } = getCanvasCoords(event);
        let newLine = [x, y, mouseX, mouseY]
        storedLines.push(newLine);
    }
}

function getCanvasCoords(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    return {
        mouseX,
        mouseY
    }
}

function redrawStoredLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (storedLines.length == 0) {
        return;
    }
    for (let i = 0; i < storedLines.length; i++) {
        const line = storedLines[i];
        drawLines(...line);
        checkCross([...line])
    }
}

function clearCanvas() {
    for (let i = 0; i < storedLines.length; i++) {
        const line = storedLines[i];
        collapse(...line);
        collapse(line[2], line[3], line[0], line[1]);
    }
}

function collapse(startX, startY, endX, endY) {
    const start = Date.now();
    let timestamp = 3000;

    function getCoords() {
        let initX = startX;
        let initY = startY;
        const interval = Date.now() - start;

        const lengthX = (endX - startX);
        const lengthY = (endY - startY);
        const diffX = lengthX * interval / timestamp / 2;
        const diffY = lengthY * interval / timestamp / 2;

        initX += diffX;
        initY += diffY;
        drawLines(startX, startY, initX, initY);
        ctx.strokeStyle = 'white';

        if (interval < timestamp) {
            requestAnimationFrame(getCoords);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'black';
            storedLines = [];
        }
    }
    requestAnimationFrame(getCoords);
}

function drawLines(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function checkCross([x1, y1, x2, y2]) {
    let n;
    storedLines.forEach(([x3, y3, x4, y4]) => {
        if (y2 - y1 != 0) {
            let q = (x2 - x1) / (y1 - y2);
            let sn = (x3 - x4) + (y3 - y4) * q;
            if (!sn) { return 0; }
            let fn = (x3 - x1) + (y3 - y1) * q;
            n = fn / sn;
        }
        else {
            if (!(y3 - y4)) { return 0; }
            n = (y3 - y1) / (y3 - y4);
        }
        let dot = [];
        dot[0] = x3 + (x4 - x3) * n;
        dot[1] = y3 + (y4 - y3) * n;

        function compareNumbers(a, b) {
            if (a > b) return 1;
            if (a == b) return 0;
            if (a < b) return -1;
        }

        isDotOnTheLines(dot, [x1, x2].sort(compareNumbers),
            [y1, y2].sort(compareNumbers),
            [x3, x4].sort(compareNumbers),
            [y3, y4].sort(compareNumbers),
        )
        return 1;
    })
}

function isDotOnTheLines([dotX, dotY], [x1, x2], [y1, y2], [x3, x4], [y3, y4]) {
    if (dotX >= x1 && dotX <= x2 && dotY >= y1 && dotY <= y2 && dotX >= x3 && dotX <= x4 && dotY >= y3 && dotY <= y4) {
        ctx.fillStyle = "red"
        ctx.fillRect(dotX - 2, dotY - 2, 4, 4)
    }
}
