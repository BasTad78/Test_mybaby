/**
 * main.js - SPA Router & App Controller
 */

const routes = {
    '#home': 'pages/Accueil.html',
    '#login': 'pages/connexion.html',
    '#register': 'pages/inscription.html',
    '#map': 'pages/carte.html',
    '#profile': 'pages/profil.html',
    '#ranking': 'pages/classement.html',
    '#match': 'pages/match_v2.html',  // Version 2 pour bypasser le cache
    '#events': 'pages/evenement.html'
};

const app = document.getElementById('app');
const header = document.getElementById('header');
const footer = document.getElementById('footer');

async function loadComponent(id, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        const container = document.getElementById(id);
        container.innerHTML = html;

        // Execute scripts for components (like navigation logic)
        executeScripts(container);

        // Header specific logic: burger menu toggle
        if (id === 'header') {
            const toggle = container.querySelector('#menuToggle');
            const nav = container.querySelector('#mainNav');
            if (toggle && nav) {
                const toggleMenu = (e) => {
                    e.stopPropagation();
                    nav.classList.toggle('show');
                };

                toggle.addEventListener('click', toggleMenu);

                // Close menu when a link is clicked
                nav.querySelectorAll('.nav-btn').forEach(lnk => {
                    lnk.addEventListener('click', () => nav.classList.remove('show'));
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                        nav.classList.remove('show');
                    }
                });
            }
        }
    } catch (err) {
        console.error(`Failed to load component ${id}:`, err);
    }
}

function executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));

        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }

        // Remove old script and inject new one to trigger execution
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

async function handleNavigation() {
    const hash = window.location.hash || '#login';
    const path = routes[hash] || routes['#home'];

    // UI Feedback: Loading
    app.innerHTML = '<div style="display:flex; justify-content:center; padding:50px"><div class="loader">Chargement...</div></div>';

    try {
        const response = await fetch(`${path}?t=${Date.now()}`);
        if (!response.ok) throw new Error('Page non trouvée');
        const html = await response.text();

        app.innerHTML = html;
        executeScripts(app);

        // Adaptation de la mise en page (plein écran pour la carte)
        if (hash === '#map') {
            document.body.classList.add('fullscreen-page');
        } else {
            document.body.classList.remove('fullscreen-page');
        }

        // Highlight active link
        updateActiveLinks(hash);

        // Close mobile menu on navigation
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.remove('show');
    } catch (err) {
        app.innerHTML = `<div class="card" style="margin:20px; text-align:center">
            <h2>Oops!</h2>
            <p>Impossible de charger cette page. Vérifiez votre connexion.</p>
            <button onclick="location.reload()" class="btn primary">Réessayer</button>
        </div>`;
    }
}

function updateActiveLinks(hash) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const isActive = btn.getAttribute('href') === hash;
        btn.classList.toggle('active', isActive);
    });
}

// Check for pending match challenges
async function checkMatchNotifications() {
    const rawUser = localStorage.getItem('mybaby_user');
    if (!rawUser) return;

    try {
        const user = JSON.parse(rawUser);
        const uid = user.id_utilisateur || user.id;

        // Using fetch directly to avoid importing matchService in main.js (Circular dep risk or fetch complexity)
        const res = await fetch('https://testmybaby-production.up.railway.app/api/matches');
        const matches = await res.json();

        const pending = matches.filter(m => m.id_joueur2 == uid && m.statut_validation === 'En attente');

        const matchBtn = document.querySelector('.nav-btn[data-link="match"]');
        if (matchBtn) {
            let badge = matchBtn.querySelector('.notif-badge');
            if (pending.length > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'notif-badge';
                    matchBtn.appendChild(badge);
                }
                badge.textContent = pending.length;
            } else if (badge) {
                badge.remove();
            }
        }
    } catch (e) {
        console.warn('Notification check failed:', e);
    }
}

// Global notification checker (every 30s)
window.checkMatchNotifications = checkMatchNotifications;
setInterval(checkMatchNotifications, 30000);

// Global API Check
async function checkBackend() {
    try {
        const res = await fetch('http://localhost:3000/api');
        if (!res.ok) console.warn('Backend is down or unreachable.');
    } catch (e) {
        console.error('Backend connection failed. Make sure your server is running on port 3000.');
        // Optional: show a toast/notification to the user
    }
}

// Initial Load
window.addEventListener('hashchange', handleNavigation);

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('header', 'components/Header.html');
    await loadComponent('footer', 'components/Footer.html');
    handleNavigation();
    checkBackend();
    setTimeout(checkMatchNotifications, 1000);
});
