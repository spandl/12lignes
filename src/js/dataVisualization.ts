import * as d3 from "d3";
import p5 from 'p5';

interface IAudioData {
    loudness: number,
    timeDomain: Uint8Array
}

type TLineData = ILineDataPoint[][]

interface ILineDataPoint {
    x: number,
    y: number,
    r: number
}

/* 
TODO > minor updates
* resize event listener
* Change color from outside
* Remove empty bin at bottom
* Performance
*/

const NUM_LINES = 20; // Number of lines

const dotRadius = 2;
const xStep = 1;
const endPoint = 0.75;
const fadeInSpace = 0.05; // last 10% of data is faded

// Initialize data containers
const sketchContainer = document.getElementById('audio-visualization')
let linesData: TLineData = [[]];

const binGenerator = d3
    .bin()
    .thresholds(NUM_LINES);

let yScale: d3.ScaleLinear<number, number, never>;



// Function to process the audio data and update linesData
export const updateViz = (container: HTMLElement, audioData: IAudioData): void => {
    const { loudness, timeDomain } = audioData;
    const { width } = container.getBoundingClientRect();
    const { loudnessScale } = refreshViz(width)


    const vizWidth = width * endPoint;
    const bins = binGenerator(timeDomain);

    // Drawing based on bin data
    bins.forEach((bin, lineIndex) => {
        const average = d3.mean(bin) ?? 0;
        const y = yScale(average);

        if (!linesData[lineIndex]) linesData[lineIndex] = [];

        linesData[lineIndex].push({
            x: xStep * linesData[lineIndex].length,
            y,
            r: loudnessScale(loudness),
        });

        const newLength = linesData[lineIndex].length
        if (newLength > vizWidth) {
            linesData[lineIndex].splice(0, newLength - vizWidth);
        }
    });
}


export const initViz = (container: HTMLElement) => {
    const { width, height } = container.getBoundingClientRect();
    const { opacityScale } = refreshViz(width)
    const backColor = 'rgba(255, 255, 255, 0)';

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

        /* 
        TODO > stop music, stop rendering
        */

        sketch.draw = () => {
            sketch.background(backColor);
            // Draw all dots
            for (let i = 0; i < linesData.length; i++) {
                const line = linesData[i];

                line.forEach((point, position) => {
                    const alpha = opacityScale(position);

                    // alpha is based on x position && alphaScale
                    dotColor.setAlpha(256 * alpha)
                    sketch.fill(dotColor);

                    const x = position - width / 2;
                    const y = point.y - height / 2;
                    const radius = point.r;
                    sketch.circle(x, y, radius);
                });
            }
        };
    }, sketchContainer);
}

export const refreshViz = (width) => {

    const animationWidth = endPoint * width;
    const fadeStart = animationWidth - animationWidth * fadeInSpace;
    const dotOpacity = 0.25


    const opacityScale = d3
        .scaleLinear()
        .domain([fadeStart, animationWidth])
        .range([dotOpacity, 0])
        .clamp(true);

    const loudnessScale = d3
        .scaleLinear()
        .domain([1, 30]) // 15 = pretty loud
        .range([1, 6])
        .clamp(true);

    const a = opacityScale(10);
    const b = opacityScale(100);
    const c = opacityScale(490);
    const d = opacityScale(520);
    return { opacityScale, loudnessScale }

}


