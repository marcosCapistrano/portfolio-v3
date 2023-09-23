const canvas = document.getElementById("magic-canvas");
const ctx = canvas.getContext("2d");
const circles = [];

// Function to generate a random number between min and max
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Circle class
class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        this.velocityX = randomInRange(-2, 2);
        this.velocityY = randomInRange(-2, 2);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Check for collisions with walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            if (this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius
            } else {
                this.x = this.radius
            }
            this.velocityX *= -0.6; // Reduced bounce (change this value as needed)
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            if (this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius
            } else {
                this.y = this.radius
            }
            this.velocityY *= -0.6; // Reduced bounce (change this value as needed)
        }
    }
}

function solveCollisions(circles) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            const circle1 = circles[i];
            const circle2 = circles[j];

            const dx = circle2.x - circle1.x;
            const dy = circle2.y - circle1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < circle1.radius + circle2.radius) {
                // Calculate the angle of collision
                const angle = Math.atan2(dy, dx);

                // Calculate the overlap distance
                const overlap = (circle1.radius + circle2.radius) - distance;

                // Move the circles apart so they don't overlap
                const moveX = (overlap / 2) * Math.cos(angle);
                const moveY = (overlap / 2) * Math.sin(angle);

                circle1.x -= moveX;
                circle1.y -= moveY;
                circle2.x += moveX;
                circle2.y += moveY;

                // Calculate the new velocities after collision
                const relativeVelocityX = circle2.velocityX - circle1.velocityX;
                const relativeVelocityY = circle2.velocityY - circle1.velocityY;
                const dotProduct = (dx * relativeVelocityX + dy * relativeVelocityY) / distance;

                // Apply the collision response
                const impulseX = (2 * dotProduct * dx) / (distance * (circle1.radius + circle2.radius));
                const impulseY = (2 * dotProduct * dy) / (distance * (circle1.radius + circle2.radius));

                circle1.velocityX += impulseX;
                circle1.velocityY += impulseY;
                circle2.velocityX -= impulseX;
                circle2.velocityY -= impulseY;
            }
        }
    }
}

// Function to create random circles
function createRandomCircles(count) {
    for (let i = 0; i < count; i++) {
        const radius = 30;
        const x = randomInRange(radius, canvas.width - radius);
        const y = randomInRange(radius, canvas.height - radius);
        circles.push(new Circle(x, y, radius));
    }
}

// Gravity
function applyGravity() {
    for (const circle of circles) {
        circle.velocityY += 0.04; // Adjust gravity strength as needed
    }
}
// Function to get the topmost circles

function getTopmostCircles(circles) {
    const topmostCircles = {};

    for (const circle of circles) {
        const x = Math.floor(circle.x);
        if (!topmostCircles[x] || topmostCircles[x].y > circle.y) {
            topmostCircles[x] = circle;
        }
    }

    return Object.values(topmostCircles);
}

// Function to render lines based on the topmost circles
function renderLiquidLines(topmostCircles, fillColor) {
    ctx.beginPath();
    ctx.strokeStyle = "#0E141B"; // Blue color for lines (adjust as needed)
    ctx.fillStyle = fillColor || "#0E141B"; // Fill color (default to blue)
    ctx.lineWidth = 2; // Line width (adjust as needed)
    ctx.lineCap = "round"

    ctx.moveTo(-10, canvas.height);
    ctx.lineTo(0, canvas.height);
    for (let i = 0; i < topmostCircles.length - 1; i++) {
        ctx.lineTo(topmostCircles[i + 1].x, topmostCircles[i + 1].y);
    }
    ctx.lineTo(canvas.width, canvas.height);

    ctx.closePath();
    ctx.stroke(); // Draw the path
    ctx.fill();  // Fill the area inside the path
}

// Function to update ball velocities based on accelerometer data
function updateBallVelocities(accelerationX, accelerationY) {
    // You may need to adjust these scaling factors to match the range of your accelerometer data
    const accelerationScaleX = 0.05; // Adjust as needed
    const accelerationScaleY = 0.05; // Adjust as needed

    for (const circle of circles) {
        // Update the ball's velocity based on accelerometer data
        circle.velocityX += accelerationX * accelerationScaleX;
        circle.velocityY += accelerationY * accelerationScaleY;
    }
}

window.addEventListener('devicemotion', handleAccelerometerData);

// Call this function when you have new accelerometer data
function handleAccelerometerData(event) {
    const accelerationX = event.accelerationIncludingGravity.x * -1;
    const accelerationY = event.accelerationIncludingGravity.y;

    updateBallVelocities(accelerationX, accelerationY);
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    solveCollisions(circles)
    for (const circle of circles) {
        circle.draw();
        circle.update();
    }

    const topmostCircles = getTopmostCircles(circles);
    // renderLiquidLines(topmostCircles);

    console.log(circles[0])


    applyGravity();
    requestAnimationFrame(animate);
}

// Create initial circles and start the animation
createRandomCircles(40);
animate();