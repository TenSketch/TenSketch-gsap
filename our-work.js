/**
 * Our Work Page - Complete Redesign
 * Immersive Project Gallery with GSAP Animations
 */

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
  staggerDelay: 0.08,
  cardRevealDuration: 0.9,
  filterDuration: 0.6,
  easeOut: "power4.out",
  easeElastic: "elastic.out(1, 0.5)",
  easeBack: "back.out(1.7)"
};

// Card size patterns for bento grid variety
const CARD_PATTERNS = [
  ['size-large', 'size-small', 'size-small'],
  ['size-medium', 'size-medium'],
  ['size-small', 'size-wide', 'size-small'],
  ['size-tall', 'size-medium', 'size-small', 'size-small'],
  ['size-medium', 'size-tall']
];

let allProjects = [];
let currentFilter = 'all';

// ==========================================
// INITIALIZATION
// ==========================================
async function initPortfolio() {
  try {
    const response = await fetch("projects.json");
    allProjects = await response.json();
    
    updateFilterCounts();
    renderProjects(allProjects);
    initHeroAnimations();
    initFilterInteractions();
    initParticles();
    initScrollAnimations();
    
  } catch (error) {
    console.error("Error loading portfolio:", error);
  }
}

// ==========================================
// HERO ANIMATIONS
// ==========================================
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: CONFIG.easeOut } });
  
  // Title lines reveal with stagger
  tl.fromTo(".title-line", 
    { 
      opacity: 0, 
      y: 100,
      rotateX: -30
    },
    { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      duration: 1.2,
      stagger: 0.15
    },
    0.3
  )
  
  // Underline scale in
  .fromTo(".title-underline",
    { opacity: 0, scaleX: 0 },
    { opacity: 1, scaleX: 1, duration: 0.8 },
    "-=0.6"
  )
  
  // Tagline fade up
  .fromTo(".hero-tagline",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8 },
    "-=0.4"
  )
  
  // Filter pills stagger in (wave effect)
  .fromTo(".filter-pills",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8 },
    "-=0.5"
  )
  .fromTo(".filter-pill",
    { 
      opacity: 0, 
      y: 30,
      scale: 0.8
    },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      duration: 0.6,
      stagger: {
        each: 0.08,
        from: "center" // Wave from center
      },
      ease: CONFIG.easeBack
    },
    "-=0.6"
  )
  
  // Scroll indicator
  .fromTo(".scroll-indicator",
    { opacity: 0 },
    { opacity: 0.7, duration: 1 },
    "-=0.3"
  );
}

// ==========================================
// PARTICLE SYSTEM
// ==========================================
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = `${2 + Math.random() * 4}px`;
    particle.style.height = particle.style.width;
    container.appendChild(particle);
    
    // Floating animation
    gsap.to(particle, {
      y: `${-30 + Math.random() * 60}`,
      x: `${-20 + Math.random() * 40}`,
      opacity: 0.2 + Math.random() * 0.4,
      duration: 3 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2
    });
  }
}

// ==========================================
// RENDER PROJECTS
// ==========================================
function renderProjects(projects) {
  const grid = document.getElementById("bentoGrid");
  const emptyState = document.getElementById("emptyState");
  
  grid.innerHTML = "";
  
  if (projects.length === 0) {
    emptyState.classList.add('visible');
    return;
  }
  
  emptyState.classList.remove('visible');
  
  // Assign card sizes based on patterns
  let patternIndex = 0;
  let sizeIndex = 0;
  
  projects.forEach((project, index) => {
    const currentPattern = CARD_PATTERNS[patternIndex % CARD_PATTERNS.length];
    const sizeClass = currentPattern[sizeIndex % currentPattern.length];
    
    sizeIndex++;
    if (sizeIndex >= currentPattern.length) {
      sizeIndex = 0;
      patternIndex++;
    }
    
    const card = createProjectCard(project, sizeClass, index);
    grid.appendChild(card);
  });
  
  // Animate cards in
  animateCardsIn();
}

