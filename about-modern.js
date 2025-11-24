gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// --- Hero Animation ---
const heroPath = document.querySelector(".hero-path");
if (heroPath) {
  const length = heroPath.getTotalLength();
  gsap.set(heroPath, { strokeDasharray: length, strokeDashoffset: length });
  
  const heroTl = gsap.timeline();
  heroTl.to(heroPath, {
    strokeDashoffset: 0,
    duration: 2.5,
    ease: "power2.inOut"
  })
  .from(".hero-title", {
    y: 100, 
    opacity: 0, 
    duration: 1.2, 
    ease: "power4.out"
  }, "-=1.5")
  .from(".hero-subtitle", {
    y: 30, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out"
  }, "-=0.8");
}

// --- Meaning Section ---
const meaningCircle = document.querySelector(".meaning-svg circle");
if (meaningCircle) {
  const len = 2 * Math.PI * 80; // r=80
  gsap.set(meaningCircle, { strokeDasharray: len, strokeDashoffset: len });
  
  gsap.to(meaningCircle, {
    scrollTrigger: {
      trigger: ".meaning-section",
      start: "top 70%",
    },
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.out"
  });
}

gsap.from(".meaning-text", {
  scrollTrigger: {
    trigger: ".meaning-section",
    start: "top 70%",
  },
  x: -50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

// Image Reveal and heart-image parallax removed as aboutsection-2 image is no longer present


// --- Beliefs Vertical Animation ---
gsap.utils.toArray(".belief-card-modern").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });
});

// Animate Sidebar elements
gsap.from(".beliefs-sidebar .section-heading, .beliefs-sidebar .craft-subtitle, .beliefs-sidebar .beliefs-desc, .beliefs-sidebar .btn-cta", {
  scrollTrigger: {
    trigger: ".beliefs-section",
    start: "top 70%"
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.out"
});


// --- Team Stagger ---
gsap.from(".team-member", {
  scrollTrigger: {
    trigger: ".team-grid",
    start: "top 85%"
  },
  y: 60,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: "power3.out"
});

// --- Benefits Stagger ---
gsap.from(".benefit-item", {
  scrollTrigger: {
    trigger: ".benefits-grid",
    start: "top 85%"
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.out"
});

// --- Timeline Animation ---
const timelineLine = document.querySelector(".timeline-line-svg line");
if (timelineLine) {
    // Ensure the line starts with 0 height/scale
    gsap.set(timelineLine, { scaleY: 0, transformOrigin: "top center" });

    gsap.to(timelineLine, {
      scrollTrigger: {
        trigger: ".timeline-wrapper",
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1
      },
      scaleY: 1,
      ease: "none"
    });
}

gsap.utils.toArray(".timeline-step").forEach(step => {
  gsap.from(step, {
    scrollTrigger: {
      trigger: step,
      start: "top 85%"
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });
});

const journeyPixi = document.querySelector(".timeline-journey-pixi");
const journeyPath = document.querySelector(".timeline-journey-path");
const sparkles = document.querySelectorAll(".pixi-sparkle");

if (journeyPixi && journeyPath) {
  gsap.set(journeyPixi, { rotate: -5 });

  const pixiMotion = gsap.to(journeyPixi, {
    scrollTrigger: {
      trigger: ".timeline-section",
      start: "top 70%",
      end: "bottom 10%",
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Add subtle tilt based on progress
        const tilt = Math.sin(self.progress * Math.PI * 8) * 5;
        gsap.set(journeyPixi, { rotation: `+=${tilt}` });
      }
    },
    motionPath: {
      path: journeyPath,
      align: journeyPath,
      alignOrigin: [0.5, 0.9],
      autoRotate: true,
      start: 0,
      end: 1
    },
    ease: "none"
  });

  // Sparkles follow Pixi with delay
  sparkles.forEach((sparkle, i) => {
    gsap.to(sparkle, {
      scrollTrigger: {
        trigger: ".timeline-section",
        start: "top 70%",
        end: "bottom 10%",
        scrub: 1.8 + (i * 0.3),
        invalidateOnRefresh: true
      },
      motionPath: {
        path: journeyPath,
        align: journeyPath,
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 1
      },
      opacity: 0.8,
      ease: "none"
    });
  });
}

// --- Promise Section ---
gsap.from(".promise-content", {
  scrollTrigger: {
    trigger: ".promise-section",
    start: "top 75%"
  },
  scale: 0.8,
  opacity: 0,
  duration: 1.2,
  ease: "back.out(1.2)"
});

// --- Pixi Animation in Heart Section ---
const pixiWrapper = document.querySelector(".pixi-wrapper");
if (pixiWrapper) {
  const pixiTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".heart-section",
      start: "top 60%",
    }
  });

  // 1. Float in from left
  pixiTl.fromTo(pixiWrapper, 
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
  )
  // 2. Glow line appears
  .fromTo(".pixi-glow-line",
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
    "-=0.5"
  )
  // 3. Speech bubble pops up
  .fromTo(".pixi-speech-bubble",
    { scale: 0, opacity: 0, rotation: -10 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" },
    "+=0.2"
  );

  // 4. Continuous Floating & Wiggle
  // Floating up/down
  gsap.to(".pixi-hero", {
    y: -8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // "Ear Wiggle" / Blink simulation (quick scale/rotate)
  gsap.to(".pixi-hero", {
    scaleY: 0.95, // Blink-ish squash
    scaleX: 1.02,
    duration: 0.15,
    repeat: -1,
    repeatDelay: 4, // Blink every 4 seconds
    yoyo: true,
    ease: "power1.inOut"
  });
}

// --- Pixi Peek Animation (Beliefs Section) ---
const pixiPeek = document.querySelector(".pixi-peek");
if (pixiPeek) {
  gsap.to(pixiPeek, {
    scrollTrigger: {
      trigger: ".belief-card-wrapper",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    y: -35,
    x: -15,
    rotation: 8,
    opacity: 1,
    duration: 1.1,
    ease: "back.out(1.4)"
  });
}

