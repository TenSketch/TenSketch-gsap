// --- GSAP Registrations ---
gsap.registerPlugin(Observer);

// --- Logo Menu Animation ---
const logoMenu = document.getElementById('logo-menu');
const menuNav = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu li a');

// Function to handle menu toggle with GSAP animation
function toggleMenu() {
  const isOpen = logoMenu.classList.contains('active');
  
  // Toggle active class
  logoMenu.classList.toggle('active');
  menuNav.classList.toggle('open');
  
  // Animate logo to indicate menu state
  const logo = document.querySelector('.logo');
  
  if (!isOpen) {
    // Opening menu animation
    gsap.to(logo, {
      rotate: 90,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.out"
    });
  } else {
    // Closing menu animation
    gsap.to(logo, {
      rotate: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  }
  
  // Disable/Enable scrolling based on menu state
  document.body.style.overflow = !isOpen ? 'hidden' : '';
}

// Add click event to logo menu
logoMenu.addEventListener('click', toggleMenu);

// Close menu when clicking menu items
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    if (logoMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
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
