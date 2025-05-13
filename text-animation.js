// Character-by-character text animation with hover effects

document.addEventListener('DOMContentLoaded', function() {
  // Select heading in the first section
  const heading = document.querySelector('.first h2');
  
  if (heading) {
    // Get the text content
    const text = heading.innerText || heading.textContent;
    
    // Clear the original content
    heading.innerHTML = '';
    
    // Split the text into individual characters and wrap each in a span
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.className = 'char';
      
      // Preserve spaces
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      
      // Add data attribute for custom animations
      span.dataset.charIndex = i;
      
      // Add event listeners for interactive effects
      span.addEventListener('mouseenter', function() {
        // Add any additional hover effects if needed
      });
      
      heading.appendChild(span);
    }
    
    // Add a small delay before adding the active class to ensure DOM is ready
    setTimeout(function() {
      document.querySelector('.first').classList.add('active');
    }, 100);
  }
  
  // Optional: If you want to animate headings in other sections when they come into view
  const headings = document.querySelectorAll('section:not(.first) h2');
  
  headings.forEach(heading => {
    const text = heading.innerText || heading.textContent;
    heading.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.className = 'char';
      
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      
      heading.appendChild(span);
    }
  });
  
  // Add neon glow effect to section 2 cards
  function addNeonGlowToSection2() {
    const pillars = document.querySelectorAll('.second .pillar-item');
    const stats = document.querySelectorAll('.second .stat-item');
    
    // Colors for neon effect
    const neonColors = [
      'rgba(230, 201, 154, 0.7)', // accent-sandal
      'rgba(212, 175, 55, 0.7)',  // accent-gold
      'rgba(255, 214, 108, 0.7)'  // light gold
    ];
    
    // Add glow to pillar items
    pillars.forEach((pillar, index) => {
      const color = neonColors[index % neonColors.length];
      
      // Add initial glow
      pillar.style.boxShadow = `0 0 10px ${color}, 0 0 20px rgba(255, 255, 255, 0.1)`;
      pillar.style.transition = 'all 0.5s ease-in-out';
      
      // Add pulsating animation
      const keyframeAnimation = `@keyframes neonPulse${index} {
        0% { box-shadow: 0 0 10px ${color}, 0 0 20px rgba(255, 255, 255, 0.1); }
        50% { box-shadow: 0 0 15px ${color}, 0 0 30px ${color.replace('0.7', '0.4')}, 0 0 40px ${color.replace('0.7', '0.2')}; }
        100% { box-shadow: 0 0 10px ${color}, 0 0 20px rgba(255, 255, 255, 0.1); }
      }`;
      
      // Add animation to element
      document.styleSheets[0].insertRule(keyframeAnimation, 0);
      pillar.style.animation = `neonPulse${index} 2s infinite ease-in-out`;
      
      // Add hover effect
      pillar.addEventListener('mouseenter', () => {
        pillar.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}, 0 0 45px ${color.replace('0.7', '0.3')}`;
        pillar.style.transform = 'translateY(-5px)';
      });
      
      pillar.addEventListener('mouseleave', () => {
        pillar.style.transform = 'translateY(0)';
      });
    });
    
    // Add glow to stat items
    stats.forEach((stat, index) => {
      const color = neonColors[index % neonColors.length];
      
      // Add subtle glow
      stat.style.boxShadow = `0 0 8px ${color}`;
      stat.style.transition = 'all 0.5s ease';
      
      // Add hover effect
      stat.addEventListener('mouseenter', () => {
        stat.style.boxShadow = `0 0 15px ${color}, 0 0 25px ${color.replace('0.7', '0.4')}`;
        stat.style.transform = 'scale(1.05)';
      });
      
      stat.addEventListener('mouseleave', () => {
        stat.style.boxShadow = `0 0 8px ${color}`;
        stat.style.transform = 'scale(1)';
      });
      
      // Make number counter glow
      const statNumber = stat.querySelector('.stat-number');
      if (statNumber) {
        statNumber.style.textShadow = `0 0 10px ${color}`;
      }
    });
  }
  
  // Mobile detection and responsive positioning
  function adjustForMobile() {
    const isMobile = window.innerWidth <= 768;
    const firstSection = document.querySelector('.first .bg');
    const heading = document.querySelector('.first h2');
    const paragraphText = document.querySelector('.first .section-text');
    const button = document.querySelector('.first .btn-cta');
    
    if (isMobile) {
      // Lower text position on mobile devices
      if (firstSection) {
        firstSection.style.paddingTop = '25vh'; // Push content down
        
        // Adjust heading
        if (heading) {
          heading.style.marginTop = '2rem';
          heading.style.fontSize = 'clamp(1.5rem, 6vw, 2.2rem)';
          heading.style.lineHeight = '1.3';
        }
        
        // Adjust paragraph
        if (paragraphText) {
          paragraphText.style.fontSize = '1rem';
          paragraphText.style.maxWidth = '90%';
          paragraphText.style.marginTop = '1.5rem';
        }
        
        // Adjust button
        if (button) {
          button.style.marginTop = '1.5rem';
        }
      }
    } else {
      // Reset styles for desktop
      if (firstSection) firstSection.style.paddingTop = '10vh';
      if (heading) {
        heading.style.marginTop = '';
        heading.style.fontSize = '';
        heading.style.lineHeight = '';
      }
      if (paragraphText) {
        paragraphText.style.fontSize = '';
        paragraphText.style.maxWidth = '';
        paragraphText.style.marginTop = '';
      }
      if (button) button.style.marginTop = '';
    }
    
    // Further adjustments for very small screens
    if (window.innerWidth <= 480) {
      if (firstSection) firstSection.style.paddingTop = '30vh'; // Push even lower on small phones
      if (heading) heading.style.fontSize = 'clamp(1.2rem, 5vw, 1.8rem)';
    }
  }
  
  // Call on load and resize
  window.addEventListener('load', adjustForMobile);
  window.addEventListener('resize', adjustForMobile);
  
  // Add randomized animation effects to characters
  function addRandomizedEffects() {
    const chars = document.querySelectorAll('.first h2 .char');
    const effects = ['bounce', 'pulse', 'shake', 'wobble', 'swing', 'tada'];
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    chars.forEach(char => {
      // Use touchstart for mobile devices, mouseenter for desktop
      const eventType = isMobile ? 'touchstart' : 'mouseenter';
      
      // Adjust animation intensity for mobile
      if (isMobile) {
        char.style.padding = '0.2em'; // Add spacing for better touch targets
      }
      
      // Assign random animation effect on hover/touch
      char.addEventListener(eventType, function(e) {
        // Prevent scrolling on touch devices
        if (isMobile) e.preventDefault();
        
        // Get random effect from array
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        // Remove any existing animation classes
        effects.forEach(effect => char.classList.remove(effect));
        
        // Add new animation class
        char.classList.add(randomEffect);
        
        // Remove animation class after animation completes
        setTimeout(() => {
          char.classList.remove(randomEffect);
        }, 1000);
      });
      
      // Add 3D rotation effect
      char.addEventListener('mousemove', function(e) {
        // Calculate rotation based on mouse position
        const x = (e.offsetY - char.offsetHeight / 2) / 5;
        const y = (char.offsetWidth / 2 - e.offsetX) / 5;
        
        // Apply 3D rotation
        char.style.transform = `perspective(100px) rotateX(${x}deg) rotateY(${y}deg) scale(1.2)`;
        char.style.zIndex = '2';
      });
      
      // Reset on mouse leave
      char.addEventListener('mouseleave', function() {
        char.style.transform = '';
        char.style.zIndex = '';
      });
    });
  }
  
  // Initialize wave animation on the first heading
  function initWaveAnimation() {
    const chars = document.querySelectorAll('.first h2 .char');
    
    // Create wave animation after initial load
    setTimeout(() => {
      chars.forEach((char, index) => {
        setTimeout(() => {
          char.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0)' }
          ], {
            duration: 500,
            easing: 'ease-in-out'
          });
        }, index * 50); // Stagger effect
      });
    }, 2000); // Start wave after 2 seconds
  }
  
  // Connect characters with trailing effect
  function createCharacterTrail() {
    const container = document.querySelector('.first h2');
    if (!container) return;
    
    const trailCanvas = document.createElement('canvas');
    trailCanvas.className = 'character-trail';
    trailCanvas.style.position = 'absolute';
    trailCanvas.style.top = '0';
    trailCanvas.style.left = '0';
    trailCanvas.style.pointerEvents = 'none';
    trailCanvas.style.zIndex = '1';
    container.appendChild(trailCanvas);
    
    const ctx = trailCanvas.getContext('2d');
    let mouseX = 0, mouseY = 0;
    let lastX = 0, lastY = 0;
    
    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      trailCanvas.width = rect.width;
      trailCanvas.height = rect.height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    container.addEventListener('mousemove', function(e) {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Draw trail
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)'; // Match accent-gold with opacity
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Fade effect
      setTimeout(() => {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      }, 500);
      
      lastX = mouseX;
      lastY = mouseY;
    });
  }
  
  // Initialize all animations
  setTimeout(() => {
    addRandomizedEffects();
    initWaveAnimation();
    createCharacterTrail();
    addNeonGlowToSection2(); // Add this line to initialize the neon glow effect
  }, 1500); // Delay to allow initial animations to complete
  
  // Fix for mobile device height calculation
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Set the initial value
  setVH();
  
  // Update on resize
  window.addEventListener('resize', setVH);
});

// Add CSS for the new animations
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-20px);}
    60% {transform: translateY(-10px);}
  }
  
  @keyframes pulse {
    0% {transform: scale(1);}
    50% {transform: scale(1.2);}
    100% {transform: scale(1);}
  }
  
  @keyframes shake {
    0%, 100% {transform: translateX(0);}
    10%, 30%, 50%, 70%, 90% {transform: translateX(-5px);}
    20%, 40%, 60%, 80% {transform: translateX(5px);}
  }
  
  @keyframes wobble {
    0% {transform: translateX(0%);}
    15% {transform: translateX(-15%) rotate(-5deg);}
    30% {transform: translateX(10%) rotate(3deg);}
    45% {transform: translateX(-10%) rotate(-3deg);}
    60% {transform: translateX(5%) rotate(2deg);}
    75% {transform: translateX(-5%) rotate(-1deg);}
    100% {transform: translateX(0%);}
  }
  
  @keyframes swing {
    20% {transform: rotate(15deg);}
    40% {transform: rotate(-10deg);}
    60% {transform: rotate(5deg);}
    80% {transform: rotate(-5deg);}
    100% {transform: rotate(0deg);}
  }
  
  @keyframes tada {
    0% {transform: scale(1);}
    10%, 20% {transform: scale(0.9) rotate(-3deg);}
    30%, 50%, 70%, 90% {transform: scale(1.1) rotate(3deg);}
    40%, 60%, 80% {transform: scale(1.1) rotate(-3deg);}
    100% {transform: scale(1) rotate(0);}
  }
  
  .bounce {animation: bounce 1s;}
  .pulse {animation: pulse 1s;}
  .shake {animation: shake 1s;}
  .wobble {animation: wobble 1s;}
  .swing {animation: swing 1s;}
  .tada {animation: tada 1s;}
`;

document.head.appendChild(style);
