import { setupAudioAnalyser, getAudioDataPoint, AudioDataPoint } from "./audioData";
import { initViz, updateViz } from './dataVisualization';

document.addEventListener('DOMContentLoaded', () => {
    // Setup the audio analyser once the user clicks for the first time
    let audioAnalyserSetup: ReturnType<typeof setupAudioAnalyser> | null = null;

    const audioElement = new Audio();
    const audioURL = new URL('/audio/12-lignes.mp3', import.meta.url).href;

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
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");

    const scrollbar = document.getElementById("scrollbar")!;
    const progressBar = document.getElementById("progress-bar")!;
    const scrollThumb = document.getElementById("scroll-thumb")!;

    const audioVisualization = document.getElementById("audio-visualization")!;

    initViz(audioVisualization);  // Initializes the canvas
    window.addEventListener('resize', () => {
        initViz(audioVisualization);  // Reinitialize the canvas on resize
      });

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
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");

        } else {
            audioElement.pause();
            isPlaying = false;
            playIcon.classList.remove("hidden");
            pauseIcon.classList.add("hidden");
        }
    });


    // Control the frequency of updates with requestAnimationFrame
    let lastUpdate = 0;
    const updateFrequency = 5;
    const visualizationUpdate = (timestamp) => {
        const diff = Math.round(timestamp - lastUpdate)

        if (audioAnalyserSetup && isPlaying && diff > updateFrequency) {
            const { analyser, timeDomainArray, frequencyArray } = audioAnalyserSetup;
            // Get audio data (time-domain, frequency, loudness) at the current time
            const audioData: AudioDataPoint = getAudioDataPoint(
                analyser,
                timeDomainArray,
                frequencyArray,
                audioElement
            );

            const { loudness, timeDomain, time } = audioData; // time, frequencyDomain
            updateViz(audioVisualization, { loudness, timeDomain, time });

            lastUpdate = timestamp;
        }

        requestAnimationFrame(visualizationUpdate);
    };

    requestAnimationFrame(visualizationUpdate);

    // Sync scrollbar with audio playback
    audioElement.addEventListener("timeupdate", () => {
        updateScrollbar();
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
