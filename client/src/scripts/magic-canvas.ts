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
    const gridGraphics = new PIXI.Graphics();
    const lineGraphics = new PIXI.Graphics();
    app.stage.addChild(background);
    app.stage.addChild(gridGraphics);
    app.stage.addChild(lineGraphics);


    let gridSize = 5;
    function setup() {

        background.beginFill(0x0E141B);
        background.drawRect(0, 0, WIDTH, HEIGHT);
        background.endFill();


        for (let x = gridSize; x <= WIDTH - gridSize; x += gridSize) {
            for (let y = gridSize; y <= HEIGHT - gridSize; y += gridSize) {
                lineGraphics.lineStyle(1, 0x1a2128).moveTo(x, y).lineTo(WIDTH / 2, HEIGHT / 2);
            }
        }

        for (let x = gridSize; x <= WIDTH - gridSize; x += gridSize) {
            for (let y = gridSize; y <= HEIGHT - gridSize; y += gridSize) {
                gridGraphics.beginFill(0x5e6a77);
                gridGraphics.drawRect(x - 2, y - 2, 5, 5);
                gridGraphics.endFill();
            }
        }

        gridSize++;


    }
setup()
}


//     let counter = 0;
//     app.ticker.add((delta) => {

//         counter += delta
//         if (counter > 50) {
//             lineGraphics.clear();
//             gridGraphics.clear();
//             background.beginFill(0x0E141B);
//             background.drawRect(0, 0, WIDTH, HEIGHT);
//             background.endFill();

//             for (let x = gridSize; x <= WIDTH - gridSize; x += gridSize) {
//                 for (let y = gridSize; y <= HEIGHT - gridSize; y += gridSize) {
//                     lineGraphics.lineStyle(1, 0x1a2128).moveTo(x, y).lineTo(WIDTH / 2, HEIGHT / 2);
//                 }
//             }

//             for (let x = gridSize; x <= WIDTH - gridSize; x += gridSize) {
//                 for (let y = gridSize; y <= HEIGHT - gridSize; y += gridSize) {
//                     gridGraphics.beginFill(0x5e6a77);
//                     gridGraphics.drawRect(x - 2, y - 2, 5, 5);
//                     gridGraphics.endFill();

//                 }
//             }

//             gridSize++;
//             counter = 0;
//             console.log(gridSize)
//         }
//     });
// }