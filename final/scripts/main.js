const menuButton = document.querySelector('#menu-button');
const navigation = document.querySelector('#main-nav');
if (menuButton && navigation) {
    menuButton.addEventListener('click', () => { const isOpen = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(isOpen)); menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu') });
} 

const current = location.pathname.split('/').pop() || 'index.html'; document.querySelectorAll('#main-nav a').forEach(link => { if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'page') });

const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent =
        `Last Modified: ${document.lastModified}`;
}
