// Web Solution Page Enhanced Animations
document.addEventListener('DOMContentLoaded', function() {
    
    // GSAP Timeline for enhanced animations
    let tl = gsap.timeline();
    
    // Enhanced card hover animations
    const cards = document.querySelectorAll('.approach-card');
    
    cards.forEach((card, index) => {
        // Mouse enter animation
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.6,
                y: -15,
                scale: 1.03,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.2)",
                ease: "power2.out"
            });
            
            // Animate the icon
            gsap.to(card.querySelector('.approach-icon'), {
                duration: 0.4,
                rotation: 5,
                scale: 1.1,
                ease: "power2.out"
            });
            
            // Animate list items
            gsap.to(card.querySelectorAll('.approach-list li'), {
                duration: 0.3,
                x: 5,
                stagger: 0.1,
                ease: "power2.out"
            });
            
            // Animate list icons
            gsap.to(card.querySelectorAll('.list-icon'), {
                duration: 0.3,
                scale: 1.1,
                rotation: 10,
                stagger: 0.05,
                ease: "power2.out"
            });
        });
        
        // Mouse leave animation
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.6,
                y: 0,
                scale: 1,
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                ease: "power2.out"
            });
            
            // Reset icon
            gsap.to(card.querySelector('.approach-icon'), {
                duration: 0.4,
                rotation: 0,
                scale: 1,
                ease: "power2.out"
            });
            
            // Reset list items
            gsap.to(card.querySelectorAll('.approach-list li'), {
                duration: 0.3,
                x: 0,
                ease: "power2.out"
            });
            
            // Reset list icons
            gsap.to(card.querySelectorAll('.list-icon'), {
                duration: 0.3,
                scale: 1,
                rotation: 0,
                ease: "power2.out"
            });
        });
    });
    
    // Floating animation for timeline line
    if (window.innerWidth > 768) {
        gsap.to('.timeline-line', {
            duration: 3,
            scaleX: 1.05,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut"
        });
        
        // Pulse animation for timeline points
        gsap.to('.timeline-line::before, .timeline-line::after', {
            duration: 2,
            scale: 1.2,
            opacity: 0.8,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut"
        });
    }
    
    // Number counter animation
    const numbers = document.querySelectorAll('.number-bg');
    numbers.forEach((number, index) => {
        const targetNumber = index + 1;
        let currentNumber = 0;
        
        const interval = setInterval(() => {
            if (currentNumber < targetNumber) {
                currentNumber++;
                number.textContent = currentNumber.toString().padStart(2, '0');
            } else {
                clearInterval(interval);
            }
        }, 100 + (index * 50));
    });
    
    // Scroll-triggered animations for mobile
    if (window.innerWidth <= 768) {
        ScrollTrigger.batch('.approach-card', {
            onEnter: (elements) => {
                gsap.from(elements, {
                    duration: 0.8,
                    y: 50,
                    opacity: 0,
                    stagger: 0.2,
                    ease: "power2.out"
                });
            },
            onLeave: (elements) => {
                gsap.to(elements, {
                    duration: 0.3,
                    opacity: 0.7,
                    ease: "power2.out"
                });
            },
            onEnterBack: (elements) => {
                gsap.to(elements, {
                    duration: 0.3,
                    opacity: 1,
                    ease: "power2.out"
                });
            }
        });
    }
    
    // Particle animation effect
    function createParticles() {
        const particleContainer = document.querySelector('.approach-timeline');
        if (!particleContainer) return;
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(212, 175, 55, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
            `;
            
            particleContainer.appendChild(particle);
            
            // Random positioning
            gsap.set(particle, {
                x: Math.random() * particleContainer.offsetWidth,
                y: Math.random() * particleContainer.offsetHeight,
                opacity: 0
            });
            
            // Float animation
            gsap.to(particle, {
                duration: 3 + Math.random() * 2,
                y: "-=50",
                x: "+=20",
                opacity: 1,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: Math.random() * 2
            });
        }
    }
    
    // Initialize particles on desktop
    if (window.innerWidth > 768) {
        createParticles();
    }
    
    // Enhanced text reveal animation
    const textElements = document.querySelectorAll('.approach-title, .list-text');
    textElements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
            gsap.to(element, {
                duration: 0.3,
                color: '#d4af37',
                textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
                ease: "power2.out"
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                duration: 0.3,
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                ease: "power2.out"
            });
        });
    });
    
    // Magnetic effect for cards on desktop
    if (window.innerWidth > 768) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(card, {
                    duration: 0.3,
                    x: x * 0.1,
                    y: y * 0.1,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                    ease: "power2.out"
                });
            });
        });
    }
    
    // Background glow effect
    function createGlowEffect() {
        const section = document.querySelector('.first.approach-section');
        if (!section) return;
        
        const glow = document.createElement('div');
        glow.className = 'background-glow';
        glow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            filter: blur(20px);
        `;
        
        section.appendChild(glow);
        
        gsap.set(glow, {
            x: -150,
            y: -150
        });
        
        gsap.to(glow, {
            duration: 8,
            rotation: 360,
            repeat: -1,
            ease: "none"
        });
        
        gsap.to(glow, {
            duration: 4,
            scale: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut"
        });
    }
    
    createGlowEffect();
    
    console.log('Web Solution animations loaded successfully!');
});

// Performance optimization: cleanup on page unload
window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf("*");
});