document.addEventListener('DOMContentLoaded', () => {
  // === THEME TOGGLE ===
  const themeBtn = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // === SCROLL ANIMATIONS ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // === FAQ ACCORDION ===
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // === GALLERY & MODAL ===
  const artworks = [
    { title: "Redemption's Light", cat: "paintings", img: "assets/art1.jpg", crop: "assets/art1-crop.jpg" },
    { title: "Digital Sanctuary", cat: "3d-art", img: "assets/art2.jpg", crop: "assets/art2-crop.jpg" },
    { title: "The Proclamation", cat: "gospel", img: "assets/art3.jpg", crop: "assets/art3-crop.jpg" },
    { title: "Faith & Form", cat: "paintings", img: "assets/art4.jpg", crop: "assets/art4-crop.jpg" },
    { title: "Early Studies", cat: "old", img: "assets/art5.jpg", crop: "assets/art5-crop.jpg" }
  ];

  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('artwork-modal');
  let currentIndex = 0;

  function renderGallery(filter = 'all') {
    gallery.innerHTML = '';
    const filtered = filter === 'all' ? artworks : artworks.filter(a => a.cat === filter);
    filtered.forEach((art, i) => {
      const card = document.createElement('div');
      card.className = 'art-card fade-up visible';
      card.innerHTML = `
        <img src="${art.img}" alt="${art.title}" loading="lazy">
        <div class="art-overlay">
          <div class="art-title">${art.title}</div>
          <div class="art-cat">${art.cat.replace('-', ' ').toUpperCase()}</div>
        </div>`;
      card.onclick = () => openModal(i, filtered);
      gallery.appendChild(card);
    });
  }

  function openModal(index, list) {
    currentIndex = index;
    modal.dataset.list = JSON.stringify(list);
    updateModal(list);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function updateModal(list) {
    const item = list[currentIndex];
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-main').src = item.img;
    document.getElementById('modal-crop').src = item.crop;
  }

  document.getElementById('next-art').onclick = () => {
    const list = JSON.parse(modal.dataset.list);
    currentIndex = (currentIndex + 1) % list.length;
    updateModal(list);
  };

  document.querySelector('.modal-close').onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    if (e.key === 'ArrowRight' && modal.classList.contains('active')) document.getElementById('next-art').click();
  });

  document.querySelectorAll('.filters button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    };
  });

  if (gallery) renderGallery();
});
