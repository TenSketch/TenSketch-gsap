gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollTrigger);

const isNormalScroll = document.body && document.body.classList.contains('normal-scroll');


const logoMenu = document.getElementById('logo-menu');
const menuNav = document.querySelector('.menu');
const logoLeft = document.querySelector('.logo-left');
const logoRight = document.querySelector('.logo-right');
const menuCloseBtn = document.querySelector('.menu-close');


window.addEventListener('resize', () => {
  if (!menuNav.classList.contains('open')) {
    const isMobile = window.innerWidth <= 600;
    gsap.set(logoRight, { left: isMobile ? '22px' : '35px' });
  }
});

function splitLogoToggleMenu() {
  menuNav.classList.toggle('open');
  
  if (menuNav.classList.contains('open')) {    
    menuNav.style.width = '70vw';
    
    gsap.to(logoRight, {
      left: 'calc(100vw - 40px)',
      opacity: 0,
      duration: 0.6, 
      ease: "power2.out"
    });
    
    
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
    
    document.body.style.overflow = 'hidden';  } else {
    
    const isMobile = window.innerWidth <= 600;
    const leftPosition = isMobile ? '22px' : '35px'; 
    
    gsap.to(logoRight, {
      left: leftPosition,
      opacity: 1,
      duration: 0.6, 
      ease: "power2.out"
    });
    
    
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

const menuLinks = document.querySelectorAll('.menu a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (menuNav.classList.contains('open')) splitLogoToggleMenu();
  });
});


menuCloseBtn.addEventListener('click', () => {
  if (menuNav.classList.contains('open')) splitLogoToggleMenu();
});


document.addEventListener('mousedown', function(e) {
  if (
    menuNav.classList.contains('open') &&
    !menuNav.contains(e.target) &&
    !logoMenu.contains(e.target)
  ) {
    splitLogoToggleMenu();
  }
});


// Disable parallax/section scroll effect on normal-scroll pages and Terms page
if (!isNormalScroll && !window.location.pathname.includes('terms-and-conditions.html')) {
  const sections      = document.querySelectorAll("section"),
        images        = document.querySelectorAll(".bg"),
        outerWrappers = gsap.utils.toArray(".outer"),
        innerWrappers = gsap.utils.toArray(".inner");

  let currentIndex = -1,
      animating;


  function gotoSection(index, direction) {
    
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
    
    if (sections[index].classList.contains("fifth")) {
      
      const flipCards = document.querySelectorAll(".fifth .flip-card");
      if (flipCards && flipCards.length > 0) {
        playCardEntry();
      }  }
      
    if (sections[index].classList.contains("second")) {
      
      const craftCards = document.querySelectorAll('.craft-card');
      if (craftCards && craftCards.length > 0) {
        playCraftCardsAnimation();
      }
    }
    
    
    if (sections[index].classList.contains('ux-problems')) {
      
      playUXTitleAnimation();
      setTimeout(() => playUXProblemsAnimation(), 300); 
    }
      
    if (sections[index].classList.contains("testimonials")) {
      playTestimonialsAnimation();
    }
    
    
    if (sections[index].classList.contains("sixth")) {
      playInsightsAnimation();
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
    // preventDefault: true
  });

  gotoSection(0, 1);
}


function playCraftCardsAnimation() {
  
  const craftCards = document.querySelectorAll('.craft-card');
  
  if (!craftCards || craftCards.length === 0) return;
  
  
  craftCards.forEach(card => {
    gsap.killTweensOf(card);
  });
  
  
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
        
        craftCards.forEach(card => {
          card.classList.add('animated');
        });
      }
    }
  );
  
  
  const subtitle = document.querySelector('.craft-subtitle');
  if (subtitle) {
    gsap.fromTo(subtitle, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.8 }
    );
  }
  
  
  const ctaButton = document.querySelector('.craft-showcase .btn-cta');
  if (ctaButton) {
    gsap.fromTo(ctaButton, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 1.2 }
    );
  }
}


function playCardEntry() {
  const flipCards = document.querySelectorAll(".fifth .flip-card");
  const flipInners = document.querySelectorAll(".fifth .flip-card-inner");
  
  
  if (!flipCards.length || !flipInners.length) return;
  
  
  if (cardEntry && cardEntry.isActive()) return;
  
  
  const cardEntry = gsap.timeline();
  
  
  gsap.set(flipCards, { y: -100, opacity: 0 });
  gsap.set(flipInners, { rotationY: 0 });

  
  flipCards.forEach((card, i) => {
    const inner = card.querySelector(".flip-card-inner");
    if (!inner) return; 
    
    const dropDur = 1,
          flipDelay = 1,
          hold = 0.5,
          offset = i * (dropDur + flipDelay + hold);

    
    cardEntry.to(card, {
      y: 0,
      opacity: 1,
      duration: dropDur,
      ease: "power2.out",
      delay: offset
    }, 0);

    
    cardEntry.to(inner, {
      rotationY: 180,
      duration: 0.8,
      ease: "power2.inOut",
      delay: offset + flipDelay
    }, 0);
  });
  
  
  cardEntry.play();
  
  
  if (window.innerWidth <= 768) {
    playMobileCardEntry();
  }
}


