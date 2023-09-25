import * as PIXI from 'pixi.js';
import type Mover from './mover';

class Liquid {
    position: PIXI.Point
    width: number
    height: number
    c: number

    constructor(x: number, y: number, width: number, height: number, c: number) {
        this.position = new PIXI.Point(x, y);
        this.width = width;
        this.height = height;
        this.c = c;
    }

    contains(mover: Mover) {
        let l = mover.position;

        return (
            l.x > this.position.x &&
            l.x < this.position.x + this.width &&
            l.y > this.position.y &&
            l.y < this.position.y + this.height
        );
    }

    calculateDrag(mover: Mover) {
        let speed = mover.velocity.magnitude();
        let dragMag = this.c * speed * speed;

        let dragForce = mover.velocity.clone();

        dragForce = dragForce.multiplyScalar(-1);
        dragForce = dragForce.normalize();

        dragForce = dragForce.multiplyScalar(dragMag);

        return dragForce;
    }

    display(graphics: PIXI.Graphics) {
        graphics.beginFill(0x5e6a77);
        graphics.drawRect(this.position.x, this.position.y, this.width, this.height);
        graphics.endFill();
    }
}

export default Liquid;
