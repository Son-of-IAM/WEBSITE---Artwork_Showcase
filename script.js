// script.js — Shared utilities + dynamic gallery/artwork renderers

const ARTWORKS_URL = 'data/artworks/index.json';

/* ---------- FETCH ---------- */
async function fetchArtworks() {
    try {
        const response = await fetch(ARTWORKS_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.artworks || [];
    } catch (err) {
        console.error('Error fetching artworks:', err);
        return [];
    }
}

/* ---------- UTILS ---------- */
function getCategoryLabel(cat) {
    const labels = {
        'paintings': 'Paintings',
        '3d-art': '3D Art',
        'gospel': 'The Gospel Proclaimed',
        'old': 'Old Artworks',
        'graffiti': 'Graffiti'
    };
    return labels[cat] || (cat ? cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Artwork');
}

/* ---------- WORK PAGE GRIDS ---------- */
function renderWorkGrids(artworks) {
    if (!artworks.length) return;

    const sections = {
        'paintings': document.getElementById('paintings-grid'),
        '3d-art': document.getElementById('3d-art-grid'),
        'gospel': document.getElementById('gospel-grid'),
        'graffiti': document.getElementById('graffiti-grid'),
        'old': document.getElementById('old-artworks-grid')
    };

    Object.values(sections).forEach(grid => { if (grid) grid.innerHTML = ''; });

    artworks.forEach(art => {
        const grid = sections[art.category];
        if (!grid) return;

        if (art.category === 'old') {
            const card = document.createElement('div');
            card.className = 'archive-card reveal';
            const imgSrc = art.previewImage || art.fullImage || '';
            card.innerHTML = `<img src="${imgSrc}" alt="${art.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='var(--bg-light)'">`;
            grid.appendChild(card);
        } else {
            const card = document.createElement('a');
            card.href = `artwork.html?id=${encodeURIComponent(art.id)}`;
            card.className = 'work-card reveal';
            const imgSrc = art.previewImage || art.fullImage || '';
            card.innerHTML = `
                <img src="${imgSrc}" alt="${art.title}" loading="lazy"
                     onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, #7205cd, #5D7FFF)'">
                <div class="overlay-info">
                    <h3>${art.title}</h3>
                    <p>${getCategoryLabel(art.category)}${art.subcategory ? ' — ' + art.subcategory : ''}</p>
                </div>
            `;
            grid.appendChild(card);
        }
    });

    initReveal();
}

/* ---------- ARTWORK DETAIL PAGE ---------- */
function renderArtworkDetail(artworks) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id || !artworks.length) {
        showArtworkError();
        return;
    }

    const art = artworks.find(a => String(a.id) === id);
    if (!art) {
        showArtworkError();
        return;
    }

    const setText = (elId, text) => {
        const el = document.getElementById(elId);
        if (el) el.textContent = text || '';
    };

    setText('artworkTitle', art.title);
    setText('artworkCategory', getCategoryLabel(art.category));
    setText('artworkYear', art.year);
    setText('artworkMedium', art.medium);
    setText('artworkDimensions', art.dimensions);
    setText('artworkDescription', art.description);

    const dims = document.getElementById('artworkDimensions');
    if (dims) dims.style.display = art.dimensions ? '' : 'none';

    const priceEl = document.getElementById('artworkPrice');
    if (priceEl) {
        if (art.price) {
            priceEl.textContent = '$' + art.price;
            priceEl.style.display = '';
        } else {
            priceEl.style.display = 'none';
        }
    }

    const mainImg = document.getElementById('mainImage');
    if (mainImg) {
        mainImg.src = art.fullImage || art.previewImage || '';
        mainImg.alt = art.title;
    }

    document.title = `${art.title || 'Artwork'} | Son_of_IAM_`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = art.description || 'View artwork by Son_of_IAM_.';

    const currentIndex = artworks.findIndex(a => String(a.id) === id);
    const prevArt = artworks[currentIndex - 1] || artworks[artworks.length - 1];
    const nextArt = artworks[currentIndex + 1] || artworks[0];

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.href = `artwork.html?id=${encodeURIComponent(prevArt.id)}`;
    if (nextBtn) nextBtn.href = `artwork.html?id=${encodeURIComponent(nextArt.id)}`;
}

function showArtworkError() {
    const title = document.getElementById('artworkTitle');
    if (title) title.textContent = 'Artwork Not Found';
    const desc = document.getElementById('artworkDescription');
    if (desc) desc.textContent = 'This artwork could not be loaded. Please return to the gallery.';
    const mainImg = document.getElementById('mainImage');
    if (mainImg) mainImg.style.display = 'none';
}

/* ---------- THEME ---------- */
const themeToggles = document.querySelectorAll('.theme-toggle');
const rootElement = document.documentElement;

function setTheme(theme) {
    if (theme === 'dark') {
        rootElement.setAttribute('data-theme', 'dark');
        themeToggles.forEach(t => t.textContent = '☀️');
        localStorage.setItem('theme', 'dark');
    } else {
        rootElement.removeAttribute('data-theme');
        themeToggles.forEach(t => t.textContent = '🌙');
        localStorage.setItem('theme', 'light');
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = rootElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(current);
        });
    });
}

/* ---------- MOBILE MENU ---------- */
function initMenu() {
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.overlay');
    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
}

function toggleMenu() {
    document.querySelector('.hamburger')?.classList.toggle('active');
    document.querySelector('.mobile-menu')?.classList.toggle('active');
    document.querySelector('.overlay')?.classList.toggle('active');
    const isOpen = document.querySelector('.mobile-menu')?.classList.contains('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function toggleDropdown(e) {
    e.preventDefault();
    const next = e.target.nextElementSibling;
    if (next) next.classList.toggle('active');
}

// Expose for inline onclick handlers
window.toggleMenu = toggleMenu;
window.toggleDropdown = toggleDropdown;
window.fetchArtworks = fetchArtworks;
window.renderWorkGrids = renderWorkGrids;
window.renderArtworkDetail = renderArtworkDetail;
window.showArtworkError = showArtworkError;

/* ---------- HEADER SCROLL ---------- */
function initScrollHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* ---------- REVEAL ANIMATIONS ---------- */
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---------- MOBILE THEME TOGGLE ---------- */
function initMobileThemeToggle() {
    const m = document.getElementById('mobile-theme-toggle');
    if (!m) return;
    function check() {
        m.style.display = window.innerWidth <= 900 ? 'flex' : 'none';
    }
    check();
    window.addEventListener('resize', check);
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMenu();
    initScrollHeader();
    initReveal();
    initMobileThemeToggle();
});
