// --- GSAP Registrations ---
gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollTrigger);

// --- Split Logo Hamburger Menu Logic ---
const logoMenu = document.getElementById('logo-menu');
const menuNav = document.querySelector('.menu');
const logoLeft = document.querySelector('.logo-left');
const logoRight = document.querySelector('.logo-right');

// Create cross button if it doesn't exist
let menuCloseBtn = document.querySelector('.menu-close');
if (!menuCloseBtn) {
  menuCloseBtn = document.createElement('div');
  menuCloseBtn.className = 'menu-close';
  menuCloseBtn.innerHTML = '<img src="assets/images/cross.png" alt="Close" style="width:32px;height:32px;">';
  menuNav.appendChild(menuCloseBtn);
} else {
  // If it exists, update to use the cross image
  menuCloseBtn.innerHTML = '<img src="assets/images/cross.png" alt="Close" style="width:32px;height:32px;">';
}

// Update left position for logoRight to match CSS (25px desktop, 17.5px mobile)
window.addEventListener('resize', () => {
  if (!menuNav.classList.contains('open')) {
    const isMobile = window.innerWidth <= 600;
    gsap.set(logoRight, { left: isMobile ? '17.5px' : '25px' });
  }
});

function splitLogoToggleMenu() {
  menuNav.classList.toggle('open');
  // Animate logo halves
  if (menuNav.classList.contains('open')) {
    // Set menu width based on screen size for better mobile experience
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 768 && window.innerWidth > 600;
    
    if (isMobile) {
      menuNav.style.width = 'calc(35% + 50px)'; // Smaller width for mobile
    } else if (isTablet) {
      menuNav.style.width = 'calc(38% + 55px)'; // Medium width for tablets
    } else {
      menuNav.style.width = 'calc(40% + 60px)'; // Original width for desktop
    }
    
    gsap.to(logoRight, {
      left: 'calc(100vw - 40px)',
      opacity: 0,
      duration: 0.6, // Made animation faster
      ease: "power2.out"
    });
    
    // Enhanced appearing animation for close button
    gsap.fromTo(menuCloseBtn, 
      { opacity: 0, scale: 0, rotation: -180 },
      { 
        opacity: 1, 
        scale: 1, 
        rotation: 0,
        duration: 0.6, 
        delay: 0.2, 
        ease: "elastic.out(1, 0.5)" 
      }
    );
    
    document.body.style.overflow = 'hidden';
  } else {    // Check screen size for proper positioning on close
    const isMobile = window.innerWidth <= 600;
    const leftPosition = isMobile ? '17.5px' : '25px'; // Match the CSS values for different screen sizes
    
    gsap.to(logoRight, {
      left: leftPosition,
      opacity: 1,
      duration: 0.6, // Made animation faster
      ease: "power2.out"
    });
    
    // Enhanced disappearing animation for close button
    gsap.to(menuCloseBtn, {
      opacity: 0,
      scale: 0,
      rotation: 180,
      duration: 0.4,
      ease: "back.in(1.7)"
    });
    
    document.body.style.overflow = '';
  }
}

logoMenu.addEventListener('click', splitLogoToggleMenu);
// Close menu when clicking menu items
const menuLinks = document.querySelectorAll('.menu a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (menuNav.classList.contains('open')) splitLogoToggleMenu();
  });
});

// Close menu when clicking the close button
menuCloseBtn.addEventListener('click', () => {
  if (menuNav.classList.contains('open')) splitLogoToggleMenu();
});

// Close menu when clicking outside the menu area
document.addEventListener('mousedown', function(e) {
  if (
    menuNav.classList.contains('open') &&
    !menuNav.contains(e.target) &&
    !logoMenu.contains(e.target)
  ) {
    splitLogoToggleMenu();
  }
});

// --- Section Navigation (unchanged) ---
const sections      = document.querySelectorAll("section"),
      images        = document.querySelectorAll(".bg"),
      outerWrappers = gsap.utils.toArray(".outer"),
      innerWrappers = gsap.utils.toArray(".inner");

