// audio.ts
import { setupAudioAnalyser, getAudioDataPoint, AudioDataPoint } from "./audioData";
import { updateViz } from './dataVisualization';

/* 
TODO
* https://codepen.io/craigstroman/pen/aOyRYx
* Add source into HTML
*/

document.addEventListener('DOMContentLoaded', () => {
    // Create an Audio object and load the file
    const audioElement = new Audio();

    // Setup the audio analyser once the user clicks for the first time
    let audioAnalyserSetup: ReturnType<typeof setupAudioAnalyser> | null = null;

    const audioURL = new URL('/audio/12-lignes.mp3', import.meta.url).href;
    console.log(audioURL)

    audioElement.setAttribute("src", audioURL);
    audioElement.preload = 'auto';
    audioElement.load();

    audioElement.addEventListener('waiting', () => {
        console.log('Audio is buffering, please wait...');
    });

    audioElement.addEventListener("ended", () => {
        console.log('track has ended')
    }, false);

    const playButton = document.getElementById("audio-button")!;
    const scrollbar = document.getElementById("scrollbar")!;
    const progressBar = document.getElementById("progress-bar")!;
    const scrollThumb = document.getElementById("scroll-thumb")!;

    // initViz();  // Initializes the canvas

    let isDragging = false;
    let isPlaying = false;




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
        if (!audioAnalyserSetup) {
            audioAnalyserSetup = setupAudioAnalyser(audioElement);
        }
        if (!isPlaying) {
            audioElement.play();
            isPlaying = true;
            playButton.textContent = "Pause Audio"; // Change button text to "Pause"

        } else {
            audioElement.pause();
            isPlaying = false;
            playButton.textContent = "Play Audio"; // Change button text to "Play"
        }
    });

    // Sync scrollbar with audio playback
    audioElement.addEventListener("timeupdate", () => {
        updateScrollbar();
        if (audioAnalyserSetup) {
            const { analyser, timeDomainArray, frequencyArray } = audioAnalyserSetup;
            // Get audio data (time-domain, frequency, loudness) at the current time
            const audioData: AudioDataPoint = getAudioDataPoint(
                analyser,
                timeDomainArray,
                frequencyArray,
                audioElement
            );
            const { time, loudness, frequencyDomain, timeDomain } = audioData;
            const timeArray = normalizedTimeDomainArray(timeDomain);
            updateViz(timeArray);
            const currentTime = audioElement.currentTime;
            console.log('timeupdate', currentTime)
        }

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
