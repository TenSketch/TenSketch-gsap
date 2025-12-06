/* =========================================
   PIXIAI V2 - KINETIC ANIMATION LOGIC
   ========================================= */

gsap.registerPlugin(ScrollTrigger);

// === NAV MENU TOGGLE (copied from pixiapp) ===
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.logo-container');
  const menu = document.querySelector('.menu');
  const closeBtn = document.querySelector('.menu-close');
  const menuItems = document.querySelectorAll('.menu li');

  function toggleMenu() {
    if (!menu || !menuBtn) return;
    menu.classList.toggle('open');
    menuBtn.classList.toggle('open');
    if (menu.classList.contains('open')) {
      gsap.to(menuItems, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 0.3
      });
    } else {
      gsap.to(menuItems, {
        y: 20,
        opacity: 0,
        duration: 0.3
      });
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
});

// Menu Logic Removed

// === HERO: KINETIC TYPOGRAPHY (Custom Split Text) ===
const heroTimeline = gsap.timeline();

// Helper: Split text into words and chars
function splitTextToSpans(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  const text = element.innerText;
  const words = text.split(' ');
  let newHtml = '';
  
  words.forEach(word => {
    newHtml += '<span class="split-word">';
    word.split('').forEach(char => {
      newHtml += `<span class="split-char">${char}</span>`;
    });
    newHtml += '</span> ';
  });
  
  element.innerHTML = newHtml;
}

// Apply split
splitTextToSpans('#hero-line-1');
splitTextToSpans('#hero-line-2');

// Animate Chars
heroTimeline
  .from('.split-char', {
    duration: 1.2,
    y: 100,
    z: -500,
    rotationX: 90,
    rotationY: 45,
    opacity: 0,
    stagger: 0.05,
    ease: 'back.out(1.5)'
  })
  .from('#hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.5')
  .from('.scroll-indicator', {
    opacity: 0,
    duration: 1,
    delay: 0.5
  });

