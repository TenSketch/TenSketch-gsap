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

// flip
// import { gsap } from "gsap";

const cardsnew = document.querySelectorAll(".flip-card");

cardsnew.forEach((card, index) => {
  const inner = card.querySelector(".flip-card-inner");

  // Drop from top
  gsap.fromTo(
    card,
    { y: -100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      delay: index * 4,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        // Flip after 1s
        gsap.to(inner, {
          rotateY: 180,
          delay: 1,
          duration: 0.8,
          ease: "power2.inOut",
        });
      },
    }
  );
});
