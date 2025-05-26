// Esperar a que el DOM esté completamente cargado
function initNavigation() {
    // Verificar si las secciones ya están cargadas
    const checkSections = setInterval(() => {
        const sections = document.querySelectorAll('section');
        if (sections.length > 0) {
            clearInterval(checkSections);
            setupNavigation();
        }
    }, 100);
}

function setupNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    let currentSection = 'home';

    // Function to update active link
    function updateActiveLink(targetId) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Add active class to the clicked link
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scroll to section
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
            updateActiveLink(targetId);
            currentSection = targetId;
            // Update URL without page reload
            history.pushState(null, '', `#${targetId}`);
        }
    }

    // Click event for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // Remove # from href
            scrollToSection(targetId);
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust for fixed header
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        if (current && current !== currentSection) {
            updateActiveLink(current);
            currentSection = current;
        }
    });

    // Handle back/forward browser buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            scrollToSection(hash);
        } else {
            scrollToSection('home');
        }
    });

    // Initialize active link based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        scrollToSection(hash);
    } else {
        updateActiveLink('home');
    }
}

// Inicializar la navegación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}
