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
   — Fixed "Exhibition" set, independent of category data
========================================== */
const EXHIBITION_IMAGES = [
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696781/1_Corinthians_2V9_k4jh2q.webp', title: '1 Corinthians 2:9' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696769/Crucifixion._duliqw.webp', title: 'Crucifixion' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696771/Daughter_Of_Zion._z6znix.webp', title: 'Daughter Of Zion' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696781/Genesis_3_gn8zyi.webp', title: 'Genesis 3' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696736/1._light_among_darkness_hmvvza.webp', title: 'Light Among Darkness' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696775/Light_bearer_vfilze.webp', title: 'Light Bearer' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696781/Messiah_s_Love_lrtkol.webp', title: "Messiah's Love" },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783696775/The_Lost_Sheep_rdoxtq.webp', title: 'The Lost Sheep' }
];

async function initCinematicCarousel(artworks) {
    const carouselItems = document.querySelectorAll('#auto-carousel .carousel-item img');
    if (carouselItems.length === 0) return; // Not on the home page

    let nextIndex = carouselItems.length; // Points to the next unused exhibition image

    // Fill the initial 5 frames with the first 5 exhibition pieces
    carouselItems.forEach((img, index) => {
        img.src = EXHIBITION_IMAGES[index].url;
        img.alt = EXHIBITION_IMAGES[index].title;
    });

    // Rotate positions AND cycle in the next exhibition image each tick
    const items = document.querySelectorAll('#auto-carousel .carousel-item');
    let positions = ['center', 'right', 'hidden', 'hidden', 'left'];

    setInterval(() => {
        positions.unshift(positions.pop());
        items.forEach((item, idx) => {
            item.className = 'carousel-item ' + positions[idx];
        });

        // Whichever frame just went fully hidden gets the next exhibition image
        const hiddenIdx = positions.indexOf('hidden');
        if (hiddenIdx !== -1) {
            const img = carouselItems[hiddenIdx];
            const nextImg = EXHIBITION_IMAGES[nextIndex % EXHIBITION_IMAGES.length];
            img.src = nextImg.url;
            img.alt = nextImg.title;
            nextIndex++;
        }
    }, 3500);
}

/* ==========================================
   3. INDEX PAGE WORK PREVIEW (CATEGORY FOLDERS)
========================================== */
function renderCategoryFolders(artworks) {
    const folderGrid = document.getElementById('category-folders-grid');
    if (!folderGrid || !artworks.length) return;
    
    folderGrid.innerHTML = ''; 

    // The 6 exact main folders mapped in the requested order
    const categories = [
        { id: 'paintings', label: 'Paintings' },
        { id: 'gospel', label: 'The Gospel Proclaimed' },
        { id: 'sketches', label: 'Sketches' },
        { id: '3d-art', label: '3D Art' },
        { id: 'graffiti', label: 'Graffiti' },
        { id: 'old', label: 'Old Artworks' }
    ];

    categories.forEach(cat => {
        let catArtworks = [];
        
        // Logic to automatically separate Sketches from Old Works
        if (cat.id === 'sketches') {
            catArtworks = artworks.filter(a => a.category === 'old' && a.title.toLowerCase().includes('sketch'));
        } else if (cat.id === 'old') {
            catArtworks = artworks.filter(a => a.category === 'old' && !a.title.toLowerCase().includes('sketch'));
        } else {
            catArtworks = artworks.filter(a => a.category === cat.id);
        }
        
        if (catArtworks.length === 0) return; 

        // Uses the first image as the cover of the folder
        const coverArt = catArtworks[0];
        const imgSrc = coverArt.fullImage || coverArt.previewImage || coverArt.image || '';

        const card = document.createElement('a');
        card.href = `work.html#${cat.id}`; 
        card.className = 'category-folder-card reveal active tilt-card';
        
        card.innerHTML = `
            <div class="folder-image">
                <img src="${imgSrc}" alt="${cat.label} Collection" loading="lazy" style="object-fit: cover;" onerror="this.style.display='none';">
                <div class="folder-overlay"></div>
            </div>
            <div class="folder-info">
                <h3 style="color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">${cat.label}</h3>
                <span class="work-count">${catArtworks.length} ${catArtworks.length === 1 ? 'Work' : 'Works'} &rarr;</span>
            </div>
        `;
        folderGrid.appendChild(card);
    });
}

