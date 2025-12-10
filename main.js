// TenSketch Main Script - Hero Section + Hamburger Menu + Stacked Scroll

document.addEventListener('DOMContentLoaded', () => {
    console.log('TenSketch Hero Section Loaded');

    // ===== HAMBURGER MENU LOGIC =====
    const menu = document.querySelector('nav.menu');
    const menuBtn = document.querySelector('.logo-container') || document.getElementById('logo-menu');
    const closeBtn = document.querySelector('.menu-close');
    const menuItems = document.querySelectorAll('nav.menu li');

    function toggleMenu() {
        if (!menu || !menuBtn) return;
        menu.classList.toggle('open');
        menuBtn.classList.toggle('open');
        
        if (menu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
            // GSAP animation for menu items
            if (window.gsap && menuItems.length) {
                gsap.to(menuItems, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    delay: 0.3
                });
            }
        } else {
            document.body.style.overflow = '';
            if (window.gsap && menuItems.length) {
                gsap.to(menuItems, {
                    y: 20,
                    opacity: 0,
                    duration: 0.3
                });
            }
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu || !menuBtn) return;
        if (menu.classList.contains('open') && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
            menu.classList.remove('open');
            menuBtn.classList.remove('open');
            document.body.style.overflow = '';
            if (window.gsap && menuItems.length) {
                gsap.to(menuItems, { y: 20, opacity: 0, duration: 0.3 });
            }
        }
    });

    // ===== STACKED PRESENTATION SCROLL (GSAP OBSERVER) =====
    initStackedScroll();
});

/**
 * Stacked Presentation Scroll Effect using GSAP Observer
 * - Panels are stacked (first panel on top with highest z-index)
 * - Scroll DOWN: Current panel slides UP to reveal the next one underneath
 * - Scroll UP: Previous panel slides back DOWN to cover the current one
 */
