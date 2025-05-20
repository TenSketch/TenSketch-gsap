document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.gallery_box_in').length;
  // Each card should take 3 seconds to rotate into view
  // Full rotation = cards * 3 seconds
  const duration = cards * 3;
  
  // Initialize GSAP timeline for testimonial rotation
  const tl = gsap.timeline({});
  tl.to('.gallery_box_outer', {
    duration: duration,
    rotateY: 360,
    ease: "none",
    repeat: -1
  });

  // Pause on mousedown/touchstart, resume on mouseup/touchend
  const gallery = document.querySelector('.gallery_box_outer');
  if (gallery) {
    gallery.addEventListener('mousedown', () => tl.pause());
    gallery.addEventListener('touchstart', () => tl.pause(), { passive: true });
    document.addEventListener('mouseup', () => tl.resume());
    document.addEventListener('touchend', () => tl.resume());
  }

  // Animation for section heading
  gsap.from('.testimonials-section .section-heading', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonials-section',
      start: 'top 80%',
    }
  });
});
