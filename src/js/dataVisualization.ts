import * as d3 from "d3";
import p5 from 'p5';

const NUM_LINES = 20; // Number of lines
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 400;
const MAX_WIDTH_PERCENT = 0.9; // 90% of canvas
const DOT_RADIUS = 3;


const xStep = 1; //CANVAS_WIDTH * MAX_WIDTH_PERCENT / CANVAS_WIDTH * 2;

// Initialize data containers
const sketchContainer = document.getElementById('audio-visualization')
let linesData: { x: number; y: number }[][] = [[]];

const binGenerator = d3
    .bin()
    .thresholds(NUM_LINES);

const yScale = d3
    .scaleLinear()
    .domain([0, 255])
    .range([CANVAS_HEIGHT, 0]);


// Function to process the audio data and update linesData
export function updateViz(currentTime, timeDomainArray: Uint8Array): void {
    // Use d3 to bin the data dynamically

    const bins = binGenerator(timeDomainArray);

    // Populate linesData based on bins
    bins.forEach((bin, lineIndex) => {
        const average = d3.mean(bin) ?? 0;
        const y = yScale(average);
        // let currentLine;

        if (!linesData[lineIndex]) linesData[lineIndex] = [];

        linesData[lineIndex].push({
            x: xStep * linesData[lineIndex].length,
            y
        });
        const newLength = linesData[lineIndex].length
        if (newLength > CANVAS_WIDTH) {
            linesData[lineIndex].splice(0, newLength - CANVAS_WIDTH);
        }
    });
}


export function initViz() {
    new p5((sketch) => {
        sketch.setup = () => {
            sketch.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, sketch.WEBGL);
            sketch.background(30);
            sketch.noStroke();
        };



        sketch.draw = () => {
            sketch.background(30);

            // Draw all dots
            for (let i = 0; i < linesData.length; i++) {
                const line = linesData[i];
                line.forEach((point, position) => {
                    // console.log('point', point)
                    let fillColor = 'rgba(24, 183, 204, 0.25)';
                    sketch.fill(fillColor); // Dot color
                    sketch.opacity = 0.1;

                    const x = position - CANVAS_WIDTH / 2;
                    const y = point.y - CANVAS_HEIGHT / 2;
                    sketch.circle(x, y, DOT_RADIUS);
                });
            }
        };
    }, sketchContainer);
}
