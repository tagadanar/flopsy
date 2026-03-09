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

        // Canonical URL
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = content.site.url;
        document.head.appendChild(canonical);

        // Open Graph tags
        const ogTags = {
            'og:type': 'website',
            'og:url': content.site.url,
            'og:title': content.site.title,
            'og:description': content.site.description,
            'og:image': content.site.ogImage,
            'og:locale': content.site.locale
        };
        Object.entries(ogTags).forEach(([property, value]) => {
            const meta = document.createElement('meta');
            meta.setAttribute('property', property);
            meta.content = value;
            document.head.appendChild(meta);
        });

        // Twitter Card tags
        const twitterTags = {
            'twitter:card': 'summary',
            'twitter:title': content.site.title,
            'twitter:description': content.site.description,
            'twitter:image': content.site.ogImage
        };
        Object.entries(twitterTags).forEach(([name, value]) => {
            const meta = document.createElement('meta');
            meta.name = name;
            meta.content = value;
            document.head.appendChild(meta);
        });

        // JSON-LD structured data
        const phone = content.contact.téléphone.value.replace(/\s/g, '');
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: content.hero.name + ' - ' + content.hero.title,
            description: content.site.description,
            url: content.site.url,
            telephone: '+33' + phone.substring(1),
            email: content.contact.email.value,
            image: content.site.ogImage,
            priceRange: '$$',
            address: {
                '@type': 'PostalAddress',
                streetAddress: content.contact.adresse.lines[0],
                postalCode: content.contact.adresse.lines[1].split(' ')[0],
                addressLocality: content.contact.adresse.lines[1].split(' ')[1],
                addressCountry: 'FR'
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: content.contact.adresse.latitude,
                longitude: content.contact.adresse.longitude
            },
            openingHoursSpecification: content.contact.horaires.structured.map(h => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: h.days,
                opens: h.opens,
                closes: h.closes
            })),
            sameAs: [content.contact.doctolib.url],
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: content.consultations.title,
                itemListElement: content.consultations.cards.map(card => ({
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name: card.title }
                }))
            }
        };
        const ldScript = document.createElement('script');
        ldScript.type = 'application/ld+json';
        ldScript.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(ldScript);

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
                <a href="${link.url}" class="ressource-card" target="_blank" rel="noopener noreferrer">
                    <h3>${link.name}</h3>
                    <p>${link.description}</p>
                </a>
            `;
        });

        // Footer
        document.getElementById('footer-copyright').innerHTML = `&copy; ${content.footer.copyright}`;
        document.getElementById('footer-adeli').textContent = content.footer.adeli;
    })
    .catch(error => console.error('Error loading content:', error));
