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
    // Set menu width to 40% of viewport
    menuNav.style.width = '40%';
    
    // Animate logo
    gsap.to(logoLeft, {
      left: '-40px',
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });
    
    gsap.to(logoRight, {
      left: 'calc(100vw - 80px)',
      opacity: 0,
      duration: 0.5,
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
    // Animate logo back
    gsap.to(logoLeft, {
      left: '0',
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });
    
    gsap.to(logoRight, {
      left: '26px',
      opacity: 1,
      duration: 0.5,
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

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });
sections.forEach(sec => gsap.set(sec, { autoAlpha: 0 }));

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
    playCardEntry();
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