let currentIndex = -1,
    animating;

// Modify the gotoSection function with better element checks
function gotoSection(index, direction) {
  // Prevent out-of-bounds navigation
  if (index < 0 || index >= sections.length) return;
  animating = true;
  const fromTop = direction === -1,
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
  // Trigger flip-card entry when we hit the fifth section
  if (sections[index].classList.contains("fifth")) {
    // Make sure fifth section has flip cards before calling the animation
    const flipCards = document.querySelectorAll(".fifth .flip-card");
    if (flipCards && flipCards.length > 0) {
      playCardEntry();
    }  }
    // Animate craft cards when we hit the second section in about page
  if (sections[index].classList.contains("second")) {
    // Check if we're on the about page by checking for craft cards
    const craftCards = document.querySelectorAll('.craft-card');
    if (craftCards && craftCards.length > 0) {
      playCraftCardsAnimation();
    }
  }
  
  // Check if we're on the UX page by checking if section itself has ux-problems class
  if (sections[index].classList.contains('ux-problems')) {
    // Start both animations simultaneously
    playUXTitleAnimation();
    setTimeout(() => playUXProblemsAnimation(), 300); // Small delay for cards
  }
  
  // Animate testimonials when we hit the testimonials section
  if (sections[index].classList.contains("testimonials")) {
    playTestimonialsAnimation();
  }
}

Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  onDown:  () => {
    if (!animating && currentIndex > 0) gotoSection(currentIndex - 1, -1);
  },
  onUp:    () => {
    if (!animating && currentIndex < sections.length - 1) gotoSection(currentIndex + 1,  1);
  },
  tolerance: 10,
  preventDefault: true
});

gotoSection(0, 1);

// Update the craft cards animation function with better checks
function playCraftCardsAnimation() {
  // Check if we're on the right page first
  const craftCards = document.querySelectorAll('.craft-card');
  
  if (!craftCards || craftCards.length === 0) return;
  
  // Remove any existing animations
  craftCards.forEach(card => {
    gsap.killTweensOf(card);
  });
  
  // Create staggered entrance animation
  gsap.fromTo(craftCards, 
    { 
      y: 100, 
      opacity: 0,
      rotationX: 15,
      scale: 0.8
    },
    { 
      y: 0, 
      opacity: 1,
      rotationX: 0,
      scale: 1,
      duration: 1.2,
      ease: "back.out(1.7)",
      stagger: 0.2,
      onComplete: () => {
        // Add floating animation class after entrance animation
        craftCards.forEach(card => {
          card.classList.add('animated');
        });
      }
    }
  );
  
  // Animate subtitle after cards
  const subtitle = document.querySelector('.craft-subtitle');
  if (subtitle) {
    gsap.fromTo(subtitle, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.8 }
    );
  }
  
  // Animate CTA button after subtitle
  const ctaButton = document.querySelector('.craft-showcase .btn-cta');
  if (ctaButton) {
    gsap.fromTo(ctaButton, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 1.2 }
    );
  }
}

// Improve the card entry function with better checks
function playCardEntry() {
  const flipCards = document.querySelectorAll(".fifth .flip-card");
  const flipInners = document.querySelectorAll(".fifth .flip-card-inner");
  
  // Check if elements exist before attempting animation
  if (!flipCards.length || !flipInners.length) return;
  
  // Check if animation is already running
  if (cardEntry && cardEntry.isActive()) return;
  
  // Create the animation only when needed
  const cardEntry = gsap.timeline();
  
  // Reset initial state
  gsap.set(flipCards, { y: -100, opacity: 0 });
  gsap.set(flipInners, { rotationY: 0 });

  // For each card: drop in + flip once
  flipCards.forEach((card, i) => {
    const inner = card.querySelector(".flip-card-inner");
    if (!inner) return; // Skip if inner element doesn't exist
    
    const dropDur = 1,
          flipDelay = 1,
          hold = 0.5,
          offset = i * (dropDur + flipDelay + hold);

    // a) Drop & fade in
    cardEntry.to(card, {
      y: 0,
      opacity: 1,
      duration: dropDur,
      ease: "power2.out",
      delay: offset
    }, 0);

    // b) Flip after a short pause
    cardEntry.to(inner, {
      rotationY: 180,
      duration: 0.8,
      ease: "power2.inOut",
      delay: offset + flipDelay
    }, 0);
  });
  
  // Play the animation
  cardEntry.play();
  
  // Also animate mobile flip cards if on a mobile device
  if (window.innerWidth <= 768) {
    playMobileCardEntry();
  }
}

