
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const mobile = document.getElementById('contact-mobile').value.trim();
    const type = document.getElementById('contact-type').value;
    const message = document.getElementById('contact-message').value.trim();
    if (!name || !mobile || !type || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    alert('Thank you, ' + name + '! Your message has been received.');
    contactForm.reset();
  });
}