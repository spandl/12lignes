import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import '../css/audio.scss';
import '../css/structure.scss';

gsap.registerPlugin(ScrollTrigger);


const initScroll = () => {
    const section = document.querySelector('#horizontal-container') as HTMLElement;
    const container = document.querySelector('#scroll-container') as HTMLElement;

    const sectionWidth = section.offsetWidth;
    const containerWidth = container.offsetWidth;

    const sections = gsap.utils.toArray(".content-item");

    gsap.to(sections, {
        x: -(containerWidth - sectionWidth),
        ease: "none",
        scrollTrigger: {
            trigger: "#horizontal-container",
            pin: true,
            scrub: 0.5,
            end: `+=${containerWidth}`,
            // markers: true,
        }
    });

    gsap.to("#scrollbar-container", {
        scrollTrigger: {
            trigger: "#audio-container",
            start: "top top",
            onEnter: () => gsap.to("#scrollbar-container", { position: "fixed", top: 0, duration: 0.5 }),
            onLeaveBack: () => gsap.to("#scrollbar-container", {
                position: "absolute",
                top: 130,
                duration: 0.25
            }),
        },
    });
}

window.addEventListener('load', () => {
    initScroll();
});