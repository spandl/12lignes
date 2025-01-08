// audio.ts
import { setupAudioAnalyser, getAudioDataPoint, AudioDataPoint } from "./audioData";
import { updateViz } from './dataVisualization';

document.addEventListener('DOMContentLoaded', () => {
    // Create an Audio object and load the file
    const audioElement = new Audio('./audio/12-lignes.mp3');
    audioElement.preload = 'auto';
    audioElement.load();

    audioElement.addEventListener('waiting', () => {
        console.log('Audio is buffering, please wait...');
    });





    const playButton = document.getElementById("audio-button")!;
    const scrollbar = document.getElementById("scrollbar")!;
    const progressBar = document.getElementById("progress-bar")!;
    const scrollThumb = document.getElementById("scroll-thumb")!;

    console.log('audioElement', audioElement)

    // initViz();  // Initializes the canvas

    let isDragging = false;
    let isPlaying = false;

    // Setup the audio analyser and the arrays to hold time-domain and frequency data
    const { analyser, timeDomainArray, frequencyArray } = setupAudioAnalyser(audioElement);

    // Update scrollbar and thumb position based on the audio's current time
    function updateScrollbar() {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (scrollThumb) {
            scrollThumb.style.left = `calc(${progress}% - 6px)`; // Center the thumb
        }
    }

    // Handle drag-and-drop for the scrollbar
    function handleDrag(event: MouseEvent) {
        if (!isDragging || !audioElement.duration) return;

        const rect = scrollbar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const newTime = (clickX / rect.width) * audioElement.duration;

        audioElement.currentTime = Math.max(0, Math.min(audioElement.duration, newTime));
        updateScrollbar();
    }

    // Play/pause functionality
    playButton.addEventListener("click", () => {
        if (!isPlaying) {
            audioElement.preload = 'auto';
            audioElement.load();
            audioElement.addEventListener('loadeddata', () => {
                console.log('Audio is fully loaded and ready to play');
                audioElement.play().catch((error) => {
                    console.error('Playback failed:', error);
                });
                isPlaying = true;
                playButton.textContent = "Pause Audio"; // Change button text to "Pause"
            });
        } else {
            audioElement.pause();
            isPlaying = false;
            playButton.textContent = "Play Audio"; // Change button text to "Play"
        }
    });

    // Sync scrollbar with audio playback
    audioElement.addEventListener("timeupdate", () => {
        updateScrollbar();

        // Get audio data (time-domain, frequency, loudness) at the current time
        // const audioData: AudioDataPoint = getAudioDataPoint(
        //     analyser,
        //     timeDomainArray,
        //     frequencyArray,
        //     audioElement
        // );
        // const { time, loudness, frequencyDomain, timeDomain } = audioData;
        // const timeArray = normalizedTimeDomainArray(timeDomain);
        // updateViz(timeArray);

        console.log('timeupdate', audioElement)

    });

    // Drag-and-drop functionality for the scrollbar thumb
    scrollThumb.addEventListener("mousedown", () => {
        isDragging = true;
    });
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", () => {
        isDragging = false;
    });
});

const normalizedTimeDomainArray = (timeDomainArray) => timeDomainArray.map((value, index) => {
    const normalized = (value - 128) / 128;
    return normalized;
});