function createProjectCard(project, sizeClass, index) {
  const card = document.createElement('article');
  card.className = `project-card ${sizeClass}`;
  card.dataset.category = project.filterTag;
  card.dataset.index = index;
  
  card.innerHTML = `
    <div class="card-image-wrap">
      <img src="${project.imageSrc}" alt="${project.altText}" class="card-image" loading="lazy">
      <div class="card-overlay">
        <span class="card-category">${project.filterTag}</span>
        <h3 class="card-title">${project.altText}</h3>
        <p class="card-description">${project.description || 'A premium digital experience crafted with care.'}</p>
        <div class="card-tags">
          ${project.techTags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
        </div>
        <a href="${project.liveUrl}" target="_blank" class="card-link" rel="noopener">
          Visit Site <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
  
  // Add magnetic effect on hover
  addMagneticEffect(card);
  
  return card;
}

// ==========================================
// CARD ANIMATIONS
// ==========================================
function animateCardsIn() {
  const cards = document.querySelectorAll('.project-card');
  
  // Kill any existing ScrollTriggers for cards
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && st.vars.trigger.classList && st.vars.trigger.classList.contains('project-card')) {
      st.kill();
    }
  });
  
  cards.forEach((card, i) => {
    // Initial state
    gsap.set(card, { 
      opacity: 0, 
      y: 80,
      scale: 0.9,
      rotateY: -5
    });
    
    // Scroll-triggered reveal with wave stagger effect
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      duration: CONFIG.cardRevealDuration,
      ease: CONFIG.easeOut,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      delay: (i % 4) * CONFIG.staggerDelay // Wave pattern within viewport
    });
    
    // Image parallax on scroll
    const img = card.querySelector('.card-image');
    if (img) {
      gsap.to(img, {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }
  });
  
  ScrollTrigger.refresh();
}

// ==========================================
// MAGNETIC EFFECT
// ==========================================
function addMagneticEffect(element) {
  const strength = 0.15;
  
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      rotateY: deltaX * 0.02,
      rotateX: -deltaY * 0.02,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: CONFIG.easeElastic
    });
  });
}

// ==========================================
// FILTER SYSTEM
// ==========================================
function initFilterInteractions() {
  const pills = document.querySelectorAll('.filter-pill');
  
  pills.forEach(pill => {
    // Magnetic hover effect on pills
    pill.addEventListener('mousemove', (e) => {
      const rect = pill.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(pill, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    pill.addEventListener('mouseleave', () => {
      gsap.to(pill, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: CONFIG.easeBack
      });
    });
    
    // Click handler
    pill.addEventListener('click', () => handleFilterClick(pill));
  });
}

function handleFilterClick(clickedPill) {
  const filterType = clickedPill.dataset.filter;
  if (filterType === currentFilter) return;
  
  currentFilter = filterType;
  
  // Update active states with elastic animation
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.remove('active');
    gsap.to(pill, {
      scale: 0.95,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(pill, {
          scale: 1,
          duration: 0.4,
          ease: CONFIG.easeElastic
        });
      }
    });
  });
  
  clickedPill.classList.add('active');
  gsap.fromTo(clickedPill, 
    { scale: 0.9 },
    { scale: 1, duration: 0.5, ease: CONFIG.easeElastic }
  );
  
  // Filter and animate projects
  filterProjects(filterType);
}

function filterProjects(filterType) {
  const cards = document.querySelectorAll('.project-card');
  
  // Animate out existing cards
  const tl = gsap.timeline({
    onComplete: () => {
      // Get filtered projects
      const filtered = filterType === 'all' 
        ? allProjects 
        : allProjects.filter(p => matchesFilter(p.filterTag, filterType));
      
      // Re-render with new projects
      renderProjects(filtered);
      
      // Scroll to projects section
      gsap.to(window, {
        scrollTo: { 
          y: "#projectsSection", 
          offsetY: 50 
        },
        duration: 0.8,
        ease: "power3.inOut"
      });
    }
  });
  
  // Stagger out animation
  tl.to(cards, {
    opacity: 0,
    y: -40,
    scale: 0.9,
    duration: CONFIG.filterDuration,
    stagger: {
      each: 0.03,
      from: "random"
    },
    ease: "power3.in"
  });
}

function matchesFilter(filterTag, filterType) {
  const tag = filterTag.toLowerCase();
  const filter = filterType.toLowerCase();
  
  if (tag.includes(filter)) return true;
  if (filter === 'ngo' && tag.includes('social')) return true;
  if (filter === 'creative' && (tag.includes('arts') || tag.includes('culture'))) return true;
  if (filter === 'lifestyle' && (tag.includes('lifestyle') || tag.includes('design'))) return true;
  
  return false;
}

function updateFilterCounts() {
  const counts = {
    all: allProjects.length,
    Corporate: allProjects.filter(p => matchesFilter(p.filterTag, 'Corporate')).length,
    NGO: allProjects.filter(p => matchesFilter(p.filterTag, 'NGO')).length,
    Consulting: allProjects.filter(p => matchesFilter(p.filterTag, 'Consulting')).length,
    Tourism: allProjects.filter(p => matchesFilter(p.filterTag, 'Tourism')).length,
    Creative: allProjects.filter(p => matchesFilter(p.filterTag, 'Creative')).length,
    Lifestyle: allProjects.filter(p => matchesFilter(p.filterTag, 'Lifestyle')).length
  };
  
  document.querySelectorAll('.pill-count').forEach(countEl => {
    const countType = countEl.dataset.count;
    if (counts[countType] !== undefined) {
      countEl.textContent = counts[countType];
    }
  });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
  // CTA Section reveal
  gsap.fromTo(".cta-content", 
    { 
      opacity: 0, 
      y: 60 
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: CONFIG.easeOut,
      scrollTrigger: {
        trigger: ".work-cta",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );
  
  // CTA button bounce in
  gsap.fromTo(".cta-btn",
    { 
      opacity: 0, 
      scale: 0.8,
      y: 30
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: CONFIG.easeBack,
      scrollTrigger: {
        trigger: ".cta-btn",
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    }
  );
  
  // Hide scroll indicator when scrolling
  ScrollTrigger.create({
    trigger: ".projects-section",
    start: "top 80%",
    onEnter: () => {
      gsap.to(".scroll-indicator", {
        opacity: 0,
        y: 20,
        duration: 0.4
      });
    },
    onLeaveBack: () => {
      gsap.to(".scroll-indicator", {
        opacity: 0.7,
        y: 0,
        duration: 0.4
      });
    }
  });
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', initPortfolio);

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
  } else {
    gsap.globalTimeline.resume();
  }
});
