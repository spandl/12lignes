import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../css/test.scss';

/* 
TODO

* Horizontal scrolling using scrollTrigger
* Keep Audio button always on top

4. Check out keeping items on top (toggle class)
6. Apply to website 
*/
gsap.registerPlugin(ScrollTrigger);

let sections = gsap.utils.toArray(".panel");
const section = document.querySelector('#horizontal');
const container = document.querySelector('#scroll-container');
const containerWidth = container.offsetWidth;

let scrollTween = gsap.to(sections, {
    x: -(containerWidth - section.offsetWidth),
    ease: "none",
    scrollTrigger: {
        trigger: "#horizontal",
        pin: true,
        scrub: 0.5,
        end: `+=${containerWidth}`,

    }
});


gsap.set(".image", { x: 500 });

// Parallax animation for the image (faster than the scrollTween)
sections.forEach((panel) => {
    const image = panel.querySelector(".image");
    if (image) {
        gsap.to(image, {
            x: -10, // Adjust this value to control the parallax speed
            ease: "easeInOut",
            scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                scrub: true,
                start: "left center",
                end: "right center",
                id: `parallax-${panel.classList[0]}`,
                markers: true,
            },
        });
    }
});

