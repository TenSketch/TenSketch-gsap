// Portfolio Section Logic
// Loads projects.json, displays 3 cards (center in spotlight, sides faded/small), rotates with next/prev buttons

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.portfolio-cards-grid');
  const prevBtn = document.querySelector('.portfolio-btn.prev');
  const nextBtn = document.querySelector('.portfolio-btn.next');
  let projects = [];
  let current = 1; // Center card index (start with 2nd project for effect)
  let isAnimating = false;

  // Fetch projects.json
  fetch('projects.json')
    .then(res => res.json())
    .then(data => {
      projects = data;
      if (projects.length < 3) return;
      renderCards();
    });

  function animateSlide(direction) {
    if (isAnimating) return;
    isAnimating = true;
    const cards = Array.from(grid.children);
    // Only slide animation, no fade/scale, and only animate the center card for performance
    const onComplete = () => {
      renderCards(true, direction);
      // Animate new cards in (only center card for best performance)
      const newCards = Array.from(grid.children);
      if (newCards[1]) {
        gsap.fromTo(newCards[1], {
          x: -direction * 120
        }, {
          x: 0,
          duration: 0.28,
          ease: 'power2.out',
          onComplete: () => {
            isAnimating = false;
          }
        });
      } else {
        isAnimating = false;
      }
    };
    // Animate only the center card out
    if (cards[1]) {
      gsap.to(cards[1], {
        x: direction * 120,
        duration: 0.28,
        ease: 'power2.in',
        onComplete
      });
    } else {
      onComplete();
    }
  }

  function renderCards(isSliding, direction) {
    grid.innerHTML = '';
    const left = (current - 1 + projects.length) % projects.length;
    const center = current;
    const right = (current + 1) % projects.length;
    [left, center, right].forEach((idx, i) => {
      const p = projects[idx];
      const card = document.createElement('div');
      card.className = 'portfolio-card' + (i === 1 ? ' spotlight' : ' faded');
      card.innerHTML = `
        <a href="${p.liveUrl}" target="_blank" rel="noopener" class="portfolio-card-link">
          <img src="${p.imageSrc}" alt="${p.altText}" class="portfolio-card-img" />
          <div class="portfolio-card-content">
            <h3 class="portfolio-card-title">${p.title}</h3>
            <p class="portfolio-card-desc">${p.description}</p>
            <a href="${p.liveUrl}" target="_blank" rel="noopener" class="portfolio-live-btn">View Live Project</a>
          </div>
        </a>
      `;
      if (!isSliding) {
        card.style.transform = 'translateX(0)';
      }
      grid.appendChild(card);
    });
  }

  prevBtn.addEventListener('click', () => {
    if (isAnimating) return;
    current = (current - 1 + projects.length) % projects.length;
    animateSlide(-1);
  });
  nextBtn.addEventListener('click', () => {
    if (isAnimating) return;
    current = (current + 1) % projects.length;
    animateSlide(1);
  });
});
