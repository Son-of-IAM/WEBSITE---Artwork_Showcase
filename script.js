// script.js — Core Engine for Son_of_IAM_ Portfolio
// Handles: CMS Fetching, Cinematic Carousel, Dynamic Grids, Theme, & UI
const ARTWORKS_URL = 'data/artworks/index.json';

/* ==========================================
DATA FETCHING (HEADLESS CMS)
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
        'graffiti': 'Graffiti',
        'sketches': 'Sketches'
    };
    return labels[cat] || (cat ? cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Artwork');
}

/* ==========================================
2. CINEMATIC CAROUSEL LOGIC
========================================== */
/* ==========================================
2. CINEMATIC CAROUSEL LOGIC
========================================== */
const EXHIBITION_IMAGES = [
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783785773/1_Corinthians_2V9_painting_ah0hjt.webp', title: '1 Corinthians 2:9' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783785771/Crucifixion._painting_mvg0qs.webp', title: 'Crucifixion' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783785772/Daughter_Of_Zion._painting_qhnhaw.webp', title: 'Daughter Of Zion' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783785774/Genesis_3_painting_rwetjt.webp', title: 'Genesis 3' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783785672/5._Light_Among_Darkness_sblsss.webp', title: 'Light Among Darkness' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783785776/Light_Bearer_painting_py5zgx.webp', title: 'Light Bearer' },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783785775/Messiah_s_Love_painting_ihro5h.webp', title: "Messiah's Love" },
    { url: 'https://res.cloudinary.com/mst703ng/image/upload/v1783787604/The_Lost_Sheep_concept_sketches_ixkpbl.jpg', title: 'The Lost Sheep' }
];

async function initCinematicCarousel(artworks) {
    const carouselItems = document.querySelectorAll('#auto-carousel .carousel-item img');
    if (carouselItems.length === 0) return;
    
    let nextIndex = carouselItems.length;
    carouselItems.forEach((img, index) => {
        img.src = EXHIBITION_IMAGES[index].url;
        img.alt = EXHIBITION_IMAGES[index].title;
    });

    const items = document.querySelectorAll('#auto-carousel .carousel-item');
    let positions = ['center', 'right', 'hidden', 'hidden', 'left'];

    setInterval(() => {
        // Grab the index of the item on the 'left' right before it slides off-screen
        const offScreenIdx = positions.indexOf('left');
        
        // Shift the array to rotate the carousel
        positions.unshift(positions.pop());
        items.forEach((item, idx) => { item.className = 'carousel-item ' + positions[idx]; });
        
        // Quietly swap the image on the exact node that just went into hiding
        if (offScreenIdx !== -1) {
            const img = carouselItems[offScreenIdx];
            const nextImg = EXHIBITION_IMAGES[nextIndex % EXHIBITION_IMAGES.length];
            img.src = nextImg.url; 
            img.alt = nextImg.title; 
            nextIndex++;
        }
    }, 3500);
}

