import * as PIXI from 'pixi.js';
import Liquid from './components/liquid';
import Mover from './components/mover';

const canvasContainer = document.getElementById("pixi-container");

if (canvasContainer) {
    const WIDTH = canvasContainer.offsetWidth;
    const HEIGHT = canvasContainer.offsetHeight;

    const app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
    canvasContainer.appendChild(app.view);

    const background = new PIXI.Graphics();
    const liquidGraphics = new PIXI.Graphics();
    const moverGraphics = new PIXI.Graphics();
    app.stage.addChild(background);
    app.stage.addChild(liquidGraphics);
    app.stage.addChild(moverGraphics);

    // Rectangle
    let movers: Array<Mover> = [];
    let liquid: Liquid;

    function setup() {
        liquid = new Liquid(0, HEIGHT/3, WIDTH, HEIGHT, 1)
        for (let i = 1; i < WIDTH; i += WIDTH / 100) {
            movers.push(new Mover(i, 5, 5 + Math.random() * 30));
        }

        background.beginFill(0x0E141B);
        background.drawRect(0, 0, WIDTH, HEIGHT);
        background.endFill();

        liquid.display(liquidGraphics);
    }

    function draw() {
        moverGraphics.clear();
        for (let i = 0; i < movers.length; i++) {
            // Is the Mover in the liquid?
            if (liquid.contains(movers[i])) {
                // Calculate drag force
                let dragForce = liquid.calculateDrag(movers[i]);
                // Apply drag force to Mover
                movers[i].applyForce(dragForce);
            }

            // Gravity is scaled by mass here!
            let gravity = new PIXI.Point(0, 0.05 * movers[i].mass);
            // Apply gravity
            movers[i].applyForce(gravity);

            // Update and display
            movers[i].update();
            movers[i].display(moverGraphics);
            movers[i].checkEdges(HEIGHT);
        }

    }

    setup();
    app.ticker.add((delta) => {
        draw();
    });

}