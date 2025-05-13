// --- GSAP Registrations ---
gsap.registerPlugin(Observer);

// Define isMobile early, before usage
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Mobile-specific performance optimizations
if (isMobile) {
  // Reduce animation complexity on mobile
  gsap.defaults({
    duration: 0.8,    // Shorter animations
    ease: "power2.out" // Simpler easing
  });
}

// --- Section Navigation with improved scrolling behavior ---
const sections      = document.querySelectorAll("section"),
      images        = document.querySelectorAll(".bg"),
      outerWrappers = gsap.utils.toArray(".outer"),
      innerWrappers = gsap.utils.toArray(".inner");

let currentIndex = -1,
    wrapIdx      = gsap.utils.wrap(0, sections.length),
    animating;

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });
sections.forEach(sec => gsap.set(sec, { autoAlpha: 0 }));

// Track scrollable content
let sectionScrollPositions = {};

function gotoSection(index, direction) {
  index = wrapIdx(index);
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

// Modified wheel/touch event handling for scrollable sections
Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: isMobile ? -0.5 : -1,
  onDown: (self) => {
    // Check if we should allow page navigation or internal scrolling
    if (animating) return;
    
    const currentBg = sections[currentIndex]?.querySelector('.bg');
    if (!currentBg) return;
    
    const atTop = currentBg.scrollTop <= 0;
    
    // Only navigate to previous section if at top of current section content
    if (atTop) {
      gotoSection(currentIndex - 1, -1);
    }
    // Otherwise, native scrolling will work within the section
  },
  onUp: (self) => {
    // Check if we should allow page navigation or internal scrolling
    if (animating) return;
    
    const currentBg = sections[currentIndex]?.querySelector('.bg');
    if (!currentBg) return;
    
    // Check if we've scrolled to the bottom of the content
    const isAtBottom = Math.abs(
      currentBg.scrollHeight - currentBg.scrollTop - currentBg.clientHeight
    ) < 2;
    
    // Only navigate to next section if at bottom of current section content
    if (isAtBottom) {
      gotoSection(currentIndex + 1, 1);
    }
    // Otherwise, native scrolling will work within the section
  },
  tolerance: isMobile ? 20 : 10,
  preventDefault: false, // Important: let native scrolling work
  lockAxis: true
});

// Handle touch events for better mobile experience
let touchStartY = 0;

sections.forEach(section => {
  const bg = section.querySelector('.bg');
  
  // Prevent default only for touch events that would cause unwanted navigation
  bg.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  bg.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    const scrollTop = bg.scrollTop;
    const scrollHeight = bg.scrollHeight;
    const clientHeight = bg.clientHeight;
    
    // Prevent pull-to-refresh at the top of the page
    if (scrollTop <= 0 && diff < 0) {
      e.preventDefault();
    }
    
    // Prevent overscroll at the bottom
    if (scrollTop + clientHeight >= scrollHeight && diff > 0) {
      e.preventDefault();
    }
  }, { passive: false });
});

// --- Fix for mobile device orientation changes ---
window.addEventListener('resize', () => {
  // Re-trigger animations for current section after resize
  if (currentIndex >= 0) {
    setTimeout(() => {
      if (currentIndex === 1) {
        animateApproachPillars();
      } else if (sections[currentIndex].classList.contains("fifth")) {
        playCardEntry();
      }
    }, 300);
  }
});

// Fix for iOS Safari 100vh issue
function fixIOSHeight() {
  if (isIOS) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    sections.forEach(section => {
      section.style.height = 'calc(var(--vh, 1vh) * 100)';
    });
  }
}

// Run on load and resize
window.addEventListener('resize', fixIOSHeight);
window.addEventListener('orientationchange', fixIOSHeight);
fixIOSHeight();

// Initial page load animations
window.addEventListener('DOMContentLoaded', () => {
  // Make sure header is visible
  gsap.set('header', { autoAlpha: 1 });
  
  // Set a small delay to ensure first section text animations run
  setTimeout(() => {
    // Explicitly animate first section's text
    const firstSection = document.querySelector('.first');
    animateSectionHeading(firstSection);
    animateSectionText(firstSection);
  }, 100);
  
  // Start with first section
  gotoSection(0, 1);

  // Mobile-specific initializations
  if (isMobile) {
    // Add active states for mobile touch feedback
    document.querySelectorAll('.btn-cta, .card, .mobile-card, .stat-item').forEach(el => {
      el.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      el.addEventListener('touchend', function() {
        this.style.transform = '';
      }, { passive: true });
    });
  }
});

