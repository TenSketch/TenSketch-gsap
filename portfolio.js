
class PortfolioGrid {
  constructor() {
    this.projects = [];
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.init();
  }

  async init() {
    await this.loadProjects();
    this.setupElements();
    this.renderPortfolio();
    this.setupEventListeners();
    this.setupGSAPAnimations();
  }

  async loadProjects() {
    try {
      const response = await fetch('projects.json');
      this.projects = await response.json();
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = []; 
    }
  }

  setupElements() {
    this.grid = document.getElementById('portfolioGrid');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.prevBtnMobile = document.getElementById('prevBtnMobile');
    this.nextBtnMobile = document.getElementById('nextBtnMobile');
    this.indicators = document.getElementById('portfolioIndicators');
  }

  createPortfolioCard(project, position) {
    const card = document.createElement('div');
    card.className = `portfolio-card ${position}`;
    card.innerHTML = `
      <img src="${project.imageSrc}" alt="${project.altText}" class="portfolio-image" loading="lazy">
      <div class="portfolio-content">
        <h3 class="portfolio-title">${project.title}</h3>
        <p class="portfolio-description">${project.description}</p>
        <div class="portfolio-tech">
          ${project.techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
        </div>
        <a href="${project.liveUrl}" target="_blank" rel="noopener" class="portfolio-link">
          View Project <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `;
    return card;
  }

  getVisibleProjects() {
    if (this.projects.length === 0) return [];
    
    const visible = [];
    const totalProjects = this.projects.length;
    
    
    const prevIndex = (this.currentIndex - 1 + totalProjects) % totalProjects;
    const nextIndex = (this.currentIndex + 1) % totalProjects;
    
    visible.push({
      project: this.projects[prevIndex],
      position: 'side left',
      index: prevIndex
    });
    
    visible.push({
      project: this.projects[this.currentIndex],
      position: 'center',
      index: this.currentIndex
    });
    
    visible.push({
      project: this.projects[nextIndex],
      position: 'side right',
      index: nextIndex
    });
    
    return visible;
  }

  renderPortfolio() {
    if (!this.grid || this.projects.length === 0) return;
    
    this.grid.innerHTML = '';
    const visibleProjects = this.getVisibleProjects();
    
    visibleProjects.forEach(({ project, position }) => {
      const card = this.createPortfolioCard(project, position);
      this.grid.appendChild(card);
    });
    
    this.updateIndicators();
    this.updateNavigationButtons();
  }

