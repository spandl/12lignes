import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import '../css/audio.scss';
import '../css/structure.scss';

gsap.registerPlugin(ScrollTrigger);


const initScroll = () => {
    const section = document.querySelector('#horizontal-container') as HTMLElement;
    const container = document.querySelector('#scroll-container') as HTMLElement;

    const sectionWidth = section.offsetWidth;
    const containerWidth = container.offsetWidth;

    const sections = gsap.utils.toArray(".content-item");

    let scrollTween = gsap.to(sections, {
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

    // Image parallax

    // gsap.set(".image", { x: 500 });

    // // Parallax animation for the image (faster than the scrollTween)
    // sections.forEach((panel: HTMLElement) => {
    //     const image = panel.querySelector(".image");
    //     if (image) {
    //         gsap.to(image, {
    //             x: -10, // Adjust this value to control the parallax speed
    //             ease: "easeInOut",
    //             scrollTrigger: {
    //                 trigger: panel,
    //                 containerAnimation: scrollTween,
    //                 scrub: true,
    //                 start: "left center",
    //                 end: "right center",
    //                 id: `parallax-${panel.classList[0]}`,
    //                 markers: true,
    //             },
    //         });
    //     }
    // });

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









document.addEventListener('DOMContentLoaded', () => {
    initScroll();
});