// --- Text Animations for Headers and Description Text ---

// Function to animate section heading with slide-up effect
function animateSectionHeading(section) {
  const heading = section.querySelector('.section-heading');
  
  if (!heading) return;
  
  // Create a wrapper for text reveal if not already wrapped
  if (!heading.querySelector('.text-reveal-animation')) {
    const originalText = heading.innerHTML;
    heading.innerHTML = `<span class="text-reveal-animation">${originalText}</span>`;
  }
  
  const textToReveal = heading.querySelector('.text-reveal-animation');
  gsap.fromTo(textToReveal, 
    { 
      y: '100%', 
      opacity: 0 
    }, 
    { 
      y: '0%', 
      opacity: 1, 
      duration: 1.2, 
      ease: "power3.out",
      delay: 0.3
    }
  );
}

// Function to animate description text with fade-up effect
function animateSectionText(section) {
  const paragraphs = section.querySelectorAll('.section-text');
  
  if (!paragraphs.length) return;
  
  gsap.fromTo(paragraphs, 
    { 
      y: 20, 
      opacity: 0 
    }, 
    { 
      y: 0, 
      opacity: 1, 
      duration: 1, 
      stagger: 0.2, 
      ease: "power2.out", 
      delay: 0.5
    }
  );
}

// Function to animate additional text elements
function animateAdditionalText(section) {
  // Animate pillar titles, stat labels, and approach heading
  const textElements = section.querySelectorAll('.pillar-title, .stat-label, .approach-heading');
  
  if (textElements.length) {
    gsap.fromTo(textElements, 
      { y: 15, opacity: 0 }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        stagger: 0.1, 
        ease: "power2.out",
        delay: 0.7
      }
    );
  }
}

// Enhance the gotoSection function to trigger text animations
const enhancedGotoSection = gotoSection;
gotoSection = function(index, direction) {
  enhancedGotoSection(index, direction);
  
  // Wait for the section transition to complete
  setTimeout(() => {
    const activeSection = sections[index];
    
    // Animate heading and text
    animateSectionHeading(activeSection);
    animateSectionText(activeSection);
    animateAdditionalText(activeSection);
    
    // Continue with specific section animations
    if (index === 1) {
      animateMorphingShapes();
      animateApproachPillars();
      animateStatCounters();
    } else if (activeSection.classList.contains("fifth")) {
      playCardEntry();
    }
  }, 800);
};

// Optimize section transitions for mobile
if (isMobile) {
  const originalGotoSection = gotoSection;
  gotoSection = function(index, direction) {
    // Apply lighter animations on mobile
    gsap.defaults({ duration: 0.8 });
    
    // Call the original function with possibly modified parameters
    originalGotoSection(index, direction);
    
    // Reset defaults after transition
    setTimeout(() => {
      gsap.defaults({ duration: 1.25 });
    }, 1000);
  };
}

// --- Section 2: Enhanced About Us Section Animations ---

// Function to animate approach pillars with 3D rotation
function animateApproachPillars() {
  if (currentIndex === 1) {
    const pillars = document.querySelectorAll('.pillar-item');
    
    // Reset pillars before animation
    gsap.set(pillars, { 
      opacity: 0, 
      rotateY: 30,
      y: 50
    });
    
    // Create animation timeline
    const pillarsTimeline = gsap.timeline();
    
    // Animate each pillar with 3D rotation
    pillarsTimeline.to(pillars, {
      opacity: 1,
      rotateY: 0,
      y: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out"
    });
  }
}

