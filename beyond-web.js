document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // === SMOOTH REVEAL FOR HERO ===
  const heroTimeline = gsap.timeline();
  
  heroTimeline
    .from(".hero-content > *", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    })
    .from(".glow-sphere", {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    }, "-=1")
    .from(".float-card", {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=1");


  // === SERVICE 1: SEO - THE RANK ELEVATOR ===
  let seoTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".seo-section",
      start: "top 60%", // Trigger a bit earlier (visually higher)
      toggleActions: "play none none reverse", // Play fully, reverse only when going back up past start
    }
  });

  // 1. Search Interface Pops In
  seoTl.from(".search-frame", {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.5)"
  });

  // 2. Mock Typing in Search Bar (Width expansion of text line)
  seoTl.from(".s-text", {
    width: "0%",
    duration: 0.8,
    ease: "steps(12)"
  }, "-=0.2");

  // 3. Results Fade In
  seoTl.from(".result-card", {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: "power2.out"
  });

  // 4. "Ranking Event" - Hero Card (r3) moves to top
  // Current order in DOM: r1, r2, r3(hero), r4
  // We want r3 to go to pos of r1. r1 goes to r2. r2 goes to r3.
  const rHeight = 85; // 70px height + 15px gap
  
  seoTl.to(".hero-card", {
    y: -rHeight * 2, // Move up 2 slots
    boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
    borderColor: "#D4AF37",
    duration: 1.2,
    ease: "power2.inOut",
    zIndex: 10
  });

  // Move others down to make space
  seoTl.to(".r1", {
    y: rHeight,
    duration: 1.2,
    ease: "power2.inOut"
  }, "<");

  seoTl.to(".r2", {
    y: rHeight,
    duration: 1.2,
    ease: "power2.inOut"
  }, "<");

  // 5. Rank Badge Pop
  seoTl.to(".rank-badge", {
    opacity: 1,
    scale: 1.2,
    duration: 0.4,
    ease: "back.out(2)"
  }, "-=0.3");

  seoTl.to(".rank-badge", {
    scale: 1,
    duration: 0.2
  });


  // === SERVICE 2: SMM - MAGNETIC FIELD ===
  // === SERVICE 2: SMM - THE VIRAL STREAM ===
  let smmTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".smm-section",
      start: "top 70%",
      toggleActions: "play reverse play reverse",
    }
  });

  // 1. Phone Frame Floats In
  smmTl.from(".phone-frame", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // 2. Infinite Feed Scroll Animation
  // We want the feed to scroll up continuously
  gsap.to(".feed-scroller", {
    y: "-50%", // Scroll halfway (since we duplicated content)
    duration: 10,
    ease: "none",
    repeat: -1
  });

  // 3. Floating Interactions Pop Out
  // They float out from the center (phone) to their positions
  smmTl.to(".float-like", {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    stagger: 0.2,
    ease: "back.out(1.5)"
  }, "-=0.5");

  smmTl.to(".float-stat", {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.3,
    ease: "power2.out"
  }, "-=0.5");

  // Continuous Float for "Likes"
  gsap.to(".float-like", {
    y: -15,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    stagger: {
      each: 0.5,
      from: "random"
    }
  });
  
  // Continuous Float for Stats
  gsap.to(".float-stat", {
      y: -10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.5
  });


  // === SERVICE 3: MEDIA - SHUTTER ===
  let mediaTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".media-section",
      start: "top 70%",
      toggleActions: "play reverse play reverse",
    }
  });

  mediaTl.from(".camera-shutter", {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });

  // Open Shutter (Rotate blades)
  mediaTl.to(".blade", {
    rotation: "+=30", // Rotates them to 'open' position visually if designed correctly, or just spin them
    scale: 0.8,
    opacity: 0.5, // Fades them out to simulate opening to light
    duration: 1.5,
    ease: "power3.inOut"
  }, "-=0.5");

  // Reveal Lens
  mediaTl.from(".center-lens", {
    scale: 0,
    duration: 1,
    ease: "elastic.out(1, 0.8)"
  }, "-=1.2");

  // Lens Glare move
  gsap.to(".lens-glare", {
    x: 50,
    y: 50,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  // Rec Frame Slide in
  mediaTl.from(".rec-frame", {
    scale: 1.1,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out"
  }, "-=0.5");

  // === THEME TOGGLE (With Persistence) ===
  const themeBtn = document.getElementById("theme-toggle");
  const body = document.body;
  const icon = themeBtn.querySelector("i");
  
  // 1. Check LocalStorage on Load
  const savedTheme = localStorage.getItem("hero-theme");
  if (savedTheme === "light") {
    body.classList.add("light-theme");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }

  themeBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    
    // Toggle Icon & Save Preference
    if (body.classList.contains("light-theme")) {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      localStorage.setItem("hero-theme", "light");
    } else {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      localStorage.setItem("hero-theme", "dark");
    }
  });
  // === FORM HANDLING ===
  const form = document.getElementById("beyond-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        email: formData.get("email"),
        service: formData.get("service"),
        note: formData.get("note")
      };
      
      console.log("Form Submitted:", data);
      
      // Visual Feedback
      const btn = form.querySelector("button[type='submit']");
      const originalText = btn.textContent;
      
      btn.textContent = "Request Sent!";
      btn.style.backgroundColor = "#4CAF50"; // Green success
      btn.style.color = "#fff";
      
      form.reset();
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = ""; // Revert to CSS
        btn.style.color = "";
      }, 3000);
    });
  }
});
