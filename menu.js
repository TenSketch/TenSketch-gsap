// Hamburger menu open/close logic for TenSketch

document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('nav.menu');
  const logoMenu = document.getElementById('logo-menu');
  const closeBtn = document.querySelector('.menu-close');

  if (logoMenu && menu) {
    logoMenu.addEventListener('click', function () {
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && menu) {
    closeBtn.addEventListener('click', function () {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Optional: Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !logoMenu.contains(e.target)) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
