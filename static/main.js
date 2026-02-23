// Main Interactivity for Amber & Co.

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initScrollAnimations();
    initNavbar();
    initPortal();
    initValuator();
    initClocks();
});

// 1. Hero Particle Canvas
function initHeroCanvas() {
    const canvas = document.getElementById('hero-gradient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// 2. Scroll Animations
function initScrollAnimations() {
    const options = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.reveal, .reveal-right, .reveal-bottom, .collection-item, .mastery-card, .location-item').forEach(el => {
        observer.observe(el);
    });
}

// 3. Navbar scroll effect
function initNavbar() {
    const navbar = document.querySelector('.amber-navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 4. Portal Logic
function initPortal() {
    const portalModal = document.getElementById('portalModal');
    const openPortalBtn = document.querySelector('.btn-portal-trigger');
    const closePortalBtn = document.getElementById('closePortal');
    const loginView = document.getElementById('loginView');
    const conciergeView = document.getElementById('conciergeView');
    const dashboardView = document.getElementById('dashboardView');

    const openPortal = () => {
        portalModal.classList.add('active');
        portalModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closePortal = () => {
        portalModal.classList.remove('active');
        setTimeout(() => portalModal.classList.add('hidden'), 600);
        document.body.style.overflow = 'auto';
    };

    if (openPortalBtn) openPortalBtn.addEventListener('click', openPortal);
    if (closePortalBtn) closePortalBtn.addEventListener('click', closePortal);

    // Demo hint toggle (security improvement — not shown by default)
    const toggleHintBtn = document.getElementById('toggleDemoHint');
    const demoHint = document.getElementById('demoHint');
    if (toggleHintBtn && demoHint) {
        toggleHintBtn.addEventListener('click', () => {
            demoHint.classList.toggle('d-none');
        });
    }

    // Login Mock
    const loginForm = document.getElementById('portalLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('.portal-btn');
            btn.innerText = "AUTHENTICATING...";
            setTimeout(() => {
                loginView.classList.add('hidden');
                dashboardView.classList.remove('hidden');
                btn.innerText = "AUTHORIZE ACCESS";
            }, 1500);
        });
    }

    // Concierge Switch
    const conciergeBtn = document.getElementById('openConcierge');
    if (conciergeBtn) {
        conciergeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.classList.add('hidden');
            conciergeView.classList.remove('hidden');
        });
    }
}

// 5. Valuator Logic
function initValuator() {
    const form = document.getElementById('predictionForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.predict-btn');
        const btnText = btn.querySelector('.btn-text');
        const resultContainer = document.getElementById('resultContainer');
        const priceDisplay = document.getElementById('predictedPrice');

        btn.disabled = true;
        btnText.textContent = 'CONSULTING NEURAL NETWORK...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Convert numbers
        ['carat', 'depth', 'table', 'x', 'y', 'z'].forEach(k => data[k] = parseFloat(data[k]));

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Query Failed');

            const result = await response.json();

            setTimeout(() => {
                btn.disabled = false;
                btnText.textContent = 'OBTAIN VALUATION';
                resultContainer.classList.remove('hidden');
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                animatePrice(result.prediction, priceDisplay);
            }, 1500);

        } catch (error) {
            console.error(error);
            alert('Valuation system offline. Please try again.');
            btn.disabled = false;
            btnText.textContent = 'OBTAIN VALUATION';
        }
    });

    const downloadCert = document.getElementById('downloadCert');
    if (downloadCert) {
        downloadCert.addEventListener('click', () => {
            downloadCert.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERATING CERTIFICATE...';
            setTimeout(() => {
                alert("Your certified valuation has been cryptographically signed and is ready for download.");
                downloadCert.innerHTML = '<i class="fas fa-file-contract"></i> DOWNLOAD CERTIFICATE';
            }, 2000);
        });
    }
}

function animatePrice(target, element) {
    let current = 0;
    const duration = 2500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 5); // Quintic easing

        current = target * easeProgress;
        element.textContent = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(current);

        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// 6. Global Clocks
function initClocks() {
    function update() {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const zones = {
            'clock-antwerp': 'Europe/Brussels',
            'clock-ny': 'America/New_York',
            'clock-mumbai': 'Asia/Kolkata',
            'clock-telaviv': 'Asia/Jerusalem'
        };

        for (const [id, zone] of Object.entries(zones)) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = new Intl.DateTimeFormat('en-GB', { ...options, timeZone: zone }).format(new Date());
            }
        }
    }
    setInterval(update, 1000);
    update();
}
