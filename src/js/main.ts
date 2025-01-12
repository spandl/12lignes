import Lenis from 'lenis';

import 'lenis/dist/lenis.css';
import '../css/audio.scss';
import '../css/structure.scss';

console.log('Hello Claude');

// Initialize Lenis (vertical scrolling only)
let scrollSpeed = 1; // Initial speed value
const lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    orientation: 'vertical',
    // virtualScroll: (e) => handleVirtualScroll(e, scrollSpeed),
});

const horizontalScrollSection = document.querySelector('#scroll-container') as HTMLElement | null;
const scrollContainer = document.querySelector('#scroll') as HTMLElement | null;
const creditSection = document.querySelector('#credits') as HTMLElement | null;

if (!horizontalScrollSection || !creditSection) {
    console.error('Horizontal scroll section or closing section not found');
}

let horizontalScrollActive = false;

const initSizes = () => {
    const screenWidth = window.innerWidth;
    const contentItems = document.querySelectorAll('.content-item');

    const horizontalScrollSectionWidth = Array.from(contentItems).reduce((total, item) => {
        const contentItem = item as HTMLElement;
        return total + contentItem.offsetWidth;
    }, 0);
    const verticalExtraSpace = horizontalScrollSectionWidth - screenWidth;
    // console.log('verticalExtraSpace', verticalExtraSpace);

    const spacer = document.querySelector('#spacer') as HTMLElement | null;
    if (spacer) spacer.style.height = `${verticalExtraSpace}px`;
}



const handleVirtualScroll = (e: any, speed: number) => {
    if (horizontalScrollActive) {
        e.deltaY /= speed; // Slow down vertical scroll by dividing deltaY
    }
    return true; // Allow the scroll to be smoothed
}

/*
TODO > horizontal scroll

* Add real text
* Fixed position for audio player
* Overlay canvas for visual animation
* Design
* Fine-tune transition between horizontal and vertical scrolling
*/





lenis.on('scroll', (e) => {

    const { scroll } = e;

    // console.log(`Scroll position: ${Math.round(scroll)}`);
    if (!horizontalScrollSection) return;

    const sectionTop = horizontalScrollSection.offsetTop;
    const sectionBottom = sectionTop + horizontalScrollSection.offsetHeight;
    const creditSectionTop = creditSection.offsetTop;

    const containerWidth = horizontalScrollSection.scrollWidth;

    // Check if we're vertically within the horizontal scrolling section

    if (scroll >= sectionTop && scroll < sectionBottom - 500 && !horizontalScrollActive) {
        // horizontalScrollActive = true;
        // console.log("enter horizontal scrolling", Math.round(scroll));

    } else if ((scroll < sectionTop || scroll >= sectionBottom) && horizontalScrollActive) {
        horizontalScrollActive = false;
        // console.log("exit horizontal scrolling");
    }

    //     console.log('horizontalScrollActive', horizontalScrollActive)

    if (horizontalScrollActive) {

        const screenWidth = window.innerWidth;
        const scrollWidth = containerWidth - screenWidth
        const diff = sectionBottom - creditSectionTop;
        const xPos = -(scrollWidth + diff)
        // console.log('offset', xPos, containerWidth, diff);
        // console.log('progress', lenis.progress);
        scrollContainer.style.transform = `translate(${xPos}px)`;

    }
});




document.addEventListener('DOMContentLoaded', () => {
    initSizes();
    lenis.start();
});