function initStackedScroll() {
    // Register GSAP Observer plugin
    gsap.registerPlugin(Observer);

    const panels = gsap.utils.toArray('.panel');
    
    // Guard: If no panels, exit
    if (panels.length === 0) {
        console.warn('No .panel elements found for stacked scroll.');
        return;
    }

    let currentIndex = 0;  // Currently visible panel index (starts at 0 = top panel)
    let isAnimating = false;  // Flag to prevent double-firing during transitions
    const animationDuration = 0.8;  // Duration of slide transitions

    // Initialize all panels at yPercent: 0 (stacked in place)
    gsap.set(panels, { yPercent: 0 });

    /**
     * Navigate to next panel (scroll DOWN)
     * Slides the current panel UP (yPercent: -100) to reveal the one beneath
     */
    function goToNext() {
        // Prevent if already at last panel or currently animating
        if (currentIndex >= panels.length - 1 || isAnimating) return;
        
        isAnimating = true;
        const currentPanel = panels[currentIndex];

        gsap.to(currentPanel, {
            yPercent: -100,
            duration: animationDuration,
            ease: 'power2.inOut',
            onComplete: () => {
                currentIndex++;
                isAnimating = false;
                animateSectionContent(currentIndex);
            }
        });
    }

    /**
     * Navigate to previous panel (scroll UP)
     * Slides the previous panel DOWN (yPercent: 0) to cover the current one
     */
    function goToPrev() {
        // Prevent if already at first panel or currently animating
        if (currentIndex <= 0 || isAnimating) return;
        
        isAnimating = true;
        const previousPanel = panels[currentIndex - 1];

        gsap.to(previousPanel, {
            yPercent: 0,
            duration: animationDuration,
            ease: 'power2.inOut',
            onComplete: () => {
                currentIndex--;
                isAnimating = false;
                animateSectionContent(currentIndex);
            }
        });
    }

    // Create GSAP Observer for scroll/wheel/touch/pointer events
    Observer.create({
        type: 'wheel, touch, pointer',
        wheelSpeed: -1,  // Normalize mouse wheel to match touch swipe direction
        tolerance: 50,   // Minimum threshold to trigger
        preventDefault: true,  // Disable native scroll

        // onUp: Swipe UP or Mouse Wheel DOWN (Next Section)
        onUp: () => {
            if (!isAnimating) {
                goToNext();
            }
        },

        // onDown: Swipe DOWN or Mouse Wheel UP (Previous Section)
        onDown: () => {
            if (!isAnimating) {
                goToPrev();
            }
        }
    });

    function animateSectionContent(index) {
        // Section 4 (Index 3): Questions Section - Sequential Slide & Flip
        if (index === 3) {
            let tl = gsap.timeline({ delay: 0.5 });
            const cards = document.querySelectorAll(".questions-grid .flip-card");
            
            cards.forEach((card, i) => {
                const inner = card.querySelector(".flip-card-inner");
                
                // Add click interaction (only once)
                if (!card.hasAttribute('data-interactive')) {
                    card.setAttribute('data-interactive', 'true');
                    card.addEventListener("click", () => {
                        const currentRot = gsap.getProperty(inner, "rotationY");
                        // If near 180 (within reasonable float margin), go to 0, else 180
                        const target = (currentRot > 90 && currentRot < 270) ? 0 : 180;
                        gsap.to(inner, { rotationY: target, duration: 0.6, ease: "power2.out" });
                    });
                }

                // 1. Slide In
                tl.fromTo(card, 
                    { y: -50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
                )
                // 2. Wait a bit (read front) -> Flip
                .to(inner, { 
                    rotationY: 180, 
                    duration: 0.8, 
                    ease: "back.out(1.7)",
                    delay: 0.5 
                }, ">") // Starts after slide in + delay
                // 3. Wait a bit (read back) before next card starts
                .to({}, { duration: 0.5 }); 
            });
        }

        // Section 5 (Index 4): Pixi Section - Cards + Character
        if (index === 4) {
            gsap.fromTo(".before-card", 
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
            );
            
            gsap.fromTo(".pixi-character", 
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.7 }
            );
            
            gsap.fromTo(".after-card", 
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.9 }
            );
            
            gsap.fromTo(".pixi-footer", 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 1.3 }
            );
        }

        // Section 6 (Index 5): Blueprint Section
        if (index === 5) {
            gsap.fromTo(".blueprint-grid .blueprint-card", 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.5 }
            );

            gsap.fromTo(".blueprint-pixi", 
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "back.out(1.5)", delay: 1 }
            );
        }

        // Section 7 (Index 6): Gift Form Section
        if (index === 6) {
            gsap.fromTo(".pixi-gift-wrapper", 
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.7)", delay: 0.5 }
            );
            
            gsap.fromTo(".gift-form-card", 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8 }
            );
        }

        // Section 8 (Index 7): Testimonials 3D Ring
        if (index === 7) {
            playTestimonialsAnimation();
        }
    }

    // ===== TESTIMONIALS 3D RING FUNCTIONS =====
    const galleryOuter = document.querySelector('.gallery_box_outer');
    const testimonialItems = Array.from(document.querySelectorAll('.gallery_box_in'));
    let rotationTl = null;
    let testimonialsInitialized = false;

    function placeTestimonialItems() {
        if (!testimonialItems.length) return;
        const N = testimonialItems.length;
        const radius = window.innerWidth <= 600 ? 260 : 450;
        testimonialItems.forEach((item, i) => {
            const angle = (360 / N) * i;
            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
    }

    function playTestimonialsAnimation() {
        if (testimonialsInitialized || !galleryOuter) return;

        const heading = document.querySelector('.testimonials .section-heading');
        const hint = document.querySelector('.testimonial-hint');

        // Place items in ring before animating
        placeTestimonialItems();

        const tl = gsap.timeline();
        
        // Animate heading
        if (heading) {
            tl.fromTo(heading, 
                { y: 50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
            );
        }

        // Animate gallery entrance
        tl.fromTo(galleryOuter, 
            { scale: 0.5, opacity: 0, rotationX: 90 }, 
            { scale: 1, opacity: 1, rotationX: 0, duration: 1.5, ease: 'back.out(1.7)' }, 
            '-=0.7'
        )
        .call(() => {
            const N = testimonialItems.length;
            const duration = Math.min(N * 3, 30);

            // Kill existing rotation if any
            if (rotationTl) rotationTl.kill();
            
            // Create continuous rotation
            rotationTl = gsap.timeline({ repeat: -1 });
            rotationTl.to(galleryOuter, { duration: duration, rotationY: '+=360', ease: 'none' });

            // Pause/Resume functions
            const pause = () => rotationTl && rotationTl.pause();
            const resume = () => rotationTl && rotationTl.resume();

            // Event listeners for pause/resume
            galleryOuter.addEventListener('mousedown', pause);
            galleryOuter.addEventListener('touchstart', pause, { passive: true });
            galleryOuter.addEventListener('mouseup', resume);
            galleryOuter.addEventListener('touchend', resume);
            galleryOuter.addEventListener('mouseleave', resume);

            // Keyboard focus to pause/resume
            galleryOuter.addEventListener('focusin', pause);
            galleryOuter.addEventListener('focusout', resume);

            testimonialsInitialized = true;
        });

        // Animate hint
        if (hint) {
            tl.fromTo(hint, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                '-=0.5'
            );
        }
    }

    // Handle window resize for testimonials
    window.addEventListener('resize', () => {
        if (testimonialsInitialized) {
            placeTestimonialItems();
        }
    });

    console.log(`Stacked scroll initialized with ${panels.length} panels.`);
}
