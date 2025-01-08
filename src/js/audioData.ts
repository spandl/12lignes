// audioData.ts
export interface AudioDataPoint {
    time: number;
    timeDomain: Uint8Array;
    frequencyDomain: Uint8Array;
    loudness: number;
}

export function setupAudioAnalyser(audioElement: HTMLAudioElement) {
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    const timeDomainArray = new Uint8Array(analyser.fftSize);
    const frequencyArray = new Uint8Array(analyser.frequencyBinCount);

    return { analyser, timeDomainArray, frequencyArray };
}

export function getAudioDataPoint(
    analyser: AnalyserNode,
    timeDomainArray: Uint8Array,
    frequencyArray: Uint8Array,
    audioElement: HTMLAudioElement
): AudioDataPoint {
    analyser.getByteTimeDomainData(timeDomainArray);
    analyser.getByteFrequencyData(frequencyArray);

    const rms = Math.sqrt(
        timeDomainArray.reduce((sum, value) => sum + Math.pow(value - 128, 2), 0) / timeDomainArray.length
    );
    const loudness = (rms / 128) * 100;

    return {
        time: audioElement.currentTime,
        timeDomain: Uint8Array.from(timeDomainArray),
        frequencyDomain: Uint8Array.from(frequencyArray),
        loudness: loudness,
    };
}
