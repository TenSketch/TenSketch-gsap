/* web-solutions.js
 * Minimal behavior for Pixi Web page — particles, small GSAP animations, and basic interactions.
 * This prevents 404 and provides a simple, graceful, progressive enhancement.
 */

(function () {
  'use strict';
  console.info('web-solutions.js loaded');

  // --- Particle canvas setup ---
  const canvas = document.getElementById('particleCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = [];
    const COLORS = ['rgba(212,175,55,0.9)', 'rgba(212,175,55,0.65)', 'rgba(212,175,55,0.35)'];

    function createParticles(count = 60) {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 3,
          vx: -0.2 + Math.random() * 0.4,
          vy: -0.2 + Math.random() * 0.4,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    function update() {
      ctx.clearRect(0, 0, w, h);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // glow
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(update);
    }

    function onResize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      createParticles(Math.max(40, Math.floor((w * h) / 100000)));
    }

    window.addEventListener('resize', onResize);
    onResize();
    update();
  }

  // --- GSAP Animations (if available) ---
  function initGsapAnimations() {
    if (window.gsap) {
      try {
        // ========================================
        // HERO SECTION — Rich entrance animations
        // ========================================
        const heroTl = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });

        // Image slides in from left with elastic bounce
        heroTl.to('.pixi-image', {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.75)'
        });

        // Glow appears behind character
        heroTl.to('.pixi-character::after', {
          opacity: 0.8,
          duration: 0.8
        }, '-=0.6');

        // Heading slides up and fades in
        heroTl.to('.hero-heading', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.7');

        // Subtext cascades in
        heroTl.to('.hero-subtext', {
          y: 0,
          opacity: 1,
          duration: 0.7
        }, '-=0.5');

        // Narration slides in with slight delay
        heroTl.to('.pixi-narration', {
          y: 0,
          opacity: 1,
          duration: 0.7
        }, '-=0.4');

        // CTA button pops in with scale
        heroTl.to('.hero-cta', {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }, '-=0.3');

        // Scroll indicator fades in last
        heroTl.to('.scroll-indicator', {
          opacity: 1,
          duration: 0.8
        }, '-=0.2');

        // Continuous floating animation for image after entrance
        heroTl.add(() => {
          gsap.to('.pixi-image', {
            y: -12,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });

        // Scroll indicator bounce loop
        gsap.to('.scroll-indicator', {
          y: 8,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2
        });

        // Glow pulse animation
        gsap.to('.pixi-character', {
          '--glow-opacity': 1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // power cards hover/enter
        if (gsap && gsap.registerPlugin && window.ScrollTrigger) {
          gsap.utils.toArray('.power-card').forEach((el, i) => {
            gsap.fromTo(el, { y: 40, opacity: 0 }, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: i * 0.15,
              scrollTrigger: {
                trigger: el,
                start: 'top 80%'
              }
            });
          });

          // subtle parallax for Pixi character
          gsap.to('.pixi-character', {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            }
          });

          // Hero text parallax on scroll
          gsap.to('.hero-text', {
            yPercent: 15,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            }
          });

          // ========================================
          // INTRO SECTION — Power Cards
          // ========================================
          gsap.from('.section-heading', {
            y: 60,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
              trigger: '.intro-section',
              start: 'top 80%'
            }
          });

          gsap.from('.section-subtext', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
              trigger: '.intro-section',
              start: 'top 80%'
            }
          });

          // ========================================
          // SERVICE SECTIONS — Showcase Galleries
          // ========================================
          
          // PixiSite Section
          gsap.to('.pixisite-section .showcase-main', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.pixisite-section',
              start: 'top 70%'
            }
          });

          gsap.utils.toArray('.pixisite-section .stack-img').forEach((img, i) => {
            gsap.to(img, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: 0.3 + (i * 0.15),
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: '.pixisite-section .showcase-stack',
                start: 'top 85%'
              }
            });
          });

          gsap.from('.pixisite-section .service-info', {
            x: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
              trigger: '.pixisite-section',
              start: 'top 60%'
            }
          });

          // PixiApp Section
          gsap.to('.pixiapp-section .showcase-main', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.pixiapp-section',
              start: 'top 70%'
            }
          });

          gsap.utils.toArray('.pixiapp-section .stack-img').forEach((img, i) => {
            gsap.to(img, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: 0.3 + (i * 0.15),
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: '.pixiapp-section .showcase-stack',
                start: 'top 85%'
              }
            });
          });

          gsap.from('.pixiapp-section .service-info', {
            x: -50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
              trigger: '.pixiapp-section',
              start: 'top 60%'
            }
          });

          // PixiAI Section
          gsap.to('.ai-main-visual', {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: '.pixiai-section',
              start: 'top 70%'
            }
          });

          // Chat bubbles appear
          gsap.utils.toArray('.chat-bubbles .chat-bubble').forEach((bubble, i) => {
            gsap.to(bubble, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: 0.5 + (i * 0.3),
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: '.pixiai-section',
                start: 'top 60%'
              }
            });
          });

          gsap.from('.pixiai-section .service-info', {
            x: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
              trigger: '.pixiai-section',
              start: 'top 60%'
            }
          });

          // ========================================
          // CTA SECTION
          // ========================================
          gsap.to('.pixi-cta-visual', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.cta-section',
              start: 'top 70%'
            }
          });

          gsap.to('.cta-heading', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
              trigger: '.cta-section',
              start: 'top 70%'
            }
          });

          gsap.from('.cta-subtext, .pixi-cta-quote', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            scrollTrigger: {
              trigger: '.cta-section',
              start: 'top 65%'
            }
          });

          gsap.from('.pixi-form', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.pixi-form',
              start: 'top 85%'
            }
          });

          // Service list items stagger animation
          gsap.utils.toArray('.services-list li').forEach((li, i) => {
            gsap.from(li, {
              x: -30,
              opacity: 0,
              duration: 0.5,
              delay: i * 0.08,
              scrollTrigger: {
                trigger: li.closest('.service-section'),
                start: 'top 50%'
              }
            });
          });

          // Product tags stagger animation
          gsap.utils.toArray('.product-tag').forEach((tag, i) => {
            gsap.from(tag, {
              scale: 0.8,
              opacity: 0,
              duration: 0.4,
              delay: i * 0.1,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: tag.closest('.products-list'),
                start: 'top 85%'
              }
            });
          });
        }

        // Hover effects for interactive elements
        gsap.utils.toArray('.power-card').forEach(card => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
          });
        });

      } catch (e) {
        // swallow errors — optional progressive enhancement
        console.warn('GSAP animations failed:', e);
      }
    }
  }

  // --- Interactions (submit handler) ---
  function setupForm() {
    const form = document.getElementById('pixiContactForm');
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = form.querySelector('.submit-btn');
      if (btn) btn.disabled = true;

      // Simulate success
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.classList.add('sent');
        }
        if (window.gsap) {
          gsap.fromTo('.submit-btn', { scale: 0.98 }, { scale: 1, duration: 0.2 });
        }
        alert('Thanks — we received your message (demo)');
        form.reset();
      }, 600);
    });
  }

  // Initialize everything after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    initGsapAnimations();
    setupForm();
  });

})();
