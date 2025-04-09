gsap.registerPlugin(Observer);

let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    // splitHeadings = headings.map(heading => new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text" })),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function gotoSection(index, direction) {
    index = wrap(index);
    animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
            defaults: { duration: 1.25, ease: "power1.inOut" },
            onComplete: () => animating = false
        });

    if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
            .set(sections[currentIndex], { autoAlpha: 0 });
    }
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: i => i ? -100 * dFactor : 100 * dFactor },
        { yPercent: 0 },
        0
    )
        .fromTo(
            images[index],
            { yPercent: 15 * dFactor },
            { yPercent: 0 },
            0
        )
        // .fromTo(
        //     // splitHeadings[index].chars,
        //     { autoAlpha: 0, yPercent: 150 * dFactor },
        //     {
        //         autoAlpha: 1,
        //         yPercent: 0,
        //         duration: 1,
        //         ease: "power2",
        //         stagger: {
        //             each: 0.02,
        //             from: "random"
        //         }
        //     },
        //     0.2
        // );

    currentIndex = index;
}

Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true
});

// Start on the first section
gotoSection(0, 1);



// moving active effect b/w cards 

const cards = document.querySelectorAll('.card');
let activeIndex = 0;

function updateActiveCard() {
  cards.forEach((card, index) => {
    if (index === activeIndex) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

updateActiveCard();

setInterval(() => {
  activeIndex = (activeIndex + 1) % cards.length;
  updateActiveCard();
}, 3000);


// // Section 5: Reveal each line in 3D
// gsap.utils.toArray(".investigation .reveal-text p").forEach((el, i) => {
//   gsap.fromTo(el, 
//     { opacity: 0, z: -200 }, 
//     {
//       opacity: 1,
//       z: 0,
//       duration: 1,
//       ease: "power2.out",
//       scrollTrigger: {
//         trigger: el,
//         start: "top 80%",
//         end: "top 50%",
//         scrub: true
//       }
//     }
//   );
// });

// // Section 6: Floating shapes and text fade
// gsap.from(".problem-breakdown .floating-elements p", {
//   scrollTrigger: {
//     trigger: ".problem-breakdown",
//     start: "top 80%",
//   },
//   opacity: 0,
//   y: 50,
//   duration: 1,
//   stagger: 0.3
// });

// gsap.utils.toArray(".problem-breakdown .shape").forEach((shape, i) => {
//   gsap.to(shape, {
//     scrollTrigger: {
//       trigger: ".problem-breakdown",
//       start: "top bottom",
//       end: "bottom top",
//       scrub: true
//     },
//     rotationX: Math.random() * 360,
//     rotationY: Math.random() * 360,
//     x: (Math.random() - 0.5) * 200,
//     y: (Math.random() - 0.5) * 200,
//     z: Math.random() * 200 - 100,
//     ease: "none"
//   });
// });

// // Section 7: Assemble animation
// gsap.timeline({
//   scrollTrigger: {
//     trigger: ".the-fix",
//     start: "top 75%",
//     end: "top 50%",
//     scrub: true
//   }
// })
//   .to(".the-fix .assemble", { opacity: 1, y: 0, duration: 1, ease: "power2.out" });

// // Section 8: Climax reveal
// gsap.fromTo(".climax .message", 
//   { opacity: 0, scale: 0.8 }, 
//   {
//     opacity: 1,
//     scale: 1,
//     duration: 1,
//     ease: "back.out(1.2)",
//     scrollTrigger: {
//       trigger: ".climax",
//       start: "top 80%"
//     }
//   }
// );