// Canvas Particles (Simple Constellation)
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 50; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  // Connect particles
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.strokeStyle = `rgba(255,255,255,${0.1 - dist/1500})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();


// === WHY PIXIAI: SPLIT PARALLAX (V5) ===
ScrollTrigger.matchMedia({
  // Desktop
  "(min-width: 900px)": function() {
    const section = document.querySelector('.why-section-v2');
    const cards = document.querySelectorAll('.why-card-v2');
    const progressFill = document.getElementById('why-progress-fill');
    const progressText = document.getElementById('why-progress-text');
    const totalCards = cards.length;
    
    if (!section || !cards.length) return;
    
    // Reset any previous transforms
    gsap.set(cards, { clearProps: "all" });

    // Parallax effect for each card based on data-speed attribute
    cards.forEach((card, index) => {
      const speed = parseFloat(card.dataset.speed) || 1;
      
      // Create parallax movement
      gsap.to(card, {
        yPercent: -30 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });
      
      // Card reveal animation - activate when in viewport center
      ScrollTrigger.create({
        trigger: card,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          card.classList.add('active');
          updateProgress(index + 1);
        },
        onLeave: () => {
          if (index < totalCards - 1) {
            card.classList.remove('active');
          }
        },
        onEnterBack: () => {
          card.classList.add('active');
          updateProgress(index + 1);
        },
        onLeaveBack: () => {
          if (index > 0) {
            card.classList.remove('active');
          }
        }
      });
    });

    // Update progress indicator
    function updateProgress(current) {
      if (progressFill && progressText) {
        const percentage = (current / totalCards) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `0${current} / 0${totalCards}`;
      }
    }

    // Initial state
    updateProgress(1);

    // Subtle rotation on scroll for depth
    cards.forEach((card) => {
      gsap.to(card, {
        rotateX: 2,
        rotateY: -2,
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "top center",
          scrub: 1,
        }
      });
      
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scrollTrigger: {
          trigger: card,
          start: "top center",
          end: "bottom top",
          scrub: 1,
        }
      });
    });
  },
  
  // Mobile - Simple fade in
  "(max-width: 899px)": function() {
    gsap.set('.why-card-v2', { clearProps: "all" });
    
    const cards = document.querySelectorAll('.why-card-v2');
    cards.forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }
});


// === SERVICES: SCROLL-TRIGGERED MORPH ANIMATIONS ===
const serviceCards = document.querySelectorAll('.service-card');

// Master timeline for staggered reveal
serviceCards.forEach((card, index) => {
  const num = card.querySelector('.service-num');
  const icon = card.querySelector('.service-icon');
  const content = card.querySelector('.service-content');
  const h3 = card.querySelector('h3');
  const p = card.querySelector('p');
  const tags = card.querySelectorAll('.service-tag');
  const arrow = card.querySelector('.service-arrow');
  
  // Create individual card timeline
  const cardTl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      end: "top 20%",
      toggleActions: "play none none reverse"
    }
  });
  
  // Initial states
  gsap.set(card, { opacity: 0, y: 80 });
  gsap.set(num, { opacity: 0, scale: 0.5, filter: 'blur(20px)' });
  gsap.set(icon, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(h3, { opacity: 0, y: 30 });
  gsap.set(p, { opacity: 0, y: 20 });
  gsap.set(tags, { opacity: 0, x: -20 });
  
  // Card reveal animation
  cardTl
    .to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    // Number morph in with blur
    .to(num, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: "power2.out"
    }, "-=0.6")
    // Icon spin in
    .to(icon, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.8")
    // Title reveal
    .to(h3, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.5")
    // Description
    .to(p, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    // Tags stagger
    .to(tags, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.3");
});

// Parallax effect on scroll for service numbers
serviceCards.forEach((card) => {
  const num = card.querySelector('.service-num');
  
  gsap.to(num, {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
      trigger: card,
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });
});

// Magnetic hover effect for service icons
serviceCards.forEach(card => {
  const icon = card.querySelector('.service-icon');
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) / 15;
    const moveY = (y - centerY) / 15;
    
    gsap.to(icon, {
      x: moveX,
      y: moveY,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  });
});

// Featured card orb animation enhancement
const featuredOrb = document.querySelector('.visual-orb');
if (featuredOrb) {
  gsap.to(featuredOrb, {
    scale: 1.3,
    ease: "none",
    scrollTrigger: {
      trigger: '.service-card.featured',
      start: "top bottom",
      end: "bottom top",
      scrub: 2
    }
  });
}


// === PRODUCTS: MINIMAL ROW ANIMATIONS ===
const productRows = document.querySelectorAll('.product-row');

productRows.forEach((row, index) => {
  const num = row.querySelector('.num');
  const info = row.querySelector('.product-info');
  const h3 = row.querySelector('h3');
  const p = row.querySelector('p');
  const cta = row.querySelector('.row-cta');
  
  // Create timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: row,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
  
  // Initial states
  gsap.set(row, { opacity: 0, x: -50 });
  gsap.set(num, { opacity: 0, scale: 0.5 });
  gsap.set(h3, { opacity: 0, y: 20 });
  gsap.set(p, { opacity: 0 });
  gsap.set(cta, { opacity: 0, scale: 0.8 });
  
  // Stagger
  const delay = index * 0.15;
  
  // Animation
  tl
    .to(row, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: delay,
      ease: "power3.out"
    })
    .to(num, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(h3, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.3")
    .to(p, {
      opacity: 1,
      duration: 0.4
    }, "-=0.2")
    .to(cta, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)"
    }, "-=0.2");
});

// Smooth scroll to CTA section
productRows.forEach(row => {
  row.addEventListener('click', (e) => {
    e.preventDefault();
    const cta = document.getElementById('cta');
    if (cta) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: cta, offsetY: 50 },
        ease: "power2.inOut"
      });
    }
  });
});


// === PROCESS: SVG PATH ANIMATION ===
const processSection = document.querySelector('.process-section-v2');
const pathActive = document.getElementById('process-path-active');
const pathLength = pathActive.getTotalLength();

// Set initial stroke dash
pathActive.style.strokeDasharray = pathLength;
pathActive.style.strokeDashoffset = pathLength;

gsap.to(pathActive, {
  strokeDashoffset: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.process-wrapper',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
  }
});

// Activate steps as we scroll
const steps = document.querySelectorAll('.step-v2');
steps.forEach(step => {
  ScrollTrigger.create({
    trigger: step,
    start: 'top center',
    onEnter: () => step.classList.add('active'),
    onLeaveBack: () => step.classList.remove('active')
  });
});

// === THEME TOGGLER ===
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  // Check saved theme
  const savedTheme = localStorage.getItem("hero-theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      body.classList.toggle("light-mode");

      const icon = themeToggleBtn.querySelector("i");
      if (body.classList.contains("light-mode")) {
        if (icon) {
          icon.classList.remove("fa-sun");
          icon.classList.add("fa-moon");
        }
        localStorage.setItem("hero-theme", "light");
      } else {
        if (icon) {
          icon.classList.remove("fa-moon");
          icon.classList.add("fa-sun");
        }
        localStorage.setItem("hero-theme", "dark");
      }
    });
  }
});