/* ==========================================
3. INDEX PAGE WORK PREVIEW
========================================== */
function renderCategoryFolders(artworks) {
    const folderGrid = document.getElementById('category-folders-grid');
    if (!folderGrid || !artworks.length) return;
    
    folderGrid.innerHTML = '';
    const categories = [
        { id: 'paintings', label: 'Paintings' },
        { id: 'gospel', label: 'The Gospel Proclaimed' },
        { id: 'sketches', label: 'Sketches' },
        { id: '3d-art', label: '3D Art' },
        { id: 'graffiti', label: 'Graffiti' },
        { id: 'old', label: 'Old Artworks' }
    ];

    categories.forEach(cat => {
        const catArtworks = artworks.filter(a => a.category === cat.id);
        if (catArtworks.length === 0) return;
        
        const coverArt = catArtworks[0];
        const imgSrc = coverArt.fullImage || coverArt.previewImage || coverArt.image || '';
        
        const card = document.createElement('a');
        card.href = `work.html#${cat.id}`;
        card.className = 'category-folder-card reveal active tilt-card';
        card.innerHTML = `
            <div class="folder-image">
                <img src="${imgSrc}" alt="${cat.label}" loading="lazy" style="object-fit: cover;" onerror="this.style.display='none';">
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
    Object.values(sections).forEach(grid => { if (grid) { grid.innerHTML = ''; isWorkPage = true; } });
    if (!isWorkPage) return;

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

    const filterGrid = (grid, filterBar, category, activeBtn) => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
        
        grid.querySelectorAll('.filtered-item').forEach(item => {
            if (category === 'all' || item.dataset.group === category) {
                item.classList.remove('hidden');
                setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
            } else {
                item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
                setTimeout(() => { item.classList.add('hidden'); }, 400);
            }
        });
    };

    const renderCards = (container, items, isFilterable = false) => {
        const grid = document.createElement('div');
        grid.className = 'subcategory-grid';
        
        items.forEach(art => {
            const mediaSrc = art.previewImage || art.fullImage || art.image || '';
            const isVideo = mediaSrc.toLowerCase().endsWith('.mp4') || mediaSrc.toLowerCase().endsWith('.mov');
            
            const mediaElement = isVideo 
                ? `<video src="${mediaSrc}" autoplay loop muted playsinline loading="lazy" style="width:100%; height:100%; object-fit:contain;"></video>`
                : `<img src="${mediaSrc}" alt="${art.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='var(--bg-light)'">`;
            
            const card = document.createElement('a');
            card.className = 'work-card reveal active tilt-card filtered-item';
            
            // FIX 1: Use stable numeric ID instead of encoded title string
            card.href = `artwork.html?id=${art.id}`;
            
            if (isFilterable) {
                card.dataset.group = art.category === 'paintings' ? (art.year || 'Unknown') : (art.subcategory || 'Uncategorized');
            }
            
            const subcat = art.subcategory ? ` — ${art.subcategory}` : (art.year ? ` — ${art.year}` : '');
            card.innerHTML = `
                ${mediaElement}
                <div class="overlay-info">
                    <h3>${art.title}</h3>
                    <p>${getCategoryLabel(art.category)}${subcat}</p>
                </div>
            `;
            grid.appendChild(card);
        });
        container.appendChild(grid);
    };

    // 1. PAINTINGS (Sorted Newest to Oldest)
    if (sections['paintings']) {
        const paintings = artworks.filter(a => a.category === 'paintings').sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
        const years = [...new Set(paintings.map(a => a.year || 'Unknown'))].sort((a, b) => b.localeCompare(a));
        createFilterBar(sections['paintings'], years, sections['paintings']);
        renderCards(sections['paintings'], paintings, true);
    }

    // 2. 3D ART
    if (sections['3d-art']) {
        const threeDArt = artworks.filter(a => a.category === '3d-art');
        const desiredOrder = [
            "Featured Renders", "Stylized Portraits", "Astronaut Series", 
            "Human Series", "Abstract Figures", "Abstract Still Renders", "Abstract Animations"
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
        renderCards(sections['3d-art'], threeDArt, true);
    }

    // 3. SKETCHES & OLD
    if (sections['sketches']) renderCards(sections['sketches'], artworks.filter(a => a.category === 'sketches'), false);
    if (sections['old']) renderCards(sections['old'], artworks.filter(a => a.category === 'old'), false);

    // 4. GOSPEL & GRAFFITI
    if (sections['gospel']) renderCards(sections['gospel'], artworks.filter(a => a.category === 'gospel'), false);
    if (sections['graffiti']) renderCards(sections['graffiti'], artworks.filter(a => a.category === 'graffiti'), false);
}

/* ==========================================
5. ARTWORK DETAIL PAGE
========================================== */
function renderArtworkDetail(artworks) {
    const params = new URLSearchParams(window.location.search);
    
    // FIX 2: Parse ID as integer and handle NaN safely
    const idParam = parseInt(params.get('id'), 10);
    const titleEl = document.getElementById('artworkTitle');
    
    if (!titleEl) return; 
    if (isNaN(idParam) || !artworks.length) {
        return showArtworkError();
    }
    
    // FIX 3: Match against stable numeric id
    const art = artworks.find(a => a.id === idParam);
    if (!art) {
        return showArtworkError();
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
        mainImg.style.objectFit = 'contain';
        mainImg.style.maxHeight = '85vh';
        mainImg.style.width = '100%';
    }

    document.title = `${art.title || 'Artwork'} | Son_of_IAM_`;

    const currentIndex = artworks.indexOf(art);
    const prevArt = artworks[currentIndex - 1] || artworks[artworks.length - 1];
    const nextArt = artworks[currentIndex + 1] || artworks[0];
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // FIX 4: Use stable numeric id for next/prev links
    if (prevBtn) prevBtn.href = `artwork.html?id=${prevArt.id}`;
    if (nextBtn) nextBtn.href = `artwork.html?id=${nextArt.id}`;
}

function showArtworkError() {
    const title = document.getElementById('artworkTitle');
    if (title) title.textContent = 'Artwork Not Found';
    
    const desc = document.getElementById('artworkDescription');
    if (desc) desc.textContent = 'This artwork could not be loaded. Please return to the gallery.';
    
    const mainImg = document.getElementById('mainImage');
    if (mainImg) mainImg.style.display = 'none';
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
7. MASTER LOAD TRIGGER
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
    }

    setTimeout(() => {
        initPremiumFeatures();
    }, 200);

    initCategorySlider(); 
    initParticles();
});

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

function initParticles() {
    const container = document.createElement('div');
    container.id = 'particle-container';
    document.body.appendChild(container);
    
    const particleCount = 40; 
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        
        const size = Math.random() * 4 + 2; 
        const posX = Math.random() * 100; 
        const delay = Math.random() * 20; 
        const duration = Math.random() * 15 + 15; 
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`; 
        
        container.appendChild(particle);
    }
}