// Fix mobile card entry function with better checks
function playMobileCardEntry() {
  const mobileFlipCards = document.querySelectorAll(".fifth .flip-card");
  if (!mobileFlipCards.length) return;
  
  const mobileCardEntry = gsap.timeline();

  mobileFlipCards.forEach((card, i) => {
    const inner = card.querySelector(".flip-card-inner");
    if (!inner) return; // Skip if inner element doesn't exist
    
    const delay = i * 0.5;

    // Scale in (all cards)
    mobileCardEntry.from(card, {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: delay * 0.5
    }, 0);

    // Only flip the first card automatically
    if (i === 0) {
      mobileCardEntry.to(inner, {
        rotationY: 180,
        duration: 0.8,
        ease: "power2.inOut",
        delay: delay + 1.2
      }, 0);
    } else {
      // Ensure all other cards remain unflipped
      gsap.set(inner, { rotationY: 0 });
    }
  });
}

// Ensure DOM is fully loaded before initializing cards
document.addEventListener("DOMContentLoaded", function() {
  // Check if we're on the about page with the craft cards section active
  const craftCards = document.querySelectorAll('.craft-card');
  const secondSection = document.querySelector('.second');
  
  if (craftCards.length > 0 && secondSection && currentIndex === 1) {
    playCraftCardsAnimation();
  }
  
  // Check if we need to initialize flip cards
  const flipCards = document.querySelectorAll(".fifth .flip-card");
  if (flipCards.length > 0 && currentIndex === 4) {
    playCardEntry();
  }

  // Initialize animations for the approach section
  initApproachAnimations();
});

// --- Section 3: Card active switching (unchanged) ---
const cards = document.querySelectorAll('.card');
let activeIndex = 0;

function updateActiveCard() {
  cards.forEach((card, i) => {
    card.classList.toggle('active', i === activeIndex);
  });
}
updateActiveCard();
setInterval(() => {
  activeIndex = (activeIndex + 1) % cards.length;
  updateActiveCard();
}, 3000);

// --- Section 5: Flip-Card Entry Sequence ---

// 1. Grab the cards & their inners
const flipCards  = gsap.utils.toArray(".fifth .flip-card"),
      flipInners = gsap.utils.toArray(".fifth .flip-card-inner");

// 2. Prepare initial state
gsap.set(flipCards,  { y: -100, opacity: 0 });
gsap.set(flipInners, { rotationY: 0 });

// 3. Build the entry timeline (paused initially)
const cardEntry = gsap.timeline({ paused: true });

// 4. For each card: drop in + flip once
flipCards.forEach((card, i) => {
  const inner     = card.querySelector(".flip-card-inner"),
        dropDur   = 1,
        flipDelay = 1,
        hold      = 0.5,
        offset    = i * (dropDur + flipDelay + hold);

  // a) Drop & fade in
  cardEntry.to(card, {
    y: 0,
    opacity: 1,
    duration: dropDur,
    ease: "power2.out",
    delay: offset
  }, 0);

  // b) Flip after a short pause
  cardEntry.to(inner, {
    rotationY: 180,
    duration: 0.8,
    ease: "power2.inOut",
    delay: offset + flipDelay
  }, 0);
});

// 5. Function to play the entry sequence
function playCardEntry() {
  if (cardEntry.isActive()) return;
  cardEntry.play();
  
  // Also animate mobile flip cards if on a mobile device
  if (window.innerWidth <= 768) {
    playMobileCardEntry();
  }
}

