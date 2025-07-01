document.addEventListener('DOMContentLoaded', function() {
    initCosmicAnimations();
    initHeroAnimations();
    initFilterSystem();
    initCounterAnimations();
    initLazyLoading();
    initScrollAnimations();

    // Smooth scrolling for anchor links
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

    // Initialize cosmic background animations
    function initCosmicAnimations() {
        // Create additional stars
        const starsField = document.querySelector('.stars-field');
        if (starsField) {
            for (let i = 0; i < 150; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 4 + 's';
                star.style.animationDuration = (Math.random() * 3 + 2) + 's';
                starsField.appendChild(star);
            }
        }

        // Randomize falling objects
        const fallingObjects = document.querySelectorAll('.falling-object');
        fallingObjects.forEach((obj, index) => {
            obj.style.left = Math.random() * 100 + '%';
            obj.style.animationDelay = Math.random() * 5 + 's';
            obj.style.animationDuration = (Math.random() * 10 + 10) + 's';
        });

        // Create floating particles
        const particlesContainer = document.querySelector('.floating-particles');
        if (particlesContainer) {
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Create creative particles for gallery section
        const creativeParticles = document.querySelector('.creative-particles');
        if (creativeParticles) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'creative-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 12 + 's';
                creativeParticles.appendChild(particle);
            }
        }
    }

    // Initialize hero animations
    function initHeroAnimations() {
        // Typewriter effect
        const typewriterElement = document.querySelector('.typewriter');
        if (typewriterElement) {
            const text = typewriterElement.textContent;
            typewriterElement.textContent = '';
            let i = 0;

            function typeWriter() {
                if (i < text.length) {
                    typewriterElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }

            setTimeout(typeWriter, 2000);
        }

        // Animate title words
        const titleWords = document.querySelectorAll('.word-animation');
        titleWords.forEach((word, index) => {
            word.style.animationDelay = (index * 0.3) + 's';
        });

        // Animate stats on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // Initialize counter animations
    function initCounterAnimations() {
        // This will be called when stats come into view
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Initialize filter system
    function initFilterSystem() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const logoItems = document.querySelectorAll('.logo-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                // Animate out all items
                logoItems.forEach(item => {
                    item.style.transform = 'translateY(50px)';
                    item.style.opacity = '0';
                });

                // After animation completes, filter items
                setTimeout(() => {
                    logoItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.classList.remove('hidden');
                            // Animate in visible items
                            setTimeout(() => {
                                item.style.transform = 'translateY(0)';
                                item.style.opacity = '1';
                            }, 100);
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                }, 300);
            });
        });
    }

    // Initialize lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Initialize scroll animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe logo items
        const logoItems = document.querySelectorAll('.logo-item');
        logoItems.forEach(item => {
            observer.observe(item);
        });

        // Observe section titles
        const sectionTitles = document.querySelectorAll('.section-title, .cta-title');
        sectionTitles.forEach(title => {
            observer.observe(title);
        });
    }
});

// Global functions for buttons and interactions

function scrollToGallery() {
    const gallery = document.getElementById('gallery');
    if (gallery) {
        const headerOffset = 80;
        const elementPosition = gallery.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function openLogoModal(logoId) {
    const modal = document.getElementById('logoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalLogoName = document.getElementById('modalLogoName');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');

    // Logo data (in a real application, this would come from a database)
    const logoData = {
        1: {
            name: 'Tech Innovate',
            category: 'Technology',
            description: 'A modern, sleek logo design for a cutting-edge technology company. The design emphasizes innovation and forward-thinking with clean lines and a contemporary color palette.',
            image: 'assets/portfolio/1.png'
        },
        2: {
            name: 'Business Pro',
            category: 'Business',
            description: 'Professional corporate identity designed for a business consultancy. The logo conveys trust, reliability, and expertise through its balanced typography and sophisticated color scheme.',
            image: 'assets/portfolio/2.png'
        },
        3: {
            name: 'Creative Studio',
            category: 'Creative',
            description: 'A vibrant and artistic logo for a creative design studio. The design showcases creativity and imagination while maintaining professional appeal.',
            image: 'assets/portfolio/3.png'
        },
        4: {
            name: 'Health Plus',
            category: 'Healthcare',
            description: 'A caring and trustworthy logo design for a healthcare provider. The design emphasizes wellness, care, and medical expertise with calming colors and clean aesthetics.',
            image: 'assets/portfolio/4.png'
        },
        5: {
            name: 'Digital Wave',
            category: 'Technology',
            description: 'Dynamic logo representing the digital transformation wave. The design captures movement and innovation in the tech industry.',
            image: 'assets/portfolio/5.png'
        },
        6: {
            name: 'Elite Corp',
            category: 'Business',
            description: 'Premium corporate logo designed for an elite business firm. The design exudes luxury, professionalism, and high-end service quality.',
            image: 'assets/portfolio/6.png'
        },
        7: {
            name: 'Art Vision',
            category: 'Creative',
            description: 'Artistic and visionary logo for a creative agency. The design balances artistic expression with commercial appeal.',
            image: 'assets/portfolio/7.png'
        },
        8: {
            name: 'Code Matrix',
            category: 'Technology',
            description: 'Tech-focused logo with a matrix-inspired design. Perfect for software development companies and IT services.',
            image: 'assets/portfolio/8.png'
        },
        9: {
            name: 'Care Medical',
            category: 'Healthcare',
            description: 'Compassionate healthcare logo emphasizing patient care and medical excellence. The design instills confidence and trust.',
            image: 'assets/portfolio/9.png'
        },
        10: {
            name: 'Global Solutions',
            category: 'Business',
            description: 'International business logo representing global reach and comprehensive solutions. The design conveys scale and reliability.',
            image: 'assets/portfolio/10.png'
        },
        11: {
            name: 'Design Hub',
            category: 'Creative',
            description: 'Central creative hub logo for a design collective. The design represents collaboration and creative excellence.',
            image: 'assets/portfolio/11.png'
        },
        12: {
            name: 'Future Tech',
            category: 'Technology',
            description: 'Forward-looking technology logo representing the future of innovation. The design is modern, sleek, and futuristic.',
            image: 'assets/portfolio/12.png'
        }
    };

    const logo = logoData[logoId];
    if (logo) {
        modalImage.src = logo.image;
        modalImage.alt = logo.name;
        modalTitle.textContent = 'Logo Details';
        modalLogoName.textContent = logo.name;
        modalCategory.textContent = logo.category;
        modalDescription.textContent = logo.description;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Add click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLogoModal();
            }
        });
    }
}