/* ==========================================
   4. WORK PAGE GRIDS (HORIZONTAL FILTER ENGINE)
========================================== */
function renderWorkGrids(artworks) {
    const sections = {
        'paintings': document.getElementById('paintings-grid'),
        '3d-art': document.getElementById('3d-art-grid'),
        'gospel': document.getElementById('gospel-grid'),
        'graffiti': document.getElementById('graffiti-grid'),
        'sketches': document.getElementById('sketches-grid'), 
        'old': document.getElementById('old-artworks-grid')
    };

    let isWorkPage = false;
    Object.values(sections).forEach(grid => { 
        if (grid) { grid.innerHTML = ''; isWorkPage = true; }
    });

    if (!isWorkPage) return;

    // Helper: Create the clickable horizontal filter bar
    const createFilterBar = (container, groups, gridContainer) => {
        const filterBar = document.createElement('div');
        filterBar.className = 'filter-bar reveal active';
        
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'All';
        allBtn.onclick = () => filterGrid(gridContainer, filterBar, 'all', allBtn);
        filterBar.appendChild(allBtn);

        groups.forEach(group => {
            if(!group || group === 'Uncategorized') return;
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = group;
            btn.onclick = () => filterGrid(gridContainer, filterBar, group, btn);
            filterBar.appendChild(btn);
        });

        container.parentNode.insertBefore(filterBar, container);
    };

    // Helper: Handle the filtering logic
    const filterGrid = (grid, filterBar, category, activeBtn) => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

        const items = grid.querySelectorAll('.filtered-item');
        items.forEach(item => {
            if (category === 'all' || item.dataset.group === category) {
                item.classList.remove('hidden');
                setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => { item.classList.add('hidden'); }, 400);
            }
        });
    };

    // Helper: Render the cards into the grid
    const renderCards = (container, items, isOld, isFilterable = false) => {
        const grid = document.createElement('div');
        grid.className = 'subcategory-grid';
        
        items.forEach(art => {
            const mediaSrc = art.previewImage || art.fullImage || art.image || '';
            const isVideo = mediaSrc.toLowerCase().endsWith('.mp4') || mediaSrc.toLowerCase().endsWith('.mov');
            
            const mediaElement = isVideo 
                ? `<video src="${mediaSrc}" autoplay loop muted playsinline loading="lazy" style="width:100%; height:100%; object-fit:contain;"></video>`
                : `<img src="${mediaSrc}" alt="${art.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='var(--bg-light)'">`;

            const card = document.createElement(isOld ? 'div' : 'a');
            card.className = `${isOld ? 'archive-card' : 'work-card'} reveal active tilt-card filtered-item`;
            
            if (isFilterable) {
                card.dataset.group = art.category === 'paintings' ? (art.year || 'Unknown') : (art.subcategory || 'Uncategorized');
            }

            if (!isOld) {
                card.href = `artwork.html?id=${encodeURIComponent(art.title.replace(/\s+/g, '-').toLowerCase())}`;
                const subcat = art.subcategory ? ` — ${art.subcategory}` : (art.year ? ` — ${art.year}` : '');
                card.innerHTML = `
                    ${mediaElement}
                    <div class="overlay-info">
                        <h3>${art.title}</h3>
                        <p>${getCategoryLabel(art.category)}${subcat}</p>
                    </div>
                `;
            } else {
                card.innerHTML = mediaElement;
            }
            grid.appendChild(card);
        });
        container.appendChild(grid);
    };

    // 1. PAINTINGS
    if (sections['paintings']) {
        const paintings = artworks.filter(a => a.category === 'paintings');
        const years = [...new Set(paintings.map(a => a.year || 'Unknown'))].sort((a, b) => b.localeCompare(a));
        createFilterBar(sections['paintings'], years, sections['paintings']);
        renderCards(sections['paintings'], paintings, false, true);
    }

    // 2. 3D ART
    if (sections['3d-art']) {
        const threeDArt = artworks.filter(a => a.category === '3d-art');
        const desiredOrder = [
       "Featured 3D Renders", 
       "Stylized portrait characters", 
       "Astronaut series", 
       "Human series", 
       "Abstract Figures", 
       "Abstract still renders", 
       "Abstract animation"
   ];
   
   const availableSubs = [...new Set(threeDArt.map(a => a.subcategory || 'Uncategorized'))].filter(sub => sub !== 'Uncategorized');
   availableSubs.sort((a, b) => {
       let indexA = desiredOrder.findIndex(o => a.toLowerCase().includes(o.toLowerCase()));
       let indexB = desiredOrder.findIndex(o => b.toLowerCase().includes(o.toLowerCase()));
       if (indexA === -1) indexA = 999;
       if (indexB === -1) indexB = 999;
       return indexA - indexB;
   });

        createFilterBar(sections['3d-art'], availableSubs, sections['3d-art']);
        renderCards(sections['3d-art'], threeDArt, false, true);
    }

    // 3. SKETCHES vs OLD WORKS
    const oldItems = artworks.filter(a => a.category === 'old');
    const sketches = oldItems.filter(a => a.title.toLowerCase().includes('sketch'));
    const purelyOld = oldItems.filter(a => !a.title.toLowerCase().includes('sketch'));

    if (sections['sketches']) renderCards(sections['sketches'], sketches, true);
    if (sections['old']) renderCards(sections['old'], sections['sketches'] ? purelyOld : oldItems, true);

    // 4. GOSPEL & GRAFFITI
    if (sections['gospel']) renderCards(sections['gospel'], artworks.filter(a => a.category === 'gospel'), false);
    if (sections['graffiti']) renderCards(sections['graffiti'], artworks.filter(a => a.category === 'graffiti'), false);
}

