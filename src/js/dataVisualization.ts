import * as d3 from "d3";
import p5 from 'p5';

const NUM_LINES = 20; // Number of lines
const DOT_RADIUS = 5;


const xStep = 1; //CANVAS_WIDTH * MAX_WIDTH_PERCENT / CANVAS_WIDTH * 2;

// Initialize data containers
const sketchContainer = document.getElementById('audio-visualization')
let linesData: { x: number; y: number }[][] = [[]];

const binGenerator = d3
    .bin()
    .thresholds(NUM_LINES);

let yScale;


// Function to process the audio data and update linesData
export const updateViz = (container: HTMLElement, currentTime, timeDomainArray: Uint8Array): void => {
    const { width, height } = container.getBoundingClientRect();

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
        if (newLength > width) {
            linesData[lineIndex].splice(0, newLength - width);
        }
    });
}


export const initViz = (container: HTMLElement) => {
    const { width, height } = container.getBoundingClientRect();
    const backColor = 'rgba(255, 255, 255, 0)';
    const dotColor = 'rgba(24, 183, 204, 0.15)';
    yScale = d3
        .scaleLinear()
        .domain([0, 255])
        .range([height, 0]);

    new p5((sketch) => {
        sketch.setup = () => {
            sketch.createCanvas(width, height, sketch.WEBGL);

            sketch.noStroke();
        };

        sketch.draw = () => {
            sketch.background(backColor);
            // Draw all dots
            for (let i = 0; i < linesData.length; i++) {
                const line = linesData[i];
                line.forEach((point, position) => {
                    // console.log('point', point)

                    sketch.fill(dotColor);

                    const x = position - width / 2;
                    const y = point.y - height / 2;
                    sketch.circle(x, y, DOT_RADIUS);
                });
            }
        };
    }, sketchContainer);
}