function closeLogoModal() {
    const modal = document.getElementById('logoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadMoreLogos() {
    // In a real application, this would load more logos from a server
    const logoGrid = document.getElementById('logoGrid');
    const loadMoreBtn = document.querySelector('.load-more');
    
    // Simulate loading
    loadMoreBtn.innerHTML = '<span class="btn-text">Loading...</span><i class="fas fa-spinner fa-spin"></i>';
    loadMoreBtn.disabled = true;

    setTimeout(() => {
        // Create additional logo items (13-21)
        const additionalLogos = [
            { id: 13, name: 'Smart Solutions', category: 'tech', categoryName: 'Technology' },
            { id: 14, name: 'Business Elite', category: 'business', categoryName: 'Business' },
            { id: 15, name: 'Creative Minds', category: 'creative', categoryName: 'Creative' },
            { id: 16, name: 'Health Care Pro', category: 'healthcare', categoryName: 'Healthcare' },
            { id: 17, name: 'Tech Frontier', category: 'tech', categoryName: 'Technology' },
            { id: 18, name: 'Corporate Plus', category: 'business', categoryName: 'Business' },
            { id: 19, name: 'Design Forge', category: 'creative', categoryName: 'Creative' },
            { id: 20, name: 'Medical Center', category: 'healthcare', categoryName: 'Healthcare' },
            { id: 21, name: 'Innovation Lab', category: 'tech', categoryName: 'Technology' }
        ];

        additionalLogos.forEach((logo, index) => {
            const logoItem = document.createElement('div');
            logoItem.className = 'logo-item';
            logoItem.setAttribute('data-category', logo.category);
            logoItem.setAttribute('data-logo', logo.id);
            logoItem.style.opacity = '0';
            logoItem.style.transform = 'translateY(50px)';

            logoItem.innerHTML = `
                <div class="logo-card">
                    <div class="logo-image">
                        <img src="assets/portfolio/${logo.id}.png" alt="Logo ${logo.id}" loading="lazy">
                        <div class="logo-overlay">
                            <div class="overlay-content">
                                <button class="view-btn" onclick="openLogoModal(${logo.id})">
                                    <i class="fas fa-eye"></i>
                                    <span>View Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="logo-info">
                        <h3 class="logo-title">${logo.name}</h3>
                        <p class="logo-category">${logo.categoryName}</p>
                    </div>
                </div>
            `;

            logoGrid.appendChild(logoItem);

            // Animate in with delay
            setTimeout(() => {
                logoItem.style.opacity = '1';
                logoItem.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Hide load more button after loading
        setTimeout(() => {
            loadMoreBtn.style.display = 'none';
        }, 1000);

    }, 1500);
}

function startLogoProject() {
    // In a real application, this would navigate to a contact form or project start page
    window.location.href = 'beyond-web.html#contact';
}

function viewBeyondWeb() {
    window.location.href = 'beyond-web.html';
}

// Keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLogoModal();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Recalculate any position-dependent animations if needed
});

// Add smooth hover effects to cosmic buttons
document.addEventListener('DOMContentLoaded', function() {
    const cosmicBtns = document.querySelectorAll('.cosmic-btn');
    cosmicBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add parallax effect to background elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.cosmic-glow, .grid-line, .creative-particles');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Initialize CSS custom properties for dynamic animations
function initDynamicAnimations() {
    const root = document.documentElement;
    
    // Set random animation delays for falling objects
    const fallingObjects = document.querySelectorAll('.falling-object');
    fallingObjects.forEach((obj, index) => {
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        obj.style.setProperty('--animation-delay', `${delay}s`);
        obj.style.setProperty('--animation-duration', `${duration}s`);
    });
}

// Call dynamic animations on load
document.addEventListener('DOMContentLoaded', initDynamicAnimations);
