document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".page-title", { 
        y: 50, 
        opacity: 0, 
        duration: 1, 
        delay: 0.2 
    })
    .from(".intro-text", { 
        y: 30, 
        opacity: 0, 
        duration: 0.8 
    }, "-=0.6")
    .from(".detail-item", { 
        x: -30, 
        opacity: 0, 
        stagger: 0.2, 
        duration: 0.8 
    }, "-=0.4")
    .from(".social-hero", { 
        scale: 0, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 0.5 
    }, "-=0.4")
    .from(".form-card", { 
        y: 50, 
        opacity: 0, 
        duration: 1 
    }, "-=0.8")
    .from(".pixi-greeting", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
    }, "-=0.4");

    // Form Interactions
    const form = document.getElementById("contact-form");
    const inputs = form.querySelectorAll("input, textarea, select");

    // Input Focus Effects (Handled mostly by CSS, but added JS for complex interactions if needed)
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.nextElementSibling, { color: "#d4af37", duration: 0.3 });
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                gsap.to(input.nextElementSibling, { color: "rgba(255,255,255,0.5)", duration: 0.3 });
            }
        });
    });

    // Form Submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const btn = form.querySelector(".submit-btn-modern");
        const btnText = btn.querySelector(".btn-text");
        const btnIcon = btn.querySelector(".btn-icon");

        // Simulate sending
        const originalText = btnText.textContent;
        btnText.textContent = "Sending...";
        gsap.to(btn, { opacity: 0.8, pointerEvents: "none" });

        // Simulate API call
        setTimeout(() => {
            // Success State
            btnText.textContent = "Message Sent!";
            btnIcon.innerHTML = '<i class="fas fa-check"></i>';
            btnIcon.style.color = "green";
            
            gsap.to(btn, { backgroundColor: "#fff", duration: 0.3 }); // Flash effect

            // Reset Form (Optional: delay reset)
            setTimeout(() => {
                form.reset();
                btnText.textContent = originalText;
                btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                btnIcon.style.color = "#d4af37";
                gsap.to(btn, { 
                    backgroundColor: "transparent", /* reset to gradient handled by CSS class but might need explicit reset if inline styles added */
                    backgroundImage: "linear-gradient(135deg, var(--accent-gold), var(--accent-sandal))",
                    opacity: 1, 
                    pointerEvents: "all" 
                });
                
                // Show Pixi thanks bubble
                const bubble = document.querySelector(".bubble");
                if (bubble) {
                    bubble.textContent = "Thanks! We'll reply soon.";
                    gsap.fromTo(bubble, { scale: 0 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
                }

            }, 2000);
        }, 1500);
    });

    // Map Reveal
    gsap.from(".map-container", {
        scrollTrigger: {
            trigger: ".map-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1
    });

    // Theme Toggler (copy of PIXIAI logic)
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

    setupThemeToggler();
});