// 6. Manual click-to-flip fallback
flipCards.forEach(card => {
  const inner = card.querySelector(".flip-card-inner");
  card.addEventListener("click", () => {
    gsap.to(inner, {
      rotationY: "+=180",
      duration: 0.6,
      ease: "power2.inOut"
    });
  });
});

// --- Mobile flip cards for Section 5 ---
const mobileFlipCards = gsap.utils.toArray(".fifth .flip-card"),
      mobileFlipInners = gsap.utils.toArray(".fifth .flip-card-inner");

// Handle mobile flip cards
function playMobileCardEntry() {
  const mobileCardEntry = gsap.timeline();

  mobileFlipCards.forEach((card, i) => {
    const inner = card.querySelector(".flip-card-inner"),
          delay = i * 0.5;

    // Scale in (all cards)
    mobileCardEntry.from(card, {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: delay * 0.5
    }, 0);

    // Only flip the first card automatically
    if (i === 0) {
      mobileCardEntry.to(inner, {
        rotationY: 180,
        duration: 0.8,
        ease: "power2.inOut",
        delay: delay + 1.2
      }, 0);
    } else {
      // Ensure all other cards remain unflipped
      gsap.set(inner, { rotationY: 0 });
    }
  });
}

// Handle click to flip for mobile cards
mobileFlipCards.forEach(card => {
  const inner = card.querySelector(".flip-card-inner");
  card.addEventListener("click", () => {
    gsap.to(inner, {
      rotationY: "+=180",
      duration: 0.6,
      ease: "power2.inOut"
    });
  });
});

