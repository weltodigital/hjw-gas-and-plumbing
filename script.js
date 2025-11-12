// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);

            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Email Link Tracking for Analytics
document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
    emailLink.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'email_click', {
                event_category: 'contact',
                event_label: 'email_link_click'
            });
        }
    });
});

// Track Phone Number Clicks for Analytics
document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
    phoneLink.addEventListener('click', function() {
        // Google Analytics event tracking (if GA is implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                event_category: 'contact',
                event_label: 'phone_number_click'
            });
        }

        // Facebook Pixel event tracking (if FB Pixel is implemented)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: 'Phone Call'
            });
        }
    });
});


// Intersection Observer for Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards for animation
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Load Google Maps for service area display (optional)
function initMap() {
    // This would be used if you want to add a Google Map
    // You'll need to get a Google Maps API key and add the script
    if (document.getElementById('map')) {
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: { lat: 51.0557, lng: -1.3080 }, // Winchester, Hampshire
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Add service area markers
        const serviceAreas = [
            { lat: 51.0557, lng: -1.3080, title: 'Winchester' },
            { lat: 50.9097, lng: -1.4044, title: 'Southampton' },
            { lat: 50.8198, lng: -1.0880, title: 'Portsmouth' },
            { lat: 50.8429, lng: -0.1313, title: 'Brighton' }
        ];

        serviceAreas.forEach(area => {
            new google.maps.Marker({
                position: { lat: area.lat, lng: area.lng },
                map: map,
                title: area.title,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#1e40af" stroke="#fff" stroke-width="2"/>
                            <text x="16" y="20" text-anchor="middle" fill="white" font-size="12">🔧</text>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 32)
                }
            });
        });
    }
}

// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images (if any are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    if (e.target !== window) {
        console.warn('Resource failed to load:', e.target.src || e.target.href);

        // Handle failed font loads
        if (e.target.href && e.target.href.includes('fonts.googleapis.com')) {
            document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        }
    }
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}