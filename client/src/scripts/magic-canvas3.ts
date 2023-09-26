import * as PIXI from 'pixi.js';
import Liquid from './components/liquid';
import Mover from './components/mover';

const canvasContainer = document.getElementById("pixi-container");

let values: number[] = [];
let states: number[] = [];
let barWidth = 30;

if (canvasContainer) {
    const WIDTH = canvasContainer.offsetWidth;
    const HEIGHT = canvasContainer.offsetHeight;

    const app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
    canvasContainer.appendChild(app.view);

    const background = new PIXI.Graphics();
    const graphics = new PIXI.Graphics();

    app.stage.addChild(background);
    app.stage.addChild(graphics);

    // Rectangle
    let movers: Array<Mover> = [];
    let liquid: Liquid;

    function setup() {
        for (let i = 0; i < WIDTH / barWidth; i++) {
            values.push(Math.random() * HEIGHT);
            states.push(-1);
        }
        quickSort(0, values.length - 1);

        background.beginFill(0x0E141B);
        background.drawRect(0, 0, WIDTH, HEIGHT);
        background.endFill();
    }

    function draw() {
        for (let i = 0; i < values.length; i++) {
            // color coding
            if (states[i] == 0) {
                // color for the bar at the pivot index
                graphics.beginFill(0x0E141B);
            } else if (states[i] == 1) {
                // color for the bars being sorted currently
                graphics.beginFill(0xD6FFB7);
            } else {
                graphics.beginFill(0xFFFFFF);
            }
            graphics.drawRect(i * barWidth, HEIGHT - values[i], barWidth, values[i]);
        }

        graphics.endFill()

    }

    setup();
    app.ticker.add((delta) => {
        draw();
    });

}

async function quickSort(start: number, end: number) {
    if (start > end) {  // Nothing to sort!
        return;
    }
    // partition() returns the index of the pivot element.
    // Once partition() is executed, all elements to the  
    // left of the pivot element are smaller than it and 
    // all elements to its right are larger than it.
    let index = await partition(start, end);
    // restore original state
    states[index] = -1;
    await Promise.all(
        [quickSort(start, index - 1),
        quickSort(index + 1, end)
        ]);
}

// We have chosen the element at the last index as 
// the pivot element, but we could've made different
// choices, e.g. take the first element as pivot.
async function partition(start: number, end: number) {
    for (let i = start; i < end; i++) {
        // identify the elements being considered currently
        states[i] = 1;
    }
    // Quicksort algorithm
    let pivotIndex = start;
    // make pivot index distinct
    states[pivotIndex] = 0;
    let pivotElement = values[end];
    for (let i = start; i < end; i++) {
        if (values[i] < pivotElement) {
            await swap(i, pivotIndex);
            states[pivotIndex] = -1;
            pivotIndex++;
            states[pivotIndex] = 0;
        }
    }
    await swap(end, pivotIndex);
    for (let i = start; i < end; i++) {
        // restore original state
        if (i != pivotIndex) {
            states[i] = -1;
        }
    }
    return pivotIndex;
}

// swaps elements of 'values' at indices 'i' and 'j'
async function swap(i: number, j: number) {
    // adjust the pace of the simulation by changing the
    // value
    await sleep(25);
    let temp = values[i];
    values[i] = values[j];
    values[j] = temp;
}

// custom helper function to deliberately slow down
// the sorting process and make visualization easy
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}