function playMobileCardEntry() {
  const mobileFlipCards = document.querySelectorAll(".fifth .flip-card");
  if (!mobileFlipCards.length) return;
  
  const mobileCardEntry = gsap.timeline();

  mobileFlipCards.forEach((card, i) => {
    const inner = card.querySelector(".flip-card-inner");
    if (!inner) return; 
    
    const delay = i * 0.5;

    
    mobileCardEntry.from(card, {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: delay * 0.5
    }, 0);

    
    if (i === 0) {
      mobileCardEntry.to(inner, {
        rotationY: 180,
        duration: 0.8,
        ease: "power2.inOut",
        delay: delay + 1.2
      }, 0);
    } else {
      
      gsap.set(inner, { rotationY: 0 });
    }
  });
}


document.addEventListener("DOMContentLoaded", function() {
  
  const craftCards = document.querySelectorAll('.craft-card');
  const secondSection = document.querySelector('.second');
  
  if (craftCards.length > 0 && secondSection && typeof currentIndex !== 'undefined' && currentIndex === 1) {
    playCraftCardsAnimation();
  }
  
  
  const flipCards = document.querySelectorAll(".fifth .flip-card");
  if (flipCards.length > 0 && typeof currentIndex !== 'undefined' && currentIndex === 4) {
    playCardEntry();
  }

  
  initApproachAnimations();

  if (isNormalScroll) {
    setupNormalScrollTriggers();
  }
});


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




const flipCards  = gsap.utils.toArray(".fifth .flip-card"),
      flipInners = gsap.utils.toArray(".fifth .flip-card-inner");


gsap.set(flipCards,  { y: -100, opacity: 0 });
gsap.set(flipInners, { rotationY: 0 });


const cardEntry = gsap.timeline({ paused: true });


flipCards.forEach((card, i) => {
  const inner     = card.querySelector(".flip-card-inner"),
        dropDur   = 1,
        flipDelay = 1,
        hold      = 0.5,
        offset    = i * (dropDur + flipDelay + hold);

  
  cardEntry.to(card, {
    y: 0,
    opacity: 1,
    duration: dropDur,
    ease: "power2.out",
    delay: offset
  }, 0);

  
  cardEntry.to(inner, {
    rotationY: 180,
    duration: 0.8,
    ease: "power2.inOut",
    delay: offset + flipDelay
  }, 0);
});

function setupNormalScrollTriggers() {
  // Craft cards in any .second section
  if (document.querySelector('.second .craft-card')) {
    ScrollTrigger.create({
      trigger: '.second',
      start: 'top 75%',
      once: true,
      onEnter: () => playCraftCardsAnimation()
    });
  }

  // Flip card sections (.fifth)
  gsap.utils.toArray('.fifth').forEach((sec) => {
    if (sec.querySelector('.flip-card')) {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 80%',
        once: true,
        onEnter: () => playCardEntry()
      });
    }
  });

  // UX problems / title
  if (document.querySelector('.ux-problems')) {
    ScrollTrigger.create({
      trigger: '.ux-problems',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        playUXTitleAnimation();
        setTimeout(() => playUXProblemsAnimation(), 300);
      }
    });
  }

  // Testimonials
  if (document.querySelector('.testimonials')) {
    ScrollTrigger.create({
      trigger: '.testimonials',
      start: 'top 85%',
      once: true,
      onEnter: () => playTestimonialsAnimation()
    });
  }

  // Insights or any sixth section animations
  if (document.querySelector('.sixth')) {
    ScrollTrigger.create({
      trigger: '.sixth',
      start: 'top 85%',
      once: true,
      onEnter: () => playInsightsAnimation()
    });
  }

  // Ensure triggers layout after assets load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}


function playCardEntry() {
  if (cardEntry.isActive()) return;
  cardEntry.play();
  
  
  if (window.innerWidth <= 768) {
    playMobileCardEntry();
  }
}


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


const mobileFlipCards = gsap.utils.toArray(".fifth .flip-card"),
      mobileFlipInners = gsap.utils.toArray(".fifth .flip-card-inner");


