// === GSAP Plugins ===
gsap.registerPlugin(Observer);

// === SECTION NAVIGATION SETUP ===
const sections      = document.querySelectorAll("section"),
      images        = document.querySelectorAll(".bg"),
      outerWrappers = gsap.utils.toArray(".outer"),
      innerWrappers = gsap.utils.toArray(".inner");

let currentIndex = -1,
    wrap         = gsap.utils.wrap(0, sections.length),
    animating;

// Hide all sections offscreen
gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });
sections.forEach(sec => gsap.set(sec, { autoAlpha: 0 }));

function gotoSection(index, direction) {
  index = wrap(index);
  animating = true;

  const fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl      = gsap.timeline({
          defaults: { duration: 1.25, ease: "power1.inOut" },
          onComplete: () => animating = false
        });

  // Animate out the old section
  if (currentIndex >= 0) {
    tl.to(images[currentIndex], { yPercent: -15 * dFactor })
      .set(sections[currentIndex], { autoAlpha: 0, zIndex: 0 });
  }

  // Animate in the new section
  gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
  tl.fromTo(
      [ outerWrappers[index], innerWrappers[index] ],
      { yPercent: i => i ? -100 * dFactor : 100 * dFactor },
      { yPercent: 0 },
      0
    )
    .fromTo(
      images[index],
      { yPercent: 15 * dFactor },
      { yPercent: 0 },
      0
    );

  currentIndex = index;

  // **Trigger flip‐cards only when we land on the fifth section**
  if (sections[index].classList.contains("fifth")) {
    animateFlipCards();
  }
}

// Wire up wheel/touch navigation
Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  onDown:  () => !animating && gotoSection(currentIndex - 1, -1),
  onUp:    () => !animating && gotoSection(currentIndex + 1,  1),
  tolerance: 10,
  preventDefault: true
});

// Kickoff on the first section
gotoSection(0, 1);

// === FLIP‐CARD SEQUENCE ===
let hasAnimatedCards = false;

function animateFlipCards() {
  if (hasAnimatedCards) return;
  hasAnimatedCards = true;

  const cards      = gsap.utils.toArray(".fifth .flip-card"),
        dropDur    = 1,
        flipDelay  = 1,
        hold       = 3,
        cycleTotal = dropDur + flipDelay + hold;

  cards.forEach((card, i) => {
    const inner = card.querySelector(".flip-card-inner");

    // 1) Drop in from above
    gsap.fromTo(
      card,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: dropDur,
        delay: i * cycleTotal,
        ease: "power2.out"
      }
    );

    // 2) Flip after drop + delay
    gsap.to(inner, {
      rotateY: 180,
      duration: 0.8,
      delay: i * cycleTotal + flipDelay,
      ease: "power2.inOut"
    });
  });
}