/* ==========================================
   5. ARTWORK DETAIL PAGE
========================================== */
function renderArtworkDetail(artworks) {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const titleEl = document.getElementById('artworkTitle');
    
    if (!titleEl) return; 

    if (!idParam || !artworks.length) {
        showArtworkError(); return;
    }

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
            detailSection.style.display = 'none'; 
        }
    }

    document.title = `${art.title || 'Artwork'} | Son_of_IAM_`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = art.description || 'View artwork by Son_of_IAM_.';

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

window.openActionModal = openActionModal;
window.closeActionModal = closeActionModal;
window.switchTab = switchTab;

/* ==========================================
   8. MASTER LOAD TRIGGER
========================================== */
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const artworks = await fetchArtworks();
    if (artworks.length > 0) {
        initCinematicCarousel(artworks); 
        renderCategoryFolders(artworks); 
        renderWorkGrids(artworks);       
        renderArtworkDetail(artworks);   
    }

    /* ==========================================
       9. PREMIUM FEATURES (Transitions, Tilt, Zen)
    ========================================== */
    function initPremiumFeatures() {
        
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        document.body.appendChild(transitionOverlay);
        
        requestAnimationFrame(() => {
            setTimeout(() => transitionOverlay.classList.add('loaded'), 100);
        });

        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                const target = link.getAttribute('target');
                if (href && !href.startsWith('#') && !href.startsWith('mailto') && target !== '_blank' && href !== '') {
                    e.preventDefault();
                    transitionOverlay.classList.remove('loaded');
                    setTimeout(() => window.location.href = href, 600); 
                }
            });
        });

        const tiltCards = document.querySelectorAll('.artwork-card, .work-card, .shop-card, .category-folder-card');
        tiltCards.forEach(card => {
            card.classList.add('tilt-card');
            
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
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

        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            const bgAudio = new Audio('Audio/ambient.mp3'); 
            bgAudio.loop = true;
            bgAudio.volume = 0.2; 

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

            if (audioPref === 'playing') {
                const firstInteraction = () => {
                    if(!isPlaying) toggleAudio();
                    document.removeEventListener('click', firstInteraction);
                };
                document.addEventListener('click', firstInteraction);
            }
        }

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

    setTimeout(() => {
        initPremiumFeatures();
    }, 200);

    initCategorySlider(); 
    initParticles();
});

/* ==========================================
   CATEGORY SLIDER — SCROLL SPY (WORK PAGE)
========================================== */
function initCategorySlider() {
    const slider = document.getElementById('categorySlider');
    if (!slider) return;

    const dots = slider.querySelectorAll('.slider-dot');
    const sections = Array.from(dots).map(dot => document.querySelector(dot.getAttribute('href')));

    window.addEventListener('scroll', () => {
        let currentIndex = 0;
        sections.forEach((section, i) => {
            if (section && window.scrollY >= section.offsetTop - window.innerHeight / 2) {
                currentIndex = i;
            }
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    });
}

/* ==========================================
   LIVE BACKGROUND ENGINE (ETHEREAL DUST)
========================================== */
function initParticles() {
    // Create the container
    const container = document.createElement('div');
    container.id = 'particle-container';
    document.body.appendChild(container);

    const particleCount = 40; // Number of particles on screen

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        
        // Randomize size, starting position, and speed
        const size = Math.random() * 4 + 2; // Between 2px and 6px
        const posX = Math.random() * 100; // Random horizontal position
        const delay = Math.random() * 20; // Random start delay
        const duration = Math.random() * 15 + 15; // Floats for 15-30 seconds

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`; // Negative delay makes some appear instantly

        container.appendChild(particle);
    }
}