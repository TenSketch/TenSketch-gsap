

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('pixiapp-page')) {
    const menuBtn = document.querySelector('.logo-container');
    const menu = document.querySelector('.menu');
    const closeBtn = document.querySelector('.menu-close');
    const menuItems = document.querySelectorAll('.menu li');

    function toggleMenu() {
      menu.classList.toggle('open');
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
  }


  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });


  if (document.querySelector('.sketch-path')) {
    heroTl.to('.sketch-path', {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.inOut'
    });
  }


  heroTl.from('.pixi-img', {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.2)'
  }, '-=1.5');


  heroTl.from('.hero-label', {
    rotation: -10,
    opacity: 0,
    y: 20,
    duration: 0.8
  }, '-=0.5');

  heroTl.from('.hero-heading', {
    y: 50,
    opacity: 0,
    duration: 1
  }, '-=0.6');


  heroTl.fromTo('.highlight-text', {
    '--highlight-width': '0%'
  }, {
    '--highlight-width': '110%',
    duration: 0.6,
    ease: 'power1.inOut'
  }, '-=0.4');

  heroTl.from('.hero-desc', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, '-=0.4');

  heroTl.fromTo('.cta-btn', {
    scale: 0.5,
    opacity: 0
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.2');


  gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,

      duration: 0.8,
      delay: i * 0.1
    });
  });


  gsap.utils.toArray('.service-item').forEach((item, i) => {
    const icon = item.querySelector('.service-icon');
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.1
    });
    

    item.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        rotation: 10,
        scale: 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 3
      });
    });
  });


  const processLine = document.querySelector('.process-line');
  if (processLine) {
    gsap.from(processLine, {
      scrollTrigger: {
        trigger: '.process-section',
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1
      },
      height: 0,
      ease: 'none'
    });
  }

  gsap.utils.toArray('.process-step').forEach((step, i) => {
    const content = step.querySelector('.step-content');
    const marker = step.querySelector('.step-marker');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: 'top 75%'
      }
    });

    tl.from(marker, { scale: 0, duration: 0.4, ease: 'back.out(2)' })
      .from(content, { 
        x: i % 2 === 0 ? -50 : 50, 
        opacity: 0, 
        duration: 0.6 
      }, '-=0.2');
  });


  gsap.to('.doodle-1', {
    y: -20,
    rotation: -5,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  gsap.to('.doodle-2', {
    y: 20,
    rotation: 20,
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // --- Theme Toggler Logic (New) ---
  function setupThemeToggler() {
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
  }

  // Init Theme Toggler
  setupThemeToggler();

});
