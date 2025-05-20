document.addEventListener('DOMContentLoaded', function() {
  // Fetch projects data
  fetch('projects.json')
    .then(response => response.json())
    .then(projects => {
      initPortfolio(projects);
    })
    .catch(error => {
      console.error('Error loading projects data:', error);
    });

  function initPortfolio(projects) {
    // DOM elements
    const portfolioGrid = document.getElementById('portfolio-cards-grid');
    const prevBtn = document.getElementById('prev-portfolio');
    const nextBtn = document.getElementById('next-portfolio');
    const indicatorsContainer = document.getElementById('portfolio-indicators');
    
    // State variables
    let currentIndex = 0;
    let isAnimating = false;
    const totalProjects = projects.length;
    
    // Create portfolio cards
    function createPortfolioCards() {
      // Clear existing content
      portfolioGrid.innerHTML = '';
      indicatorsContainer.innerHTML = '';
      
      // Generate all project cards
      projects.forEach((project, index) => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'portfolio-card';
        card.dataset.index = index;
        
        // Create tech tags HTML
        const techTagsHTML = project.techTags ? 
          project.techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('') : '';
        
        card.innerHTML = `
          <a href="${project.liveUrl}" class="portfolio-card-link" target="_blank">
            <img src="${project.imageSrc}" alt="${project.altText}" class="portfolio-card-img" loading="lazy">
            <div class="portfolio-card-content">
              <h3 class="portfolio-card-title">${project.title}</h3>
              <p class="portfolio-card-desc">${project.description}</p>
              <span class="portfolio-live-btn">View Live</span>
            </div>
          </a>
        `;
        
        portfolioGrid.appendChild(card);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'portfolio-indicator';
        indicator.dataset.index = index;
        indicatorsContainer.appendChild(indicator);
        
        // Add click event to indicator
        indicator.addEventListener('click', function() {
          if (!isAnimating && currentIndex !== index) {
            goToSlide(index);
          }
        });
      });
      
      // Initial positioning
      updateCardsPosition(true);
    }
    
    // Update cards position based on current index
    function updateCardsPosition(immediate = false) {
      const cards = portfolioGrid.querySelectorAll('.portfolio-card');
      
      cards.forEach((card, index) => {
        // Remove all position classes
        card.classList.remove('spotlight', 'prev', 'next', 'faded', 
                             'slide-left-enter', 'slide-right-enter', 'slide-center-enter');
        
        // Calculate relative position to current card
        const position = (index - currentIndex + totalProjects) % totalProjects;
        
        // Add appropriate classes based on position
        if (position === 0) {
          // Current card (spotlight)
          card.classList.add('spotlight');
          card.style.left = '50%';
          card.style.transform = immediate ? 'translateX(-50%) scale(1.13) translateY(-28px)' : '';
        } else if (position === 1 || (position > 1 && position < Math.ceil(totalProjects / 2))) {
          // Cards to the right
          card.classList.add('faded', 'next');
          card.style.left = '75%';
          card.style.transform = immediate ? 'translateX(-50%) scale(0.85)' : '';
        } else {
          // Cards to the left
          card.classList.add('faded', 'prev');
          card.style.left = '25%';
          card.style.transform = immediate ? 'translateX(-50%) scale(0.85)' : '';
        }
        
        // Update indicators
        const indicators = indicatorsContainer.querySelectorAll('.portfolio-indicator');
        indicators.forEach((indicator, idx) => {
          indicator.classList.toggle('active', idx === currentIndex);
        });
      });
      
      // Use GSAP for smoother animations if available
      if (window.gsap && !immediate) {
        const currentCard = portfolioGrid.querySelector(`.portfolio-card[data-index="${currentIndex}"]`);
        const prevCards = portfolioGrid.querySelectorAll('.portfolio-card.prev');
        const nextCards = portfolioGrid.querySelectorAll('.portfolio-card.next');
        
        gsap.to(currentCard, {
          xPercent: -50,
          scale: 1.13,
          y: -28,
          opacity: 1,
          filter: "blur(0px) grayscale(0)",
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform"
        });
        
        gsap.to(prevCards, {
          xPercent: -50,
          scale: 0.85,
          y: 0,
          opacity: 0.5,
          filter: "blur(1.5px) grayscale(0.5)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.05,
          clearProps: "transform"
        });
        
        gsap.to(nextCards, {
          xPercent: -50,
          scale: 0.85,
          y: 0,
          opacity: 0.5,
          filter: "blur(1.5px) grayscale(0.5)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.05,
          clearProps: "transform"
        });
      }
    }
    
    // Navigate to specific slide with animation
    function goToSlide(index) {
      if (isAnimating || index === currentIndex) return;
      
      isAnimating = true;
      
      // Determine direction
      const direction = index > currentIndex ? 'right' : 'left';
      const cards = portfolioGrid.querySelectorAll('.portfolio-card');
      const oldIndex = currentIndex;
      
      // Update current index
      currentIndex = index;
      
      // Apply animation classes
      if (window.gsap) {
        // Use GSAP for more advanced animations
        const oldCard = portfolioGrid.querySelector(`.portfolio-card[data-index="${oldIndex}"]`);
        const newCard = portfolioGrid.querySelector(`.portfolio-card[data-index="${currentIndex}"]`);
        
        // Timeline for coordinated animation
        const tl = gsap.timeline({
          onComplete: () => {
            updateCardsPosition();
            isAnimating = false;
          }
        });
        
        // Animate the old spotlight card out
        tl.to(oldCard, {
          xPercent: direction === 'right' ? -150 : 50,
          scale: 0.85,
          opacity: 0,
          filter: "blur(3px) grayscale(0.5)",
          duration: 0.6,
          ease: "power2.inOut"
        }, 0);
        
        // Animate the new spotlight card in
        tl.fromTo(newCard, 
          {
            xPercent: direction === 'right' ? 50 : -150,
            scale: 0.85,
            opacity: 0,
            filter: "blur(3px) grayscale(0.5)"
          },
          {
            xPercent: -50,
            scale: 1.13,
            y: -28,
            opacity: 1,
            filter: "blur(0) grayscale(0)",
            duration: 0.6,
            ease: "power2.inOut"
          }, 
          0
        );
        
        // Update indicators
        tl.call(() => {
          const indicators = indicatorsContainer.querySelectorAll('.portfolio-indicator');
          indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === currentIndex);
          });
        }, null, 0.3);
      } else {
        // Fallback for browsers without GSAP
        cards.forEach((card, idx) => {
          if (idx === oldIndex) {
            card.classList.add(direction === 'right' ? 'slide-left-enter' : 'slide-right-enter');
          } else if (idx === currentIndex) {
            card.classList.add('slide-center-enter');
          }
        });
        
        // Update after animation completes
        setTimeout(() => {
          updateCardsPosition();
          isAnimating = false;
        }, 800);
      }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', function() {
      if (!isAnimating) {
        const newIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        goToSlide(newIndex);
      }
    });
    
    nextBtn.addEventListener('click', function() {
      if (!isAnimating) {
        const newIndex = (currentIndex + 1) % totalProjects;
        goToSlide(newIndex);
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' && !isAnimating) {
        const newIndex = (currentIndex + 1) % totalProjects;
        goToSlide(newIndex);
      } else if (e.key === 'ArrowLeft' && !isAnimating) {
        const newIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        goToSlide(newIndex);
      }
    });
    
    // Initialize
    createPortfolioCards();
    
    // Initial ScrollTrigger animation
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.from('.portfolio-section .section-heading', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.portfolio-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        }
      });
      
      gsap.from('.portfolio-card.spotlight', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: '.portfolio-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
          once: true
        }
      });
    }
  }
});