function playMobileCardEntry() {
  const mobileCardEntry = gsap.timeline();

  mobileFlipCards.forEach((card, i) => {
    const inner = card.querySelector(".flip-card-inner"),
          delay = i * 0.5;

    
    mobileCardEntry.from(card, {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: delay * 0.5
    }, 0);

    
    if (i === 0) {
      mobileCardEntry.to(inner, {
        rotationY: 180,
        duration: 0.8,
        ease: "power2.inOut",
        delay: delay + 1.2
      }, 0);
    } else {
      
      gsap.set(inner, { rotationY: 0 });
    }
  });
}


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


function initApproachAnimations() {
  if (document.querySelector('.approach-section')) {
    
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


let testimonialsInitialized = false;
let testimonialsRotationTl = null;

function playTestimonialsAnimation() {
  const testimonialsSection = document.querySelector('.testimonials');
  if (!testimonialsSection) return;
  
  
  if (testimonialsInitialized) return;
  
  const galleryBoxOuter = document.querySelector('.gallery_box_outer');
  const heading = document.querySelector('.testimonials .section-heading');
  
  if (!galleryBoxOuter) return;
  
  
  const tl = gsap.timeline();
  
  
  if (heading) {
    tl.fromTo(heading, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }
  
  
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
      ease: "back.out(1.7)"
    },
    "-=0.7"
  );
  
  
  tl.call(() => {
    const cards = document.querySelectorAll('.gallery_box_in').length;
    const duration = cards * 3;
    
    
    if (testimonialsRotationTl) {
      testimonialsRotationTl.kill();
    }
    
    testimonialsRotationTl = gsap.timeline({});
    testimonialsRotationTl.to(galleryBoxOuter, {
      duration: duration,
      rotateY: 360,
      ease: "none",
      repeat: -1
    });
    
    
    const handlePause = () => testimonialsRotationTl.pause();
    const handleResume = () => testimonialsRotationTl.resume();
    
    
    galleryBoxOuter.addEventListener('mousedown', handlePause);
    galleryBoxOuter.addEventListener('touchstart', handlePause);
    galleryBoxOuter.addEventListener('mouseup', handleResume);
    galleryBoxOuter.addEventListener('touchend', handleResume);
    
    
    galleryBoxOuter.addEventListener('mouseleave', handleResume);
    
    testimonialsInitialized = true;
  });
}


ScrollTrigger.create({
  trigger: '.testimonials',
  start: 'top 80%',
  onEnter: () => {
    playTestimonialsAnimation();
  },
  once: true 
});


function playUXProblemsAnimation() {
  const uxCards = document.querySelectorAll('.ux-card');
  
  if (uxCards.length === 0) return;
  
  const masterTL = gsap.timeline({ delay: 0.8 }); 

  
  uxCards.forEach((card, index) => {
    const direction = card.getAttribute('data-aos');
    let startX = 0;
    let rotationY = 0;
    
    if (direction === 'slide-left') {
      startX = 120;  
      rotationY = -20;  
    } else {
      startX = -120;
      rotationY = 20;
    }
    
    
    gsap.set(card, { 
      opacity: 0, 
      x: startX,
      y: 80,  
      scale: 0.6,  
      rotationY: rotationY,
      rotationX: 10,
      filter: "blur(5px)",  
      transformOrigin: "center center"
    });
  });

  
  uxCards.forEach((card, index) => {
    const cardTL = gsap.timeline();
    
    
    cardTL
      
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
      
      .to(card, {
        opacity: 1,
        y: 0,
        scale: 1.08,  
        rotationX: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "back.out(1.4)"
      }, "-=0.1")
      
      .to(card, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3")
      
      .to(card, {
        boxShadow: "0 8px 32px rgba(255,255,255,0.15), 0 4px 16px rgba(212,175,55,0.2)",
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.6")
      
      .to(card, {
        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset",
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.2");
    
    
    masterTL.add(cardTL, index * 0.15);  
  });

  
  masterTL.call(() => {
    uxCards.forEach((card, cardIndex) => {
      if (!card.hasEventListener) {  
        card.addEventListener('mouseenter', () => {
          
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
        
        card.hasEventListener = true;  
      }
    });
  });
}


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
    
    
    const angle = (i / numParticles) * Math.PI * 2;
    const radius = 20;
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    
    particle.style.left = `${card.offsetLeft + card.offsetWidth/2 + startX}px`;
    particle.style.top = `${card.offsetTop + card.offsetHeight/2 + startY}px`;
    
    card.parentElement.appendChild(particle);
    particles.push(particle);
    
    
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


function playUXTitleAnimation() {
  
  const uxSection = document.querySelector('section.ux-problems');
  if (!uxSection) return;
  
  const title = uxSection.querySelector('.section-heading');
  if (!title) return;

  
  gsap.set(title, {
    opacity: 0,
    y: 50,
    scale: 0.9,
    rotationX: 15
  });

  
  const titleTL = gsap.timeline();

  
  titleTL.to(title, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotationX: 0,
    duration: 1.4,
    ease: "elastic.out(1, 0.8)",
    delay: 0.2
  });

  
  titleTL.to(title, {
    scale: 1.01,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  }, "-=0.5");

  
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
  
  
  if (getComputedStyle(title).position === 'static') {
    title.style.position = 'relative';
  }
  title.style.overflow = 'hidden';
  title.appendChild(shimmer);

  
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


function playFAQAnimation() {
  const faqCards = document.querySelectorAll('.faq-card');
  if (faqCards.length === 0) return;

  
  const faqTL = gsap.timeline();

  
  const heading = document.querySelector('.faqs-section .section-heading');
  if (heading) {
    faqTL.fromTo(heading, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }

  
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
      
      
      faqCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove('active');
          const otherAnswer = otherCard.querySelector('.faq-answer');
          otherAnswer.classList.remove('active');
        }
      });
      
      
      if (isActive) {
        card.classList.remove('active');
        answer.classList.remove('active');
      } else {
        card.classList.add('active');
        answer.classList.add('active');
        
        
        gsap.fromTo(answer, 
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" }
        );
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', function() {
  
  if (document.querySelector('.faqs-section')) {
    initFAQFunctionality();
  }
});


ScrollTrigger.create({
  trigger: '.faqs-section',  start: 'top 80%',
  onEnter: () => {
    playFAQAnimation();
  },
  once: true 
});


document.addEventListener('DOMContentLoaded', function() {
  const stickyCTA = document.getElementById('sticky-cta');
  
  if (stickyCTA) {
    
    setTimeout(() => {
      stickyCTA.classList.add('visible');
      document.body.classList.add('sticky-cta-visible');
    }, 2000);
    
    
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 300) {
        
        stickyCTA.classList.add('visible');
      } else if (scrollTop < lastScrollTop && scrollTop < 100) {
        
        stickyCTA.classList.remove('visible');
        document.body.classList.remove('sticky-cta-visible');
      }
      
      lastScrollTop = scrollTop;
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('ux-audit-popup');
  const popupClose = document.querySelector('.popup-close');
  const auditForm = document.getElementById('audit-form');
  const submitBtn = document.querySelector('.btn-submit');

  
  function openPopup() {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    
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

  
  document.addEventListener('click', function(e) {
    if (e.target.closest('.sticky-cta-btn') || e.target.closest('.btn-cta')) {
      e.preventDefault();
      console.log('UX Audit button clicked - Opening popup');
      openPopup();
    }
  });

  
  if (popupClose) {
    popupClose.addEventListener('click', closePopup);
  }

  
  if (popup) {
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        closePopup();
      }
    });
  }

  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closePopup();
    }
  });

  
  if (auditForm) {
    auditForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      
      const formData = new FormData(auditForm);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        website: formData.get('website'),
        businessType: formData.get('business-type')
      };
      
      console.log('Form submitted with data:', data);
      
      
      setTimeout(() => {
        
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        
        setTimeout(() => {
          closePopup();
          
          
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Get My Free UX Audit';
            submitBtn.style.background = '';
          }, 500);
        }, 1500);
        
        
        
        
      }, 2000); 
    });
  }

  
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


function playInsightsAnimation() {
  const insightsSection = document.querySelector('.sixth');
  if (!insightsSection) return;
  
  const answerCards = document.querySelectorAll('.answer-card');
  const downArrow = document.querySelector('.insights-down-arrow');
  const heading = document.querySelector('.sixth .section-heading');
  
  if (!answerCards.length) return;
  
  
  const tl = gsap.timeline();
  
  
  gsap.set(answerCards, { y: -50, opacity: 0 });
  gsap.set(downArrow, { opacity: 0 });
  
  
  if (heading) {
    tl.fromTo(heading, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }
  
  
  answerCards.forEach((card, index) => {
    tl.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, index * 1 + 0.5); 
  });
  
  
  tl.to(downArrow, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out"
  }, "+=0.3"); 
  
  
  if (downArrow) {
    downArrow.addEventListener('click', () => {
      if (!animating && currentIndex < sections.length - 1) {
        gotoSection(currentIndex + 1, 1);
      }
    });
  }
}
