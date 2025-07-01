document.addEventListener('DOMContentLoaded', function() {
    initCosmicAnimations();
    initHeroAnimations();
    initServiceAnimations();
    initParticleSystem();    
    initContactForm();

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

    
    function initCosmicAnimations() {
        
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

        
        const fallingObjects = document.querySelectorAll('.falling-object');
        fallingObjects.forEach((obj, index) => {
            obj.style.left = Math.random() * 100 + '%';
            obj.style.animationDelay = Math.random() * 5 + 's';
            obj.style.animationDuration = (Math.random() * 10 + 10) + 's';
        });

        
        const particlesContainer = document.querySelector('.floating-particles');
        if (particlesContainer) {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particlesContainer.appendChild(particle);
            }
        }
    }

    
    function initHeroAnimations() {
        
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

        
        const titleWords = document.querySelectorAll('.word-animation');
        titleWords.forEach((word, index) => {
            word.style.animationDelay = (index * 0.3) + 's';
        });

        
        const serviceBubbles = document.querySelectorAll('.service-bubble');
        serviceBubbles.forEach(bubble => {
            bubble.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
            });
            
            bubble.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            });
        });

        
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const servicesSection = document.querySelector('#brand-identity') || document.querySelector('.service-section');
                if (servicesSection) {
                    servicesSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
            
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 200) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            });
        }
    }

    
    function initServiceAnimations() {
        
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

        
        const platformIcons = document.querySelectorAll('.platform-icon');
        platformIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
                const hue = Math.random() * 60;
                this.style.filter = `hue-rotate(${hue}deg) brightness(1.1)`;
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                this.style.filter = 'none';
            });
        });
    }

    
    function initParticleSystem() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer) return;

        
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(2)';
                this.style.opacity = '0.8';
            });
            
            particle.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.opacity = '0.4';
            });
        });
    }

    
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitBtn = this.querySelector('.cosmic-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = '#10B981';
                    
                    
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    
                    
                    setTimeout(() => {
                        this.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2000);
                }, 2000);
            });
        }
    }

    
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
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    function startJourney() {
        const servicesSection = document.querySelector('#brand-identity') || document.querySelector('.service-section');
        if (servicesSection) {
            servicesSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    
    window.startJourney = startJourney;

    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                
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

    
    const animateElements = document.querySelectorAll('.service-content, .contact-info, .contact-form');
    animateElements.forEach(el => observer.observe(el));

    
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 20) particle.remove();
        });
        
        
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index > 100) star.remove();
        });
    }

    
    window.addEventListener('scroll', function() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const hue = scrollPercent * 60;
        document.documentElement.style.setProperty('--dynamic-hue', hue + 'deg');
    });

    
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
    });

    console.log('🚀 Beyond Web: Cosmic landing page initialized!');
});


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


const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);


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


const statNumbers = document.querySelectorAll('.stat-number, .counter');
const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            let target;
            
            
            if (counter.hasAttribute('data-target')) {
                target = parseInt(counter.getAttribute('data-target'));
            } else {
                target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            }
            
            const suffix = counter.textContent.replace(/[\d]/g, '');
            let current = 0;
            const increment = target / 60;  
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.floor(current);
                    counter.textContent = displayValue + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                    
                    
                    counter.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
                    setTimeout(() => {
                        counter.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
                    }, 500);
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


const contactForm = document.querySelector('.form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)';
            
            
            setTimeout(() => {
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                
                
                showNotification('Thank you! We\'ll get back to you soon.', 'success');
            }, 2000);
        }, 1500);
    });
}


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
    
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}


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


const shapes = document.querySelectorAll('.shape');
shapes.forEach((shape, index) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    
    shape.style.left = randomX + '%';
    shape.style.top = randomY + '%';
    
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const translateX = (mouseX - 0.5) * 20;
        const translateY = (mouseY - 0.5) * 20;
        
        shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
});


const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    const icon = item.querySelector('.timeline-icon');
    if (icon) {
        icon.setAttribute('data-step', index + 1);
    }
});


const serviceSelect = document.getElementById('service');
if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
        const selectedService = this.value;
        const serviceCards = document.querySelectorAll('.service-card');
        
        
        serviceCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = '';
        });
        
        
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


window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});


const buttons = document.querySelectorAll('.primary-btn, .secondary-btn, .service-btn, .submit-btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});


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


window.addEventListener('load', function() {
    document.body.classList.add('loaded');
      
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in-up');
        }, index * 200);
    });
});


