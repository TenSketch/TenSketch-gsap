document.addEventListener('DOMContentLoaded', function() {
    // Initialize cosmic animations
    initCosmicAnimations();
    initHeroAnimations();
    initServiceAnimations();
    initParticleSystem();
    
    // Navigation functionality
    initNavigation();
    
    // Form handling
    initContactForm();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cosmic Background Animations
    function initCosmicAnimations() {
        // Create dynamic stars
        const starsField = document.querySelector('.stars-field');
        if (starsField) {
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 4 + 's';
                star.style.animationDuration = (Math.random() * 3 + 2) + 's';
                starsField.appendChild(star);
            }
        }

        // Animate falling objects
        const fallingObjects = document.querySelectorAll('.falling-object');
        fallingObjects.forEach((obj, index) => {
            obj.style.left = Math.random() * 100 + '%';
            obj.style.animationDelay = Math.random() * 5 + 's';
            obj.style.animationDuration = (Math.random() * 10 + 15) + 's';
            
            // Add rotation for some objects
            if (Math.random() > 0.5) {
                obj.style.animation += `, rotate ${Math.random() * 10 + 5}s linear infinite`;
            }
        });

        // Create floating particles
        const particlesContainer = document.querySelector('.floating-particles');
        if (particlesContainer) {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 10 + 's';
                particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }
    }

    // Hero Section Animations
    function initHeroAnimations() {
        // Typewriter effect for subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.style.borderRight = '2px solid #8B5CF6';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                } else {
                    // Remove cursor after typing
                    setTimeout(() => {
                        subtitle.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing after title animation
            setTimeout(typeWriter, 2000);
        }

        // Animate title words
        const titleWords = document.querySelectorAll('.title-word');
        titleWords.forEach((word, index) => {
            word.style.animationDelay = (index * 0.3) + 's';
        });

        // Service bubbles hover effects
        const serviceBubbles = document.querySelectorAll('.service-bubble');
        serviceBubbles.forEach(bubble => {
            bubble.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.05)';
                this.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
            });
            
            bubble.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            });
        });

        // Cosmic scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                document.querySelector('#services').scrollIntoView({
                    behavior: 'smooth'
                });
            });
            
            // Hide scroll indicator on scroll
            window.addEventListener('scroll', function() {
                if (window.scrollY > 200) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            });
        }
    }

    // Service Section Animations
    function initServiceAnimations() {
        // USP animations on scroll
        const uspItems = document.querySelectorAll('.usp-item');
        const uspObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });

        uspItems.forEach(item => {
            item.style.transform = 'translateY(30px)';
            item.style.opacity = '0';
            item.style.transition = 'all 0.6s ease';
            uspObserver.observe(item);
        });

        // Cosmic buttons with trail effect
        const cosmicButtons = document.querySelectorAll('.cosmic-btn');
        cosmicButtons.forEach(button => {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Create trail effect
                const trail = document.createElement('div');
                trail.className = 'button-trail';
                trail.style.left = x + 'px';
                trail.style.top = y + 'px';
                this.appendChild(trail);
                
                setTimeout(() => {
                    trail.remove();
                }, 600);
            });
        });

        // Platform icons animation
        const platformIcons = document.querySelectorAll('.platform-icon');
        platformIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
                // Add random color shift
                const hue = Math.random() * 60;
                this.style.filter = `hue-rotate(${hue}deg) brightness(1.1)`;
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                this.style.filter = 'none';
            });
        });
    }

    // Particle System
    function initParticleSystem() {
        // Create cosmic glow effect
        const cosmicGlow = document.querySelector('.cosmic-glow');
        if (cosmicGlow) {
            for (let i = 0; i < 10; i++) {
                const glow = document.createElement('div');
                glow.className = 'glow-orb';
                glow.style.left = Math.random() * 100 + '%';
                glow.style.top = Math.random() * 100 + '%';
                glow.style.animationDelay = Math.random() * 5 + 's';
                glow.style.animationDuration = (Math.random() * 8 + 5) + 's';
                cosmicGlow.appendChild(glow);
            }
        }

        // Mouse follower effect
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            // Update cosmic cursor
            const cursor = document.querySelector('.cosmic-cursor');
            if (cursor) {
                cursor.style.left = followerX + 'px';
                cursor.style.top = followerY + 'px';
            }
            
            requestAnimationFrame(updateFollower);
        }
        updateFollower();
    }

    // Navigation functionality
    function initNavigation() {
        // Navbar background change on scroll
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
        });

        // Mobile menu functionality
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinksContainer = document.querySelector('.nav-links');
        
        if (mobileMenuToggle && navLinksContainer) {
            mobileMenuToggle.addEventListener('click', function() {
                navLinksContainer.classList.toggle('mobile-active');
                this.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            const mobileLinks = navLinksContainer.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navLinksContainer.classList.remove('mobile-active');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }
    }

    // Contact form handling
    function initContactForm() {
        const form = document.querySelector('.form');
        const submitBtn = document.querySelector('.submit-btn');
        
        if (form && submitBtn) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Animate submit button
                submitBtn.style.transform = 'scale(0.95)';
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                    
                    // Reset form
                    setTimeout(() => {
                        form.reset();
                        submitBtn.innerHTML = '<span>Start My Business Journey</span><i class="fas fa-paper-plane"></i>';
                        submitBtn.style.background = 'var(--cosmic-gradient)';
                        submitBtn.style.transform = 'scale(1)';
                    }, 2000);
                }, 2000);
            });
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Special animations for different elements
                if (entry.target.classList.contains('service-content')) {
                    setTimeout(() => {
                        const usps = entry.target.querySelectorAll('.usp-item');
                        usps.forEach((usp, index) => {
                            setTimeout(() => {
                                usp.style.transform = 'translateY(0)';
                                usp.style.opacity = '1';
                            }, index * 200);
                        });
                    }, 300);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-content, .contact-info, .contact-form');
    animateElements.forEach(el => observer.observe(el));

    // Add cosmic cursor
    const cosmicCursor = document.createElement('div');
    cosmicCursor.className = 'cosmic-cursor';
    document.body.appendChild(cosmicCursor);

    // Performance optimization: Reduce animations on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 20) particle.remove();
        });
        
        // Reduce stars count
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index > 100) star.remove();
        });
    }

    // Add dynamic background color change based on scroll
    window.addEventListener('scroll', function() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const hue = scrollPercent * 60; // Change hue from 0 to 60 degrees
        document.documentElement.style.setProperty('--dynamic-hue', hue + 'deg');
    });

    console.log('🚀 Beyond Web: Cosmic landing page initialized!');
});
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .timeline-item, .benefit-item, .stat-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon i');
            const iconGlow = this.querySelector('.icon-glow');
            
            if (icon && iconGlow) {
                icon.style.transform = 'scale(1.1)';
                iconGlow.style.opacity = '0.3';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon i');
            const iconGlow = this.querySelector('.icon-glow');
            
            if (icon && iconGlow) {
                icon.style.transform = 'scale(1)';
                iconGlow.style.opacity = '0';
            }
        });
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                const suffix = counter.textContent.replace(/[\d]/g, '');
                let current = 0;
                const increment = target / 50;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5
    });

    statNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Form handling
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)';
                
                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showNotification('Thank you! We\'ll get back to you soon.', 'success');
                }, 2000);
            }, 1500);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // Preview card interactions
    const previewCards = document.querySelectorAll('.preview-card');
    previewCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        
        card.addEventListener('click', function() {
            const service = this.dataset.service || this.classList[1];
            const serviceSection = document.getElementById('services');
            const targetCard = document.querySelector(`[data-service="${service}"]`);
            
            if (serviceSection && targetCard) {
                serviceSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    targetCard.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        targetCard.style.transform = '';
                    }, 500);
                }, 800);
            }
        });
    });

    // Floating shapes animation enhancement
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        shape.style.left = randomX + '%';
        shape.style.top = randomY + '%';
        
        // Add mouse interaction
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const translateX = (mouseX - 0.5) * 20;
            const translateY = (mouseY - 0.5) * 20;
            
            shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
    });

    // Timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        const icon = item.querySelector('.timeline-icon');
        if (icon) {
            icon.setAttribute('data-step', index + 1);
        }
    });

    // Service selection handling
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const selectedService = this.value;
            const serviceCards = document.querySelectorAll('.service-card');
            
            // Reset all cards
            serviceCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = '';
            });
            
            // Highlight selected service
            if (selectedService && selectedService !== '') {
                const targetCard = document.querySelector(`[data-service="${selectedService}"]`);
                if (targetCard) {
                    setTimeout(() => {
                        targetCard.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                        targetCard.style.transform = 'scale(1.02)';
                        targetCard.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.3)';
                        
                        setTimeout(() => {
                            targetCard.style.transform = '';
                            targetCard.style.boxShadow = '';
                        }, 2000);
                    }, 500);
                }
            }
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Enhanced hover effects for buttons
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn, .service-btn, .submit-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        imageObserver.observe(img);
    });

    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger entrance animations
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
    });
});

// CSS for notifications (inject into head)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-color: var(--accent-emerald);
        background: rgba(16, 185, 129, 0.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--light-gray);
        font-weight: 500;
    }
    
    .notification-success .notification-content i {
        color: var(--accent-emerald);
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
