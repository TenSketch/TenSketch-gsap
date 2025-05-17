// --- GSAP Registrations ---
gsap.registerPlugin(Observer);

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
  menuCloseBtn.innerHTML = '<span></span><span></span>';
  menuNav.appendChild(menuCloseBtn);
}

function splitLogoToggleMenu() {
  menuNav.classList.toggle('open');
  // Animate logo halves
  if (menuNav.classList.contains('open')) {
    // Set menu width to 40% of viewport with enough space for logo
    menuNav.style.width = 'calc(40% + 120px)'; // Increased width to account for logo
    
    // Remove animation for left half - keep it visible and stationary
    
    gsap.to(logoRight, {
      left: 'calc(100vw - 80px)',
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
  } else {
    // Check screen size for proper positioning on close
    const isMobile = window.innerWidth <= 600;
    const leftPosition = isMobile ? '20px' : '30px'; // Match the CSS values for different screen sizes
    
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

// Add window resize handler to update positioning
window.addEventListener('resize', () => {
  if (!menuNav.classList.contains('open')) {
    const isMobile = window.innerWidth <= 600;
    gsap.set(logoRight, { left: isMobile ? '15px' : '30px' });
  }
});

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