function openRegistrationPortal() {
    
    const modal = document.createElement('div');
    modal.className = 'registration-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeRegistrationModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="gradient-text">Company Registration Portal</h2>
                <button class="modal-close" onclick="closeRegistrationModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="registration-steps">
                    <div class="step-indicator">
                        <div class="step active">1</div>
                        <div class="step">2</div>
                        <div class="step">3</div>
                    </div>
                    
                    <form class="registration-form" id="registrationForm">
                        <div class="form-section active" data-step="1">
                            <h3>Business Information</h3>
                            <div class="form-group">
                                <label>Company Name *</label>
                                <input type="text" name="companyName" required>
                            </div>
                            <div class="form-group">
                                <label>Business Type *</label>
                                <select name="businessType" required>
                                    <option value="">Select Business Type</option>
                                    <option value="pvt-ltd">Private Limited</option>
                                    <option value="llp">Limited Liability Partnership</option>
                                    <option value="opc">One Person Company</option>
                                    <option value="partnership">Partnership</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Business Activity *</label>
                                <input type="text" name="businessActivity" required>
                            </div>
                        </div>
                        
                        <div class="form-section" data-step="2">
                            <h3>Contact Details</h3>
                            <div class="form-group">
                                <label>Contact Person *</label>
                                <input type="text" name="contactPerson" required>
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label>Address *</label>
                                <textarea name="address" rows="3" required></textarea>
                            </div>
                        </div>
                        
                        <div class="form-section" data-step="3">
                            <h3>Package Selection</h3>
                            <div class="package-options">
                                <div class="package-option" data-package="basic">
                                    <h4>Basic Package</h4>
                                    <div class="price">₹5,999</div>
                                    <ul>
                                        <li>Company Registration</li>
                                        <li>PAN & TAN</li>
                                        <li>Basic Compliance</li>
                                    </ul>
                                </div>
                                <div class="package-option" data-package="premium">
                                    <h4>Premium Package</h4>
                                    <div class="price">₹9,999</div>
                                    <ul>
                                        <li>Everything in Basic</li>
                                        <li>Bank Account Opening</li>
                                        <li>GST Registration</li>
                                        <li>Digital Signature</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-navigation">
                            <button type="button" class="btn-prev" onclick="previousStep()">Previous</button>
                            <button type="button" class="btn-next" onclick="nextStep()">Next</button>
                            <button type="submit" class="cosmic-btn submit-btn" style="display: none;">Start Registration</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    setupRegistrationForm();
    
    
    gsap.fromTo(modal, {
        opacity: 0,
        scale: 0.8
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
}

function closeRegistrationModal() {
    const modal = document.querySelector('.registration-modal');
    if (modal) {
        gsap.to(modal, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => modal.remove()
        });
    }
}

function setupRegistrationForm() {
    let currentStep = 1;
    const totalSteps = 3;
    
    window.nextStep = function() {
        if (currentStep < totalSteps) {
            
            const currentSection = document.querySelector(`[data-step="${currentStep}"]`);
            const nextSection = document.querySelector(`[data-step="${currentStep + 1}"]`);
            
            currentSection.classList.remove('active');
            nextSection.classList.add('active');
            
            
            document.querySelectorAll('.step')[currentStep].classList.add('active');
            
            currentStep++;
            
            
            if (currentStep === totalSteps) {
                document.querySelector('.btn-next').style.display = 'none';
                document.querySelector('.submit-btn').style.display = 'block';
            }
            document.querySelector('.btn-prev').style.display = 'block';
        }
    };
    
    window.previousStep = function() {
        if (currentStep > 1) {
            
            const currentSection = document.querySelector(`[data-step="${currentStep}"]`);
            const prevSection = document.querySelector(`[data-step="${currentStep - 1}"]`);
            
            currentSection.classList.remove('active');
            prevSection.classList.add('active');
            
            
            document.querySelectorAll('.step')[currentStep - 1].classList.remove('active');
            
            currentStep--;
            
            
            if (currentStep === 1) {
                document.querySelector('.btn-prev').style.display = 'none';
            }
            document.querySelector('.btn-next').style.display = 'block';
            document.querySelector('.submit-btn').style.display = 'none';
        }
    };
    
    
    document.querySelectorAll('.package-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.package-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        const formData = new FormData(this);
        const selectedPackage = document.querySelector('.package-option.selected');
        
        if (selectedPackage) {
            formData.append('package', selectedPackage.dataset.package);
        }
        
        
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Processing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Registration request submitted successfully! Our team will contact you within 24 hours.');
            closeRegistrationModal();
        }, 2000);
    });
}


function openMarketingPortal() {
    showNotification('🚀 Social Media Marketing Portal opening soon! Contact us for immediate consultation.', 'info');
    
    
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}


function openBrandPortal() {
    showNotification('🎨 Brand Identity Portal launching soon! Contact us to start your brand transformation.', 'info');
    
    
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}


function openContactPortal() {
    
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.scrollIntoView({
            behavior: 'smooth'
        });
        
        
        setTimeout(() => {
            const firstInput = contactForm.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }
}


window.openMarketingPortal = openMarketingPortal;
window.openBrandPortal = openBrandPortal;
window.openContactPortal = openContactPortal;
