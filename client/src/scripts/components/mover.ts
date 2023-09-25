import * as PIXI from 'pixi.js';
import "@pixi/math-extras"

class Mover {
    position: PIXI.Point;
    velocity: PIXI.Point;
    acceleration: PIXI.Point;
    mass: number;

    constructor(x: number, y: number, mass: number) {
        this.position = new PIXI.Point(x, y);
        this.velocity = new PIXI.Point(0, 0);
        this.acceleration = new PIXI.Point(0, 0);
        this.mass = mass;
    }

    applyForce(force: PIXI.Point) {
        let f = force.multiplyScalar(1/this.mass);
        this.acceleration = this.acceleration.add(f);
    }

    update() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
        this.acceleration = this.acceleration.multiplyScalar(0);
    }

    display(graphics: PIXI.Graphics) {
        graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        graphics.beginFill(0x0E141B, 1);
        graphics.drawCircle(this.position.x, this.position.y, this.mass*0.7);
        graphics.endFill();
    }

    checkEdges(height: number) {
        if (this.position.y > height - this.mass * 0.7) {
            this.velocity.y *= -0.9;
            this.position.y = height - this.mass * 0.7;
        }
    }
}

export default Mover;