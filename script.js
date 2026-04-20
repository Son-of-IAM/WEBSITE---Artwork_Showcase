document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    window.addEventListener('scroll', () => {
        document.getElementById('mainHeader').classList.toggle('scrolled', window.scrollY > 50);
    });

    // 2. Dark Mode Logic
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

    // 3. Scroll Reveal Animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 4. Filter Logic for Gallery
    const categoryBtns = document.querySelectorAll('.work-categories a');
    const artworkCards = document.querySelectorAll('.artwork-card');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.innerText.toLowerCase();
            
            artworkCards.forEach(card => {
                const cardCategory = card.querySelector('.artwork-overlay span').innerText.toLowerCase();
                if (filterValue === 'all' || filterValue === 'view all' || cardCategory.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// 5. Mobile Menu Toggle
function toggleMenu() {
    document.querySelector('.hamburger').classList.toggle('active');
    document.querySelector('.mobile-menu').classList.toggle('active');
    document.querySelector('.overlay').classList.toggle('active');
    document.body.style.overflow = document.querySelector('.mobile-menu').classList.contains('active') ? 'hidden' : '';
}

// 6. Unified Action Modal Logic (Sign Up / Work / Follow)
function openActionModal(defaultTab = 'tab-signup') {
    const modal = document.getElementById('actionModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const targetBtn = document.querySelector(`.tab-btn[onclick*="${defaultTab}"]`);
        if(targetBtn) targetBtn.click();
    }
}

function closeActionModal() {
    const modal = document.getElementById('actionModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchTab(evt, tabId) {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Close action modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('actionModal');
    if (modal && e.target === modal) closeActionModal();
});