// Function to initialize approach section animations
function initApproachAnimations() {
  if (document.querySelector('.approach-section')) {
    // Animate the heading
    gsap.from('.approach-section .section-heading', {
      scrollTrigger: {
        trigger: '.approach-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: 'power3.out'
    });
    
    // REMOVE: Animate the approach boxes with stagger
    // gsap.from('.approach-box', {
    //   scrollTrigger: {
    //     trigger: '.approach-container',
    //     start: 'top 80%',
    //   },
    //   opacity: 0,
    //   y: 80,
    //   scale: 0.9,
    //   duration: 1,
    //   stagger: 0.2,
    //   ease: 'back.out(1.7)'
    // });
    
    // REMOVE: Animate the numbers with a different effect
    // gsap.from('.approach-number', {
    //   scrollTrigger: {
    //     trigger: '.approach-container',
    //     start: 'top 75%',
    //   },
    //   opacity: 0,
    //   x: -50,
    //   duration: 1.5,
    //   stagger: 0.3,
    //   ease: 'elastic.out(1, 0.5)'
    // });
    
    // Add hover effects for approach boxes
    document.querySelectorAll('.approach-box').forEach(box => {
      box.addEventListener('mouseenter', function() {
        gsap.to(this, {
          y: -10,
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          borderColor: 'rgba(212, 175, 55, 0.5)',
          duration: 0.3
        });
      });
      
      box.addEventListener('mouseleave', function() {
        gsap.to(this, {
          y: 0,
          boxShadow: 'none',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          duration: 0.3
        });
      });
    });
  }
}

// Function to animate 3D testimonials section (Demo Style)
function playTestimonialsAnimation() {
  const testimonialsSection = document.querySelector('.testimonials');
  if (!testimonialsSection) return;
    const galleryBoxOuter = document.querySelector('.gallery_box_outer');
  const heading = document.querySelector('.testimonials .section-heading');
  
  if (!galleryBoxOuter) return;
  
  // Create timeline for testimonials animation
  const tl = gsap.timeline();
  
  // Animate heading first
  if (heading) {
    tl.fromTo(heading, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }
  
  // Animate the 3D container entrance
  tl.fromTo(galleryBoxOuter,
    { 
      scale: 0.5,
      opacity: 0,
      rotationX: 90
    },
    { 
      scale: 1,
      opacity: 1,
      rotationX: 0,
      duration: 1.5,
      ease: "back.out(1.7)"    },
    "-=0.7"
  );
  
  // Start the continuous rotation after entrance (exact demo animation)
  tl.call(() => {
    const cards = document.querySelectorAll('.gallery_box_in').length;
    // Each card should take 3 seconds to rotate into view
    // Full rotation = cards * 3 seconds
    const duration = cards * 3;
    const rotationTl = gsap.timeline({});
    rotationTl.to(galleryBoxOuter, {
      duration: duration,
      rotateY: 360,
      ease: "none",
      repeat: -1
    });
    
    // Pause on mousedown/touchstart, resume on mouseup/touchend (exact demo behavior)
    const gallery = galleryBoxOuter;
    gallery.addEventListener('mousedown', () => rotationTl.pause());
    gallery.addEventListener('touchstart', () => rotationTl.pause());
    document.addEventListener('mouseup', () => rotationTl.resume());
    document.addEventListener('touchend', () => rotationTl.resume());
  });
}

// --- Call testimonials animation on section enter ---
ScrollTrigger.create({
  trigger: '.testimonials',
  start: 'top 80%',
  onEnter: () => {
    playTestimonialsAnimation();
  },
  once: true // Only trigger once
});

// --- UX Problems Cards Animation ---
function playUXProblemsAnimation() {
  const uxCards = document.querySelectorAll('.ux-card');
  
  if (uxCards.length === 0) return;
  // Create master timeline with improved stagger
  const masterTL = gsap.timeline({ delay: 0.8 }); // Reduced delay so animations start sooner

  // Set enhanced initial states for each card
  uxCards.forEach((card, index) => {
    const direction = card.getAttribute('data-aos');
    let startX = 0;
    let rotationY = 0;
    
    if (direction === 'slide-left') {
      startX = 120;  // Increased distance for more dramatic effect
      rotationY = -20;  // Add rotation for more dynamic effect
    } else {
      startX = -120;
      rotationY = 20;
    }
    
    // Set initial state with enhanced properties
    gsap.set(card, { 
      opacity: 0, 
      x: startX,
      y: 80,  // Increased vertical offset
      scale: 0.6,  // More dramatic scale
      rotationY: rotationY,
      rotationX: 10,
      filter: "blur(5px)",  // More blur for smoother entrance
      transformOrigin: "center center"
    });
  });

  // Animate cards with improved stagger and effects
  uxCards.forEach((card, index) => {
    const cardTL = gsap.timeline();
    
    // Main entrance animation with multiple stages
    cardTL
      // Stage 1: Quick movement towards position
      .to(card, {
        opacity: 0.3,
        x: 0,
        y: 40,
        scale: 0.8,
        rotationY: 0,
        rotationX: 5,
        filter: "blur(2px)",
        duration: 0.4,
        ease: "power2.out"
      })
      // Stage 2: Final positioning with bounce and effects
      .to(card, {
        opacity: 1,
        y: 0,
        scale: 1.08,  // Overshoot for bounce
        rotationX: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "back.out(1.4)"
      }, "-=0.1")
      // Stage 3: Settle to final state
      .to(card, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3")
      // Stage 4: Add a subtle glow effect
      .to(card, {
        boxShadow: "0 8px 32px rgba(255,255,255,0.15), 0 4px 16px rgba(212,175,55,0.2)",
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.6")
      // Stage 5: Remove glow gradually
      .to(card, {
        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset",
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.2");
    
    // Add to master timeline with stagger
    masterTL.add(cardTL, index * 0.15);  // Slightly slower stagger for better effect
  });

  // Add advanced hover effects after animation completes
  masterTL.call(() => {
    uxCards.forEach((card, cardIndex) => {
      if (!card.hasEventListener) {  // Prevent duplicate listeners
        card.addEventListener('mouseenter', () => {
          // Create particle effect on hover
          createCardParticles(card);
          
          gsap.to(card, {
            y: -15,
            scale: 1.05,
            rotationY: 3,
            rotationX: 2,
            boxShadow: "0 15px 45px rgba(255,255,255,0.2), 0 8px 25px rgba(212,175,55,0.3)",
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset",
            duration: 0.5,
            ease: "power2.out"
          });
        });
        
        card.hasEventListener = true;  // Mark as having listeners
      }
    });
  });
}

// Helper function to create particle effect on card hover
function createCardParticles(card) {
  const particles = [];
  const numParticles = 6;
  
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(212,175,55,0.8) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
    `;
    
    // Position particles around the card
    const angle = (i / numParticles) * Math.PI * 2;
    const radius = 20;
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    
    particle.style.left = `${card.offsetLeft + card.offsetWidth/2 + startX}px`;
    particle.style.top = `${card.offsetTop + card.offsetHeight/2 + startY}px`;
    
    card.parentElement.appendChild(particle);
    particles.push(particle);
    
    // Animate particle
    gsap.fromTo(particle, 
      { scale: 0, opacity: 1 },
      { 
        scale: 1.5, 
        opacity: 0,
        x: Math.cos(angle) * 60,
        y: Math.sin(angle) * 60,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          particle.remove();
        }
      }
    );
  }
}

// --- UX Title Animation ---
function playUXTitleAnimation() {
  // Look for the section with ux-problems class
  const uxSection = document.querySelector('section.ux-problems');
  if (!uxSection) return;
  
  const title = uxSection.querySelector('.section-heading');
  if (!title) return;

  // Set initial state for title
  gsap.set(title, {
    opacity: 0,
    y: 50,
    scale: 0.9,
    rotationX: 15
  });

  // Create text animation timeline
  const titleTL = gsap.timeline();

  // Animate title with dramatic effect
  titleTL.to(title, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotationX: 0,
    duration: 1.4,
    ease: "elastic.out(1, 0.8)",
    delay: 0.2
  });

  // Add subtle continuous breathing effect
  titleTL.to(title, {
    scale: 1.01,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  }, "-=0.5");

  // Add a shimmer effect to the title
  const shimmer = document.createElement('div');
  shimmer.style.cssText = `
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    pointer-events: none;
    z-index: 1;
  `;
  
  // Make title position relative if not already
  if (getComputedStyle(title).position === 'static') {
    title.style.position = 'relative';
  }
  title.style.overflow = 'hidden';
  title.appendChild(shimmer);

  // Animate shimmer effect
  titleTL.fromTo(shimmer, 
    { left: '-100%' },
    { 
      left: '100%', 
      duration: 1.5, 
      ease: "power2.out",
      delay: 0.8,
      repeat: 2,
      repeatDelay: 2
    },
    0
  );
}

// --- FAQ Section Animation and Functionality ---
function playFAQAnimation() {
  const faqCards = document.querySelectorAll('.faq-card');
  if (faqCards.length === 0) return;

  // Create timeline for FAQ cards entrance
  const faqTL = gsap.timeline();

  // Animate section heading first
  const heading = document.querySelector('.faqs-section .section-heading');
  if (heading) {
    faqTL.fromTo(heading, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }

  // Animate FAQ cards with stagger
  faqTL.to(faqCards, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out"
  }, "-=0.5");
}

function initFAQFunctionality() {
  const faqCards = document.querySelectorAll('.faq-card');
  
  faqCards.forEach(card => {
    const question = card.querySelector('.faq-question');
    const answer = card.querySelector('.faq-answer');
    const toggle = card.querySelector('.faq-toggle');
    
    question.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      
      // Close all other FAQ cards
      faqCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove('active');
          const otherAnswer = otherCard.querySelector('.faq-answer');
          otherAnswer.classList.remove('active');
        }
      });
      
      // Toggle current card
      if (isActive) {
        card.classList.remove('active');
        answer.classList.remove('active');
      } else {
        card.classList.add('active');
        answer.classList.add('active');
        
        // Add a subtle bounce animation when opening
        gsap.fromTo(answer, 
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" }
        );
      }
    });
  });
}

// Initialize FAQ functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize FAQ functionality if FAQ section exists
  if (document.querySelector('.faqs-section')) {
    initFAQFunctionality();
  }
});

// --- Call FAQ animation on section enter ---
ScrollTrigger.create({
  trigger: '.faqs-section',  start: 'top 80%',
  onEnter: () => {
    playFAQAnimation();
  },
  once: true // Only trigger once
});

// --- Sticky CTA Bar Functionality ---
document.addEventListener('DOMContentLoaded', function() {
  const stickyCTA = document.getElementById('sticky-cta');
  
  if (stickyCTA) {
    // Show the sticky CTA after a delay
    setTimeout(() => {
      stickyCTA.classList.add('visible');
      document.body.classList.add('sticky-cta-visible');
    }, 2000);
    
    // Optional: Hide on scroll up, show on scroll down
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 300) {
        // Scrolling down and past threshold
        stickyCTA.classList.add('visible');
      } else if (scrollTop < lastScrollTop && scrollTop < 100) {
        // Scrolling up and near top
        stickyCTA.classList.remove('visible');
        document.body.classList.remove('sticky-cta-visible');
      }
      
      lastScrollTop = scrollTop;
    });
  }
});

// --- UX Audit Popup Functionality ---
document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('ux-audit-popup');
  const popupClose = document.querySelector('.popup-close');
  const auditForm = document.getElementById('audit-form');
  const submitBtn = document.querySelector('.btn-submit');

  // Function to open popup
  function openPopup() {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // GSAP animation for popup entrance
    gsap.fromTo('.popup-container', 
      { 
        scale: 0.7, 
        opacity: 0, 
        rotationY: -15 
      },
      { 
        scale: 1, 
        opacity: 1, 
        rotationY: 0,
        duration: 0.6, 
        ease: "back.out(1.7)",
        delay: 0.1
      }
    );
    
    // Animate form elements
    gsap.fromTo('.form-group', 
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1, 
        delay: 0.3,
        ease: "power2.out"
      }
    );
  }

  // Function to close popup
  function closePopup() {
    gsap.to('.popup-container', {
      scale: 0.8,
      opacity: 0,
      rotationY: 15,
      duration: 0.4,
      ease: "back.in(1.7)",
      onComplete: () => {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        auditForm.reset();
      }
    });
  }

  // Event listeners for opening popup
  document.addEventListener('click', function(e) {
    if (e.target.closest('.sticky-cta-btn') || e.target.closest('.btn-cta')) {
      e.preventDefault();
      console.log('UX Audit button clicked - Opening popup');
      openPopup();
    }
  });

  // Event listener for closing popup
  if (popupClose) {
    popupClose.addEventListener('click', closePopup);
  }

  // Close popup when clicking overlay
  if (popup) {
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        closePopup();
      }
    });
  }

  // Close popup with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closePopup();
    }
  });

  // Form submission handling
  if (auditForm) {
    auditForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Add loading state
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Collect form data
      const formData = new FormData(auditForm);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        website: formData.get('website'),
        businessType: formData.get('business-type')
      };
      
      console.log('Form submitted with data:', data);
      
      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        // Close popup after success
        setTimeout(() => {
          closePopup();
          
          // Reset button after popup closes
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Get My Free UX Audit';
            submitBtn.style.background = '';
          }, 500);
        }, 1500);
        
        // You can add actual form submission logic here
        // fetch('/submit-audit-request', { method: 'POST', body: JSON.stringify(data) })
        
      }, 2000); // Simulate network delay
    });
  }

  // Form validation enhancement
  const inputs = document.querySelectorAll('.form-group input, .form-group select');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim() === '' && this.hasAttribute('required')) {
        this.style.borderColor = '#ff6b6b';
        this.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
      } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
      }
    });
    
    input.addEventListener('input', function() {
      if (this.style.borderColor === 'rgb(255, 107, 107)') {
        this.style.borderColor = '';
        this.style.boxShadow = '';
      }
    });
  });
});
