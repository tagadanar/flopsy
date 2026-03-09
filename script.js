// Theme toggle
(function() {
    const toggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', function() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
})();

// Load content from JSON
fetch('content.json')
    .then(response => response.json())
    .then(content => {
        // Navigation
        const navLinks = document.getElementById('nav-links');
        navLinks.innerHTML = content.navigation.map(item =>
            `<li><a href="${item.href}">${item.text}</a></li>`
        ).join('');

        // Hero section
        document.getElementById('hero-name').textContent = content.hero.name;
        document.getElementById('hero-title').textContent = content.hero.title;
        document.getElementById('hero-tagline').textContent = `"${content.hero.tagline}"`;
        document.getElementById('hero-button').textContent = content.hero.buttonText;

        // About section
        document.getElementById('apropos-title').textContent = content.apropos.title;
        document.getElementById('apropos-description').textContent = content.apropos.description;
        document.getElementById('parcours-title').textContent = content.apropos.parcoursTitle;
        const parcoursList = document.getElementById('parcours-list');
        parcoursList.innerHTML = content.apropos.parcours.map(item =>
            `<li>${item}</li>`
        ).join('');

        // Consultations section
        document.getElementById('consultations-title').textContent = content.consultations.title;
        const consultationsGrid = document.getElementById('consultations-grid');
        consultationsGrid.innerHTML = content.consultations.cards.map(card =>
            `<div class="consultation-card">
                <h3>${card.title}</h3>
                <p>${card.description}</p>
            </div>`
        ).join('');

        // Contact section
        document.getElementById('contact-title').textContent = content.contact.title;
        document.getElementById('coordonnees-title').textContent = content.contact.coordonneesTitle;

        document.getElementById('adresse-content').innerHTML =
            `<strong>${content.contact.adresse.label}</strong><br>` +
            content.contact.adresse.lines.join('<br>');

        document.getElementById('horaires-content').innerHTML =
            `<strong>${content.contact.horaires.label}</strong><br>` +
            content.contact.horaires.lines.join('<br>');

        document.getElementById('telephone-content').innerHTML =
            `<strong>${content.contact.telephone.label}</strong><br>` +
            `<a href="tel:+33${content.contact.telephone.value.replace(/\s/g, '').substring(1)}">${content.contact.telephone.value}</a>`;

        document.getElementById('email-content').innerHTML =
            `<strong>${content.contact.email.label}</strong><br>` +
            `<a href="mailto:${content.contact.email.value}">${content.contact.email.value}</a>`;

        const doctolibLink = document.getElementById('doctolib-link');
        doctolibLink.href = content.contact.doctolib.url;
        doctolibLink.textContent = content.contact.doctolib.text;

        // Map - build URL from coordinates
        const lat = content.contact.adresse.latitude;
        const lng = content.contact.adresse.longitude;
        const bbox = `${lng - 0.01},${lat - 0.005},${lng + 0.01},${lat + 0.005}`;
        document.getElementById('map-iframe').src =
            `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

        // Ressources section
        document.getElementById('ressources-title').textContent = content.ressources.title;
        document.getElementById('ressources-description').textContent = content.ressources.description;
        const ressourcesGrid = document.getElementById('ressources-grid');
        ressourcesGrid.innerHTML = content.ressources.links.map(link =>
            `<a href="${link.url}" class="ressource-card" target="_blank" rel="noopener noreferrer">
                <h3>${link.name}</h3>
                <p>${link.description}</p>
            </a>`
        ).join('');

        // Footer
        document.getElementById('footer-copyright').innerHTML = `&copy; ${content.footer.copyright}`;
        document.getElementById('footer-adeli').textContent = content.footer.adeli;
    })
    .catch(error => {
        console.error('Error loading content:', error);
        document.querySelector('main').innerHTML =
            '<p style="text-align:center;padding:4rem 1rem">Une erreur est survenue lors du chargement du contenu. Veuillez réessayer.</p>';
    });