  updateIndicators() {
    if (!this.indicators) return;
    
    this.indicators.innerHTML = '';
    this.projects.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = `indicator ${index === this.currentIndex ? 'active' : ''}`;
      indicator.addEventListener('click', () => this.goToProject(index));
      this.indicators.appendChild(indicator);
    });
  }

  updateNavigationButtons() {
    if (!this.prevBtn || !this.nextBtn) return;
    
    
    this.prevBtn.disabled = this.projects.length <= 1;
    this.nextBtn.disabled = this.projects.length <= 1;
  }

  navigateToProject(direction) {
    if (this.isTransitioning || this.projects.length <= 1) return;
    
    this.isTransitioning = true;
    
    const prevIndex = this.currentIndex;
    if (direction === 'next') {
      this.currentIndex = (this.currentIndex + 1) % this.projects.length;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
    }
    
    this.animateSlidingTransition(direction, prevIndex, () => {
      this.isTransitioning = false;
    });
  }

  goToProject(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    
    this.isTransitioning = true;
    const prevIndex = this.currentIndex;
    const direction = index > this.currentIndex ? 'next' : 'prev';
    this.currentIndex = index;
    
    this.animateSlidingTransition(direction, prevIndex, () => {
      this.isTransitioning = false;
    });
  }

  animateSlidingTransition(direction, prevIndex, callback) {
    if (!window.gsap) {
      
      this.renderPortfolio();
      setTimeout(callback, 300);
      return;
    }

    
    const isMobile = window.innerWidth <= 480;
    
    if (isMobile) {
      this.animateMobileTransition(direction, callback);
    } else {
      this.animateDesktopSliding(direction, callback);
    }
  }

  animateMobileTransition(direction, callback) {
    const cards = this.grid.querySelectorAll('.portfolio-card');
    
    
    gsap.to(cards, {
      y: direction === 'next' ? -30 : 30,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.inOut",
      stagger: 0.1,
      onComplete: () => {
        this.renderNewCards();
        
        const newCards = this.grid.querySelectorAll('.portfolio-card');
        gsap.fromTo(newCards, 
          {
            y: direction === 'next' ? 30 : -30,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.1,
            onComplete: callback
          }
        );
      }
    });
  }

  animateDesktopSliding(direction, callback) {
    const cards = this.grid.querySelectorAll('.portfolio-card');
    const isNext = direction === 'next';
    
    
    this.slideOutCards(cards, isNext, () => {
      
      this.renderNewCards();
      
      
      this.slideInCards(isNext, callback);
    });
  }

  slideOutCards(cards, isNext, callback) {
    const exitDirection = isNext ? 'sliding-out-left' : 'sliding-out-right';
    
    
    cards.forEach((card, index) => {
      card.classList.add(exitDirection);
    });
    
    
    gsap.to(cards, {
      x: isNext ? -180 : 180,
      scale: 0.7,
      rotationY: isNext ? 20 : -20,
      opacity: 0,
      filter: "blur(3px)",
      duration: 0.5,
      ease: "power2.inOut",
      stagger: 0.08,
      onComplete: () => {
        
        cards.forEach(card => {
          gsap.set(card, { clearProps: "all" });
          card.classList.remove(exitDirection);
        });
        callback();
      }
    });
  }

  renderNewCards() {
    
    this.grid.innerHTML = '';
    const visibleProjects = this.getVisibleProjects();
    
    visibleProjects.forEach(({ project, position }) => {
      const card = this.createPortfolioCard(project, position);
      this.grid.appendChild(card);
    });
    
    this.updateIndicators();
    this.updateNavigationButtons();
  }

  slideInCards(isNext, callback) {
    const newCards = this.grid.querySelectorAll('.portfolio-card');
    const entryDirection = isNext ? 'sliding-in-right' : 'sliding-in-left';
    
    
    newCards.forEach(card => {
      card.classList.add(entryDirection);
      gsap.set(card, {
        x: isNext ? 150 : -150,
        scale: 0.75,
        rotationY: isNext ? 15 : -15,
        opacity: 0,
        filter: "blur(2px)"
      });
    });
    
    
    newCards.forEach((card, index) => {
      
      let position = 'center';
      if (card.classList.contains('side')) {
        if (card.classList.contains('left')) {
          position = 'left';
        } else if (card.classList.contains('right')) {
          position = 'right';
        }
      }
      
      
      let finalProps = {};
      
      if (position === 'center') {
        finalProps = {
          x: 0,
          scale: 1.05,
          rotationY: 0,
          opacity: 1,
          filter: "brightness(1.1) blur(0px)"
        };
      } else if (position === 'left') {
        finalProps = {
          x: -20,
          scale: 0.9,
          rotationY: 5,
          opacity: 0.7,
          filter: "brightness(0.8) blur(0px)"
        };
      } else if (position === 'right') {
        finalProps = {
          x: 20,
          scale: 0.9,
          rotationY: -5,
          opacity: 0.7,
          filter: "brightness(0.8) blur(0px)"
        };
      }
      
      gsap.to(card, {
        ...finalProps,
        duration: 0.7,
        delay: index * 0.1,
        ease: "back.out(1.1)",
        onComplete: index === newCards.length - 1 ? () => {
          
          newCards.forEach(c => {
            c.classList.remove(entryDirection);
            
            gsap.set(c, { 
              clearProps: "transform,opacity,filter",
              force3D: false 
            });
          });
          callback();
        } : null
      });
    });
  }

  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigateToProject('prev'));
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigateToProject('next'));
    }
    
    if (this.prevBtnMobile) {
      this.prevBtnMobile.addEventListener('click', () => this.navigateToProject('prev'));
    }
    
    if (this.nextBtnMobile) {
      this.nextBtnMobile.addEventListener('click', () => this.navigateToProject('next'));
    }
    
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.navigateToProject('prev');
      } else if (e.key === 'ArrowRight') {
        this.navigateToProject('next');
      }
    });
    
    
    this.setupTouchEvents();
    
    
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
  }

  handleResize() {
    
    if (!this.isTransitioning) {
      this.renderPortfolio();
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  setupTouchEvents() {
    if (!this.grid) return;
    
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    this.grid.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });
    
    this.grid.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      const timeDiff = endTime - startTime;
      
      
      
      
      
      if (Math.abs(diffX) > Math.abs(diffY) && 
          Math.abs(diffX) > 30 && 
          timeDiff < 500) {
        
        e.preventDefault();
        
        if (diffX > 0) {
          this.navigateToProject('next');
        } else {
          this.navigateToProject('prev');
        }
      }
      
      
      startX = 0;
      startY = 0;
      startTime = 0;
    }, { passive: false });
  }

  setupGSAPAnimations() {
    if (!window.gsap) return;
    
    
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    
    gsap.set('.portfolio-card', { 
      force3D: true,
      backfaceVisibility: 'hidden'
    });
    
    
    gsap.fromTo('.section-heading', 
      {
        opacity: 0,
        y: 40,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: '.portfolio-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    gsap.fromTo('.portfolio-navigation', 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.portfolio-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    
    gsap.fromTo('.portfolio-card', 
      {
        opacity: 0,
        scale: 0.8,
        y: 30
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        delay: 0.5,
        ease: "back.out(1.1)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.portfolio-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const portfolioGrid = new PortfolioGrid();
});


window.PortfolioGrid = PortfolioGrid;