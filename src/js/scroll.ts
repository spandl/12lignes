import Lenis from 'lenis';
import throttle from 'lodash/throttle';

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

const introSection = document.querySelector('#intro') as HTMLElement | null;
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


lenis.on(
    'scroll',
    throttle((e) => {

        const { scroll } = e;
        if (!horizontalScrollSection) return;

        const sectionTop = horizontalScrollSection.offsetTop;
        const sectionBottom = sectionTop + horizontalScrollSection.offsetHeight;

        // Check if we're vertically within the horizontal scrolling section
        if (scroll >= sectionTop && scroll < sectionBottom - 500 && !horizontalScrollActive) {
            horizontalScrollActive = true;

        } else if ((scroll < sectionTop || scroll >= sectionBottom) && horizontalScrollActive) {
            horizontalScrollActive = false;
        }


        if (horizontalScrollActive) {
            const lenis = Math.round(scroll);
            const introHeight = introSection.offsetHeight;
            const xPos = -1 * (lenis - introHeight);
            updateHorizontalScroll(xPos);

        }
    }, 16)
);


let animationFrameId: number | null = null;

const updateHorizontalScroll = (xPos: number) => {
    if (animationFrameId) return;

    // animationFrameId = requestAnimationFrame(() => {
    if (scrollContainer) {
        scrollContainer.style.transform = `translate(${xPos}px)`;
    }
    //     animationFrameId = null;
    // });
};




document.addEventListener('DOMContentLoaded', () => {
    initSizes();
    lenis.start();
});