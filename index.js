/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */

const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.style.width = ((scrollTop / docHeight) * 100).toFixed(2) + '%';
}

/* ============================================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */

const animatedElements = document.querySelectorAll('[data-animate]');

const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -45px 0px',
    }
);

animatedElements.forEach((el) => scrollObserver.observe(el));

/* ============================================================
   NAVBAR — SHRINK ON SCROLL
   ============================================================ */

const mainNav = document.getElementById('mainNav');

function handleNavbarScroll() {
    mainNav.classList.toggle('navbar-scrolled', window.scrollY > 80);
}

/* ============================================================
   ACTIVE NAV LINK — Section highlight
   ============================================================ */

const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const pageSections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((l) => l.classList.remove('active'));
                const match = document.querySelector(
                    `.navbar-nav .nav-link[href="#${entry.target.id}"]`
                );
                if (match) match.classList.add('active');
            }
        });
    },
    { threshold: 0.45 }
);

pageSections.forEach((s) => navObserver.observe(s));

/* ============================================================
   SCROLL-TO-TOP BUTTON
   ============================================================ */

const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTopVisibility() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 450);
}

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   COMBINED SCROLL HANDLER — requestAnimationFrame throttle
   ============================================================ */

let ticking = false;

window.addEventListener(
    'scroll',
    () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                handleNavbarScroll();
                handleScrollTopVisibility();
                ticking = false;
            });
            ticking = true;
        }
    },
    { passive: true }
);

// Run once on load to set initial states
updateScrollProgress();
handleNavbarScroll();
handleScrollTopVisibility();

/* ============================================================
   DYNAMIC COPYRIGHT YEAR
   ============================================================ */

const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   STATS COUNT-UP ANIMATION
   ============================================================ */

function animateCount(el, target, duration) {
    const start = performance.now();
    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number[data-count]').forEach((el) => {
                    animateCount(el, parseInt(el.dataset.count, 10), 1600);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.4 }
);

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

/* ============================================================
   FLIP CARDS — Keyboard Enter/Space support
   ============================================================ */

const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach((card) => {
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('flipped');
        }
        if (e.key === 'Escape') {
            card.classList.remove('flipped');
        }
    });
});

/* ============================================================
   TYPING EFFECT — Hero subtitle
   ============================================================ */

const roles = [
    'Full Stack Web Developer',
    'DevOps Engineer',
    'UI/UX Designer',
    'React Developer',
    'Ruby on Rails Dev',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeTarget = document.getElementById('typed-text');

function typeEffect() {
    if (!typeTarget) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typeTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 42 : 92;

    if (!isDeleting && charIndex === currentRole.length) {
        delay = 2400;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 380;
    }

    setTimeout(typeEffect, delay);
}

// Kick off after hero entrance animations finish
setTimeout(typeEffect, 1300);

/* ============================================================
   HERO PARALLAX — CSS fixed does the heavy lifting;
   this adds a subtle JS-based nudge for extra depth.
   Disabled on touch devices where fixed bg is broken.
   ============================================================ */

(function initParallax() {
    const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const hero = document.querySelector('.homepage');
    if (!hero) return;

    window.addEventListener(
        'scroll',
        () => {
            if (window.scrollY < window.innerHeight) {
                hero.style.backgroundPositionY =
                    'calc(50% + ' + (window.scrollY * 0.22).toFixed(1) + 'px)';
            }
        },
        { passive: true }
    );
})();
