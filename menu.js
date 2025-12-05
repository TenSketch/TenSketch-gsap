// Hamburger menu open/close logic for TenSketch

document.addEventListener('DOMContentLoaded', function () {
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
  document.addEventListener('click', function (e) {
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
});
