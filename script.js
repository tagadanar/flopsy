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
        // Site metadata
        document.title = content.site.title;
        document.querySelector('meta[name="description"]').content = content.site.description;

        // Navigation
        const navLinks = document.getElementById('nav-links');
        content.navigation.forEach(item => {
            navLinks.innerHTML += `<li><a href="${item.href}">${item.text}</a></li>`;
        });

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
        content.apropos.parcours.forEach(item => {
            parcoursList.innerHTML += `<li>${item}</li>`;
        });

        // Consultations section
        document.getElementById('consultations-title').textContent = content.consultations.title;
        const consultationsGrid = document.getElementById('consultations-grid');
        content.consultations.cards.forEach(card => {
            consultationsGrid.innerHTML += `
                <div class="consultation-card">
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                </div>
            `;
        });

        // Contact section
        document.getElementById('contact-title').textContent = content.contact.title;
        document.getElementById('coordonnees-title').textContent = content.contact.coordonneesTitle;

        document.getElementById('adresse-content').innerHTML =
            `<strong>${content.contact.adresse.label}</strong><br>` +
            content.contact.adresse.lines.join('<br>');

        document.getElementById('horaires-content').innerHTML =
            `<strong>${content.contact.horaires.label}</strong><br>` +
            content.contact.horaires.lines.join('<br>');

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
        content.ressources.links.forEach(link => {
            ressourcesGrid.innerHTML += `
                <a href="${link.url}" class="ressource-card" target="_blank" rel="noopener">
                    <h3>${link.name}</h3>
                    <p>${link.description}</p>
                    <span class="card-link-hint">Visiter le site</span>
                </a>
            `;
        });

        // Footer
        document.getElementById('footer-copyright').innerHTML = `&copy; ${content.footer.copyright}`;
        document.getElementById('footer-adeli').textContent = content.footer.adeli;
    })
    .catch(error => console.error('Error loading content:', error));
