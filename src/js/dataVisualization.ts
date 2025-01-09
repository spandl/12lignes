export function updateViz(timeDomainArray: Float32Array) {
    const width = 800;  // Width of the canvas
    const height = 200; // Height of the canvas
    const canvas = document.getElementById('waveformCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error("Failed to get canvas context");
        return;
    }


    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    const step = Math.ceil(timeDomainArray.length / width);  // Step for each pixel
    const amp = height / 2;  // Amplitude scale

    for (let i = 0; i < width; i++) {
        const min = Math.min(...timeDomainArray.slice(i * step, (i + 1) * step));
        const max = Math.max(...timeDomainArray.slice(i * step, (i + 1) * step));

        const x = i;
        const yMin = (min + 1) * amp;  // Mapping the range [-1, 1] to [0, height]
        const yMax = (max + 1) * amp;
        console.log('drawing', yMin, yMax)
        ctx.moveTo(x, yMin);
        ctx.lineTo(x, yMax);
    }

    ctx.stroke();
}
