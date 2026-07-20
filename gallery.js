// ---------- Gallery data ----------
// Use `image: 'images/your-photo.jpg'` for a real photo,
// or `gradient: 'linear-gradient(...)'` as a placeholder when no photo yet.
const GALLERY_ITEMS = [
  { cat: 'room',     tag: 'Treatment Room', title: 'Private treatment room', image: 'images/TOE.jpg' },
  { cat: 'therapy',  tag: 'In Session',     title: 'Pressure point therapy', image: 'images/Presure Point.jpeg' },
  { cat: 'products', tag: 'Products',       title: 'House blended oils', image: 'images/HouseBond.jpeg' },
  { cat: 'therapy',  tag: 'In Session',     title: 'Consultation', image: 'images/Waitting Area.jpeg' },
  { cat: 'therapy',  tag: 'In Session',     title: 'Foot ritual station', image: 'images/Foot Ritual.jpeg' },
  { cat: 'products', tag: 'Products',       title: 'Product', gradient: 'linear-gradient(135deg, #3A2A1D, #C9A25C)' },
  { cat: 'room',     tag: 'Treatment Room', title: 'Waiting area', image: '' },

];

(function initGallery(){
  const track = document.getElementById('carTrack');
  const dotsWrap = document.getElementById('carDots');
  const prevBtn = document.querySelector('.car-prev');
  const nextBtn = document.querySelector('.car-next');
  const catBtns = document.querySelectorAll('.cat-btn');
  const viewport = document.querySelector('.car-viewport');
  if(!track) return;

  let currentCat = 'all';
  let index = 0;
  let timer = null;
  const AUTO_MS = 3500;
  const GAP = 20;

  function itemsForCat(cat){
    return cat === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === cat);
  }

  function slideWidth(){
    const first = track.querySelector('.gallery-slide');
    return first ? first.getBoundingClientRect().width + GAP : 320;
  }

  function visibleCount(){
    const vw = viewport.getBoundingClientRect().width;
    return Math.max(1, Math.floor(vw / slideWidth()));
  }

  function maxIndex(items){
    return Math.max(0, items.length - visibleCount());
  }

  // Builds the inline background style for either a real photo or a gradient placeholder
  function slideBg(item){
    if (item.image) {
      return `background-image:url('${item.image}'); background-size:cover; background-position:center;`;
    }
    return `background:${item.gradient};`;
  }

  function render(cat){
    currentCat = cat;
    index = 0;
    const items = itemsForCat(cat);
    track.innerHTML = items.map(item => `
      <div class="gallery-slide" style="${slideBg(item)}">
        <div class="slide-caption">
          <span class="cap-tag">${item.tag}</span>
          <span class="cap-title">${item.title}</span>
        </div>
      </div>
    `).join('');
    buildDots(items);
    goTo(0);
  }

  function buildDots(items){
    const count = maxIndex(items) + 1;
    dotsWrap.innerHTML = Array.from({length: count}).map((_, i) =>
      `<button class="car-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Go to slide ${i+1}"></button>`
    ).join('');
    dotsWrap.querySelectorAll('.car-dot').forEach(dot => {
      dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.i, 10)); resetTimer(); });
    });
  }

  function goTo(i){
    const items = itemsForCat(currentCat);
    const mi = maxIndex(items);
    index = ((i % (mi + 1)) + (mi + 1)) % (mi + 1);
    track.style.transform = `translateX(-${index * slideWidth()}px)`;
    dotsWrap.querySelectorAll('.car-dot').forEach((d, di) => d.classList.toggle('active', di === index));
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(next, AUTO_MS);
  }

  nextBtn.addEventListener('click', () => { next(); resetTimer(); });
  prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.cat);
      resetTimer();
    });
  });

  viewport.addEventListener('mouseenter', () => clearInterval(timer));
  viewport.addEventListener('mouseleave', resetTimer);

  window.addEventListener('resize', () => goTo(index));

  render('all');
  resetTimer();
})();