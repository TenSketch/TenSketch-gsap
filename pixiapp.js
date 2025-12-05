

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Navigation / menu removed for PixiApp — menu-specific DOM & listeners removed


  const heroSection = document.querySelector('.hero-section');
  const shapes = document.querySelectorAll('.shape');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      shapes.forEach((shape, i) => {
        const depth = (i + 1) * 20;
        gsap.to(shape, {
          x: x * depth,
          y: y * depth,
          rotation: x * 5,
          duration: 1,
          ease: 'power2.out'
        });
      });
    });
  }


  const heroTl = gsap.timeline();
  
  heroTl.from('.shape', {
    scale: 0,
    opacity: 0,
    stagger: 0.2,
    duration: 1.5,
    ease: 'elastic.out(1, 0.75)'
  });

  heroTl.from('.hero-tag', { y: 20, opacity: 0, duration: 0.8 }, '-=1');
  heroTl.from('.hero-title span', { y: 50, opacity: 0, stagger: 0.2, duration: 1 }, '-=0.8');
  heroTl.from('.hero-desc', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');
  heroTl.from('.hero-btn', { scale: 0.8, opacity: 0, duration: 0.5 }, '-=0.4');


  const prismCards = document.querySelectorAll('.prism-card');

  prismCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      

      const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10; /* compute rotateX based on mouse Y */


      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);


      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.5,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {

      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });


  gsap.fromTo('.prism-card', 
    { y: 50, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.prism-grid',

        toggleActions: 'play none none reverse'
      },
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out'
    }
  );


  const stackCards = gsap.utils.toArray('.stack-card');
  
  stackCards.forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 150px',
        end: 'top 100px',
        scrub: true,
        toggleActions: 'play none none reverse'
      },
      scale: 1 - (stackCards.length - i) * 0.05,
      y: -(stackCards.length - i) * 10,
      opacity: 1 - (stackCards.length - i) * 0.1
    });
  });


  gsap.to('.pipeline-fill', {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.pipeline-container',
      start: 'top center',
      end: 'bottom center',
      scrub: 0.5
    }
  });


  gsap.utils.toArray('.process-step').forEach(step => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => step.classList.add('active'),
      onLeaveBack: () => step.classList.remove('active')
    });
  });

});