// Function to animate stat counters
function animateStatCounters() {
  if (currentIndex === 1) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const value = parseInt(stat.getAttribute('data-value'), 10);
      
      // Animated count up
      gsap.fromTo(
        stat, 
        { textContent: 0 }, 
        {
          duration: 2.5,
          textContent: value,
          ease: "power2.out",
          snap: { textContent: 1 },
          stagger: 0.25,
          delay: 0.75, // Start after pillars animation
          onUpdate: function() {
            // Add + sign for values over 10
            if (this.targets()[0].textContent > 10) {
              this.targets()[0].textContent = this.targets()[0].textContent + "+";
            }
          }
        }
      );
    });
  }
}

// Function to animate morphing shapes
function animateMorphingShapes() {
  if (currentIndex === 1) {
    const blobs = document.querySelectorAll('.shape-blob path');
    
    // Set initial state
    gsap.set(blobs, { 
      scale: 0.8, 
      opacity: 0 
    });
    
    // Create morphing timeline
    const morphTimeline = gsap.timeline();
    
    // Animate blob appearance
    morphTimeline.to(blobs, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      stagger: 0.3,
      ease: "power2.inOut"
    });
    
    // Create continuous morphing effect
    blobs.forEach(blob => {
      const randomPoints = [
        "M480.8,178.8c-3.1-82.1-80.5-137.6-161.8-128.5C238.4,59.2,182.4,116,151.2,194c-23.4,58.7-4.5,125.5,27.5,173.9c24.3,36.7,60.3,65.3,103.2,72.2c56.7,9.1,115.5-17.1,147.1-67C466.2,318.9,483.4,250.5,480.8,178.8z",
        "M416,239.2c25.7-13.2,62.4-13.6,75.4-43c13-29.4-5.8-64.4-33.1-77.4c-27.3-13-60.2-5.6-83.9,15c-23.7,20.5-40,50.1-64.3,69.9c-24.3,19.8-58.5,26.9-85.5,11.5c-27-15.3-42.8-49.1-37.4-79.2c5.4-30.1,31.9-54.4,61.2-62.4c29.3-8,61.1-0.7,88.6,13.5c27.5,14.2,52.5,36,83.1,42c30.7,6.1,66.4-8.1,76-38.2",
        "M451.2,190.6c-32.8-93.8-130.5-145.3-227-121.5c-96.5,23.8-172.7,116.4-156,212.8c7.8,45,32.8,86.4,70.8,113c38.3,26.8,86.1,37.6,133.3,34.7c47.4-2.9,94.6-21.7,129.8-55.2C437.3,340.7,458.1,298.3,463,256C467.1,222.4,460.9,205.4,451.2,190.6z"
      ];
      
      // Morph between different blob shapes
      gsap.to(blob, {
        duration: 8,
        attr: { d: () => randomPoints[Math.floor(Math.random() * randomPoints.length)] },
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true
      });
      
      // Add slow floating movement
      gsap.to(blob.parentNode, {
        x: "random(-15, 15)",
        y: "random(-15, 15)",
        rotation: "random(-5, 5)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }
}

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
  
  // Different animation timing for mobile
  if (window.innerWidth <= 768) {
    cardEntry.timeScale(1.5); // Speed up animation on mobile
  } else {
    cardEntry.timeScale(1);
  }
  
  cardEntry.play();
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

// Better touch handling for cards
document.querySelectorAll('.card, .mobile-card').forEach(card => {
  card.addEventListener('touchstart', function() {
    this.classList.add('active');
  }, { passive: true });
  
  card.addEventListener('touchend', function() {
    if (!this.classList.contains('card')) {
      setTimeout(() => {
        this.classList.remove('active');
      }, 150);
    }
  }, { passive: true });
});

// Improve flip card touch handling on mobile
if (isMobile) {
  flipCards.forEach(card => {
    let touchStartTime = 0;
    
    card.addEventListener('touchstart', () => {
      touchStartTime = new Date().getTime();
    }, { passive: true });
    
    card.addEventListener('touchend', (e) => {
      // Only flip if it was a quick tap (not a scroll attempt)
      const touchTime = new Date().getTime() - touchStartTime;
      if (touchTime < 300) {
        const inner = card.querySelector(".flip-card-inner");
        gsap.to(inner, {
          rotationY: "+=180",
          duration: 0.6,
          ease: "power2.inOut"
        });
        e.preventDefault();
      }
    }, { passive: false });
  });
}
