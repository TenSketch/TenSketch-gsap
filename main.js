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
    // Set menu width to 40% of viewport with enough space for logo
    menuNav.style.width = 'calc(40% + 60px)'; // Reduced width to account for smaller logo
    
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
    }
  }
  
  // Animate craft cards when we hit the second section in about page
  if (sections[index].classList.contains("second")) {
    // Check if we're on the about page by checking for craft cards
    const craftCards = document.querySelectorAll('.craft-card');
    if (craftCards && craftCards.length > 0) {
      playCraftCardsAnimation();
    }
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
    
    // Animate the approach boxes with stagger
    gsap.from('.approach-box', {
      scrollTrigger: {
        trigger: '.approach-container',
        start: 'top 80%',
      },
      opacity: 0,
      y: 80,
      scale: 0.9,
      duration: 1,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    });
    
    // Animate the numbers with a different effect
    gsap.from('.approach-number', {
      scrollTrigger: {
        trigger: '.approach-container',
        start: 'top 75%',
      },
      opacity: 0,
      x: -50,
      duration: 1.5,
      stagger: 0.3,
      ease: 'elastic.out(1, 0.5)'
    });
    
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
  const masterTL = gsap.timeline();

  // Set enhanced initial states for each card
  uxCards.forEach((card, index) => {
    const direction = card.getAttribute('data-aos');
    let startX = 0;
    let rotationY = 0;
    
    if (direction === 'slide-left') {
      startX = 80;  // Increased distance
      rotationY = -15;  // Add rotation for more dynamic effect
    } else {
      startX = -80;
      rotationY = 15;
    }
    
    // Set initial state with enhanced properties
    gsap.set(card, { 
      opacity: 0, 
      x: startX,
      y: 60,  // Increased from 50
      scale: 0.7,  // More dramatic scale
      rotationY: rotationY,
      filter: "blur(3px)"  // Add blur for smoother entrance
    });
  });

  // Animate cards with improved stagger and effects
  uxCards.forEach((card, index) => {
    const cardTL = gsap.timeline();
    
    // Main entrance animation with bounce
    cardTL.to(card, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1.05,  // Slight overshoot
      rotationY: 0,
      filter: "blur(0px)",
      duration: 0.9,
      ease: "back.out(1.2)"  // Bouncy ease for more excitement
    })
    // Settle back to normal scale
    .to(card, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.2");
    
    // Add to master timeline with improved stagger
    masterTL.add(cardTL, index * 0.12);  // Faster stagger for more energy
  });

  // Add hover effects after animation completes
  masterTL.call(() => {
    uxCards.forEach(card => {
      if (!card.hasEventListener) {  // Prevent duplicate listeners
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -12,
            scale: 1.03,
            rotationY: 2,
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        card.hasEventListener = true;  // Mark as having listeners
      }
    });
  });
}

// --- Call UX problems animation on section enter ---
ScrollTrigger.create({
  trigger: '.ux-problems',
  start: 'top 80%',
  onEnter: () => {
    playUXProblemsAnimation();
  },
  once: true // Only trigger once
});

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
  trigger: '.faqs-section',
  start: 'top 80%',
  onEnter: () => {
    playFAQAnimation();
  },
  once: true // Only trigger once
});
