import * as d3 from "d3";
import p5 from 'p5';

const NUM_LINES = 20; // Number of lines
const DOT_RADIUS = 2;


const xStep = 1;
const endPoint = 0.75;
const fadeInSpace = 0.1;

// Initialize data containers
const sketchContainer = document.getElementById('audio-visualization')
let linesData: { x: number; y: number }[][] = [[]];

const binGenerator = d3
    .bin()
    .thresholds(NUM_LINES);

let yScale: d3.ScaleLinear<number, number, never>;


// Function to process the audio data and update linesData
export const updateViz = (container: HTMLElement, currentTime, timeDomainArray: Uint8Array): void => {
    const { width } = container.getBoundingClientRect();
    const vizWidth = width * endPoint;
    const bins = binGenerator(timeDomainArray);

    // Drawing based on bin data
    bins.forEach((bin, lineIndex) => {
        const average = d3.mean(bin) ?? 0;
        const y = yScale(average);

        if (!linesData[lineIndex]) linesData[lineIndex] = [];

        linesData[lineIndex].push({
            x: xStep * linesData[lineIndex].length,
            y
        });

        const newLength = linesData[lineIndex].length
        if (newLength > vizWidth) {
            linesData[lineIndex].splice(0, newLength - vizWidth);
        }
    });
}


export const initViz = (container: HTMLElement) => {
    const { width, height } = container.getBoundingClientRect();
    const backColor = 'rgba(255, 255, 255, 0)';
    // const dotColor = 'rgba(24, 183, 204, 0.25)';

    yScale = d3
        .scaleLinear()
        .domain([0, 255])
        .range([height, 0]);

    new p5((sketch) => {
        const dotColor = sketch.color(24, 183, 204);
        sketch.setup = () => {
            sketch.pixelDensity(2);
            const canvas = sketch.createCanvas(width, height, sketch.WEBGL);
            canvas.elt.getContext('webgl', { antialias: true });

            sketch.noStroke();
        };

        sketch.draw = () => {
            sketch.background(backColor);
            // Draw all dots
            for (let i = 0; i < linesData.length; i++) {
                const line = linesData[i];
                line.forEach((point, position) => {
                    // alpha is based on x position && alphaScale
                    const alpha = 0.25
                    dotColor.setAlpha(256 * alpha)
                    sketch.fill(dotColor);

                    const x = position - width / 2;
                    const y = point.y - height / 2;
                    sketch.circle(x, y, DOT_RADIUS);
                });
            }
        };
    }, sketchContainer);
}
