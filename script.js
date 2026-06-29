// script.js — Core Engine for Son_of_IAM_ Portfolio
// Handles: CMS Fetching, Cinematic Carousel, Dynamic Grids, Theme, & UI

const ARTWORKS_URL = 'data/artworks/index.json';

/* ==========================================
   1. DATA FETCHING (HEADLESS CMS)
========================================== */
async function fetchArtworks() {
    try {
        const response = await fetch(ARTWORKS_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.artworks || [];
    } catch (err) {
        console.error('Error fetching artworks from CMS:', err);
        return [];
    }
}

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

/* ==========================================
   2. CINEMATIC CAROUSEL LOGIC (INDEX.HTML)
========================================== */
async function initCinematicCarousel(artworks) {
    const carouselItems = document.querySelectorAll('#auto-carousel .carousel-item img');
    if (carouselItems.length === 0 || !artworks.length) return; // Stop if not on home page

    // Select 1 piece from each category for the 5 frames
    const categories = ['paintings', '3d-art', 'gospel', 'graffiti', 'old'];
    let selectedArtworks = [];

    categories.forEach(cat => {
        const piece = artworks.find(a => a.category === cat);
        if (piece) selectedArtworks.push(piece);
    });

    // Fill remaining slots if categories are empty
    let i = 0;
    while (selectedArtworks.length < 5 && i < artworks.length) {
        if (!selectedArtworks.includes(artworks[i])) selectedArtworks.push(artworks[i]);
        i++;
    }

    // Inject images into frames
    carouselItems.forEach((img, index) => {
        if (selectedArtworks[index]) {
            img.src = selectedArtworks[index].fullImage || selectedArtworks[index].previewImage || selectedArtworks[index].image || '';
            img.alt = selectedArtworks[index].title;
        }
    });

    // Start rotation
    const items = document.querySelectorAll('#auto-carousel .carousel-item');
    let positions = ['center', 'right', 'hidden', 'hidden', 'left'];
    
    setInterval(() => {
        positions.unshift(positions.pop()); // Shift array right
        items.forEach((item, idx) => {
            item.className = 'carousel-item ' + positions[idx];
        });
    }, 3500);
}

/* ==========================================
   3. INDEX PAGE GALLERY (CATEGORY FOLDERS)
========================================== */
function renderCategoryFolders(artworks) {
    const folderGrid = document.getElementById('category-folders-grid');
    if (!folderGrid || !artworks.length) return;
    
    folderGrid.innerHTML = ''; 

    // The categories we want to build folders for
    const categories = [
        { id: 'paintings', label: 'Paintings' },
        { id: '3d-art', label: '3D Art' },
        { id: 'gospel', label: 'The Gospel Proclaimed' },
        { id: 'graffiti', label: 'Graffiti' },
        { id: 'old', label: 'Old Artworks' }
    ];

    categories.forEach(cat => {
        // Find all artworks that belong to this specific category
        const catArtworks = artworks.filter(a => a.category === cat.id);
        
        // If Promise hasn't uploaded any art for this category yet, skip it
        if (catArtworks.length === 0) return; 

        // Use the most recently uploaded artwork as the Cover Image for the folder
        const coverArt = catArtworks[0];
        const imgSrc = coverArt.fullImage || coverArt.previewImage || coverArt.image || '';

        // Build the physical folder card
        const card = document.createElement('a');
        card.href = `work.html#${cat.id}`; // Links directly to the category section on the Work page
        card.className = 'category-folder-card reveal active';
        
        card.innerHTML = `
            <div class="folder-image">
                <img src="${imgSrc}" alt="${cat.label} Collection" loading="lazy" onerror="this.style.display='none';">
                <div class="folder-overlay"></div>
            </div>
            <div class="folder-info">
                <h3>${cat.label}</h3>
                <span class="work-count">${catArtworks.length} ${catArtworks.length === 1 ? 'Work' : 'Works'} &rarr;</span>
            </div>
        `;
        folderGrid.appendChild(card);
    });
}

/* ==========================================
   4. WORK PAGE GRIDS
========================================== */
function renderWorkGrids(artworks) {
    const sections = {
        'paintings': document.getElementById('paintings-grid'),
        '3d-art': document.getElementById('3d-art-grid'),
        'gospel': document.getElementById('gospel-grid'),
        'graffiti': document.getElementById('graffiti-grid'),
        'old': document.getElementById('old-artworks-grid')
    };

    let isWorkPage = false;
    Object.values(sections).forEach(grid => { 
        if (grid) { grid.innerHTML = ''; isWorkPage = true; }
    });

    if (!isWorkPage) return;

    artworks.forEach(art => {
        const grid = sections[art.category];
        if (!grid) return;

        if (art.category === 'old') {
            const card = document.createElement('div');
            card.className = 'archive-card reveal active';
            const imgSrc = art.previewImage || art.fullImage || art.image || '';
            card.innerHTML = `<img src="${imgSrc}" alt="${art.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='var(--bg-light)'">`;
            grid.appendChild(card);
        } else {
            const card = document.createElement('a');
            card.href = `artwork.html?id=${encodeURIComponent(art.title.replace(/\s+/g, '-').toLowerCase())}`;
            card.className = 'work-card reveal active';
            const imgSrc = art.previewImage || art.fullImage || art.image || '';
            const subcat = art.subcategory ? ` — ${art.subcategory}` : '';
            card.innerHTML = `
                <img src="${imgSrc}" alt="${art.title}" loading="lazy"
                     onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, #7205cd, #5D7FFF)'">
                <div class="overlay-info">
                    <h3>${art.title}</h3>
                    <p>${getCategoryLabel(art.category)}${subcat}</p>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

/* ==========================================
   5. ARTWORK DETAIL PAGE
========================================== */
function renderArtworkDetail(artworks) {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const titleEl = document.getElementById('artworkTitle');
    
    if (!titleEl) return; // Not on the detail page

    if (!idParam || !artworks.length) {
        showArtworkError(); return;
    }

    // Find artwork by matching the URL slug to the title
    const art = artworks.find(a => a.title.replace(/\s+/g, '-').toLowerCase() === idParam);
    if (!art) {
        showArtworkError(); return;
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
        mainImg.src = art.fullImage || art.image || '';
        mainImg.alt = art.title;
    }

    const cropImg = document.getElementById('cropImage');
    const detailSection = document.querySelector('.detail-section');
    if (cropImg && detailSection) {
        if (art.cropImage) {
            cropImg.src = art.cropImage;
            detailSection.style.display = 'block';
        } else {
            detailSection.style.display = 'none'; // Hide section if no crop provided
        }
    }

    document.title = `${art.title || 'Artwork'} | Son_of_IAM_`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = art.description || 'View artwork by Son_of_IAM_.';

    // Prev / Next navigation
    const currentIndex = artworks.indexOf(art);
    const prevArt = artworks[currentIndex - 1] || artworks[artworks.length - 1];
    const nextArt = artworks[currentIndex + 1] || artworks[0];

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.href = `artwork.html?id=${encodeURIComponent(prevArt.title.replace(/\s+/g, '-').toLowerCase())}`;
    if (nextBtn) nextBtn.href = `artwork.html?id=${encodeURIComponent(nextArt.title.replace(/\s+/g, '-').toLowerCase())}`;
}

function showArtworkError() {
    const title = document.getElementById('artworkTitle');
    if (title) title.textContent = 'Artwork Not Found';
    const desc = document.getElementById('artworkDescription');
    if (desc) desc.textContent = 'This artwork could not be loaded. Please return to the gallery.';
    const mainImg = document.getElementById('mainImage');
    if (mainImg) mainImg.style.display = 'none';
    const detailSection = document.querySelector('.detail-section');
    if (detailSection) detailSection.style.display = 'none';
}

/* ==========================================
   6. UI & NAV INITIALIZATION
========================================== */
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

window.toggleMenu = toggleMenu;
window.toggleDropdown = toggleDropdown;

/* ==========================================
   7. MODAL LOGIC (JOIN INNER CIRCLE)
========================================== */
function openActionModal(tabId = 'tab-signup') {
    const modal = document.getElementById('actionModal');
    if (modal) modal.classList.add('active');
    if (tabId) switchTab(new Event('click'), tabId);
}

function closeActionModal() {
    const modal = document.getElementById('actionModal');
    if (modal) modal.classList.remove('active');
}

function switchTab(event, tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    else document.querySelector(`[onclick*="${tabId}"]`)?.classList.add('active');
    
    document.getElementById(tabId)?.classList.add('active');
}

// Expose to window so HTML inline clicks can use them
window.openActionModal = openActionModal;
window.closeActionModal = closeActionModal;
window.switchTab = switchTab;

/* ==========================================
   8. MASTER LOAD TRIGGER
========================================== */
// Fire everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    
    // Header Scroll Effect
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Fetch CMS Data and Route to Correct Renderer
    const artworks = await fetchArtworks();
    if (artworks.length > 0) {
        initCinematicCarousel(artworks); // Index page (Carousel)
        renderCategoryFolders(artworks); // Index page (Category Folders)
        renderWorkGrids(artworks);       // Work page (Full Galleries)
        renderArtworkDetail(artworks);   // Artwork Detail page
    }
    /* ==========================================
       9. PREMIUM FEATURES (Sound, Transitions, Tilt, Zen)
    ========================================== */
    function initPremiumFeatures() {
        
        // --- A. Page Transitions ---
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        document.body.appendChild(transitionOverlay);
        
        // Fade out overlay on load
        requestAnimationFrame(() => {
            setTimeout(() => transitionOverlay.classList.add('loaded'), 100);
        });

        // Intercept link clicks to fade out
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                const target = link.getAttribute('target');
                // Only intercept internal links
                if (href && !href.startsWith('#') && !href.startsWith('mailto') && target !== '_blank' && href !== '') {
                    e.preventDefault();
                    transitionOverlay.classList.remove('loaded');
                    setTimeout(() => window.location.href = href, 600); // Matches CSS duration
                }
            });
        });

        // --- B. 3D Magnetic Artwork Tilt ---
        const tiltCards = document.querySelectorAll('.artwork-card, .work-card, .shop-card, .category-folder-card');
        tiltCards.forEach(card => {
            card.classList.add('tilt-card');
            
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 12 degrees)
                const rotateX = ((y - centerY) / centerY) * -12; 
                const rotateY = ((x - centerX) / centerX) * 12;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease';
            });
        });

        // --- C. Ambient Soundscape ---
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            // Note: You must upload an mp3 file to your Audio folder!
            const bgAudio = new Audio('Audio/ambient.mp3'); 
            bgAudio.loop = true;
            bgAudio.volume = 0.2; // Keep it soft and cinematic

            let isPlaying = false;
            const audioPref = localStorage.getItem('audioPref');

            const toggleAudio = () => {
                if (isPlaying) {
                    bgAudio.pause();
                    audioToggle.innerHTML = '🔈';
                    localStorage.setItem('audioPref', 'muted');
                } else {
                    bgAudio.play().catch(err => console.log("Audio autoplay blocked by browser."));
                    audioToggle.innerHTML = '🔊';
                    localStorage.setItem('audioPref', 'playing');
                }
                isPlaying = !isPlaying;
            };

            audioToggle.addEventListener('click', toggleAudio);

            // Auto-play attempt on first click anywhere if they previously had it playing
            if (audioPref === 'playing') {
                const firstInteraction = () => {
                    if(!isPlaying) toggleAudio();
                    document.removeEventListener('click', firstInteraction);
                };
                document.addEventListener('click', firstInteraction);
            }
        }

        // --- D. Zen Focus Mode ---
        const zenBtn = document.getElementById('zen-toggle');
        if (zenBtn) {
            zenBtn.addEventListener('click', () => {
                document.body.classList.toggle('zen-mode');
                if (document.body.classList.contains('zen-mode')) {
                    zenBtn.innerHTML = '✕ Exit Focus Mode';
                } else {
                    zenBtn.innerHTML = '⛶ Focus Mode';
                }
            });
        }
    }

    // Initialize all premium features after the DOM and CMS grids have finished loading
    setTimeout(() => {
        initPremiumFeatures();
    }, 200);
});
