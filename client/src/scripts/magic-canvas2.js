let canvas = document.getElementById("magic-canvas");
let ctx = canvas.getContext("2d");

let canvasComputedStyle = getComputedStyle(canvas);
let canvasWidth = parseFloat(canvasComputedStyle.getPropertyValue("width"), 10);
let canvasHeight = parseFloat(canvasComputedStyle.getPropertyValue("height"), 10);

console.log(canvasHeight)

var scaleX = canvas.width / canvasWidth;
var scaleY = canvas.height / canvasHeight;

var mouseX = 10;
var mouseY = 10;

const arrowSize = 10;

function setup() {
    if (ctx) {
        console.log(canvasWidth)
        console.log(canvasHeight)

        for (let i = 0; i < canvasWidth; i += arrowSize * 2) {
            for (let j = 0; j < canvasHeight; j += arrowSize * 2) {
                ctx.beginPath();
                ctx.moveTo(i * scaleX, j * scaleY);
                ctx.lineTo(i * scaleX, j * scaleY);
                ctx.stroke();
            }
        }
    }

    canvas.addEventListener("mousemove", function (event) {
        mouseX = event.clientX - canvas.getBoundingClientRect().left;
        mouseY = event.clientY - canvas.getBoundingClientRect().top;
    })
}

function mag(vecX, vecY) {
    return Math.sqrt(vecX * vecX + vecY * vecY)
}

function normalize(vecX, vecY) {
    let m = mag(vecX, vecY);
    if (m != 0) {
        return [vecX / m, vecY / m];
    }

    return [vecX, vecY]
}

// Define wave properties
var waveSpeed = 0.015; // Speed of the wave animation
var waveAmplitude = 70; // Amplitude of the wave
var waveFrequency = 0.15; // Frequency of the wave
var waveColor = "rgb(14, 20, 27)"; // Color of the wave

// Initialize the time variable
var time = 0;

function draw(event) {
    // Get the mouse coordinates relative to the canvas

    // Clear the canvas
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black"; // Replace "blue" with your desired color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

};

setup()

function drawWave() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3; // Line width in pixels
    ctx.strokeStyle = "black"; // Line color

    for (let i = 0; i < canvasWidth; i += arrowSize + (arrowSize / 1.1)) {
        for (let j = 0; j < canvasHeight; j += arrowSize + (arrowSize / 1.1)) {
            let centerX = i;
            let centerY = j;

            let deltaX = mouseX - centerX;
            let deltaY = mouseY - centerY;

            let [finalX, finalY] = normalize(deltaX, deltaY);
            finalX *= arrowSize;
            finalY *= arrowSize;

            // Draw a line from the center of the canvas to the capped mouse coordinates
            ctx.beginPath();
            ctx.moveTo(centerX * scaleX, centerY * scaleY);
            ctx.lineTo((centerX + finalX) * scaleX, (centerY + finalY) * scaleY);
            ctx.stroke();
        }
    }


    // Draw the waves
    ctx.beginPath();
    ctx.moveTo(0, canvas.height + 1000);

    for (var x = 0; x < canvas.width; x += waveAmplitude) {
        var y = waveAmplitude * Math.sin(waveFrequency * x + time);
        ctx.lineTo(x, canvas.height - (y + waveAmplitude + 100));
    }

    ctx.lineTo(canvas.width+50, canvas.height + 10);
    ctx.fillStyle = waveColor;
    ctx.fill();

    // Update the time variable for animation
    time += waveSpeed;

    // Request the next frame of animation
    requestAnimationFrame(drawWave);
}

// Start the animation loop
drawWave();