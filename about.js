(function(){
  // Carousel controls
  const track = document.querySelector('.carousel-track');
  const btnLeft = document.querySelector('.carousel-button.left');
  const btnRight = document.querySelector('.carousel-button.right');
  if(track){
    function getGapPx(el){
      try{ const s = getComputedStyle(el); return parseFloat(s.gap) || parseFloat(s.columnGap) || 20; } catch(e){ return 20; }
    }

    const gap = getGapPx(track);

    function scrollByCard(dir){
      const card = track.querySelector('.team-card');
      const cardW = card ? card.getBoundingClientRect().width : 260;
      track.scrollBy({ left: dir * (cardW + gap), behavior: 'smooth' });
    }

    btnLeft?.addEventListener('click', ()=> scrollByCard(-1));
    btnRight?.addEventListener('click', ()=> scrollByCard(1));

    track.addEventListener('wheel', function(e){
      // make vertical wheel scroll translate to horizontal when hovering the carousel
      if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
        e.preventDefault();
        track.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    }, { passive: false });

    track.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ scrollByCard(1); e.preventDefault(); }
      if(e.key === 'ArrowLeft'){ scrollByCard(-1); e.preventDefault(); }
    });
  }

  // Scroll reveal for benefit cards
  (function(){
    const revealCards = document.querySelectorAll('.benefit-card.reveal');
    if(!revealCards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if(entry.isIntersecting){
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 100);
        }
      });
    }, { threshold: 0.15 });

    revealCards.forEach(card => observer.observe(card));
  })();

})();
