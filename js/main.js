// Función para actualizar el ícono del tema
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-moon';
                themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
                themeToggle.setAttribute('title', 'Cambiar a modo claro');
            } else {
                icon.className = 'fas fa-sun';
                themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
                themeToggle.setAttribute('title', 'Cambiar a modo oscuro');
            }
        }
    }
}

// Función para cambiar entre temas claro/oscuro
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Actualizar el atributo data-theme en el HTML
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('theme', newTheme);
    
    // Actualizar el ícono y el texto alternativo
    updateThemeIcon(newTheme);
    
    // Disparar evento personalizado para otros componentes que necesiten reaccionar al cambio
    document.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { 
            theme: newTheme 
        } 
    }));
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme - default to dark
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Force dark theme as default
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Initialize theme toggle with better error handling
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        // Ensure the icon is visible
        themeToggle.style.display = 'flex';
        themeToggle.style.visibility = 'visible';
        themeToggle.style.opacity = '1';
    }
    
    // Set Spanish as default language and update all elements
    const savedLang = localStorage.getItem('language') || 'es';
    
    // Función para actualizar todas las traducciones
    function updateAllTranslations(lang) {
        // Actualizar elementos con el atributo data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Actualizar botones de idioma
        document.querySelectorAll('.language-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            // Actualizar atributos ARIA para accesibilidad
            btn.setAttribute('aria-pressed', btn.classList.contains('active'));
            btn.setAttribute('aria-label', `Cambiar a ${btn.dataset.lang === 'es' ? 'español' : 'inglés'}`);
        });
        
        // Actualizar el atributo lang del HTML
        document.documentElement.lang = lang;
        
        // Mostrar/ocultar secciones de idioma
        document.querySelectorAll('.language-section').forEach(section => {
            if (section.dataset.lang === lang) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        
        // Guardar preferencia
        localStorage.setItem('language', lang);
    }
    
    // Update all translations on page load
    updateAllTranslations(savedLang);
    
    // Ensure theme toggle is visible
    if (themeToggle) {
        themeToggle.style.display = 'flex';
        themeToggle.style.visibility = 'visible';
        themeToggle.style.opacity = '1';
    }
    
    // Add event listeners to language buttons
    document.querySelectorAll('.language-btn').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            updateAllTranslations(lang);
        });
    });
    
    // Watch for system theme changes
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
    
    // Load project cards
    loadProjectCards();
    
    // Initialize language switching
    initLanguageSwitcher();
    
    // Set initial language
    setLanguage('en'); // Default to English
    // Initialize star ratings
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const inputs = rating.querySelectorAll('input[type="radio"]');
        const labels = rating.querySelectorAll('label');
        
        // Set initial state based on checked input
        inputs.forEach((input, index) => {
            if (input.checked) {
                highlightStars(labels, index);
            }
            
            // Add click event to each star
            const label = input.nextElementSibling;
            label.addEventListener('click', (e) => {
                const clickedIndex = Array.from(labels).indexOf(e.target);
                highlightStars(labels, clickedIndex);
            });
        });
    });
    
    // Highlight stars up to the clicked one
    function highlightStars(labels, index) {
        labels.forEach((label, i) => {
            if (i <= index) {
                label.style.color = '#fbbf24'; // Active star color
            } else {
                label.style.color = '#4b5563'; // Inactive star color
            }
        });
    }
    
    // Function to update active navigation link on scroll
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Enhanced smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Altura del encabezado fijo
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Reset scroll behavior
                setTimeout(() => {
                    document.documentElement.style.scrollBehavior = '';
                }, 1000);
                
                // Cerrar menú móvil si está abierto
                const hamburger = document.querySelector('.hamburger');
                const navLinks = document.querySelector('.nav-links');
                if (hamburger && navLinks && hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Add active class to current section in viewport
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function setActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveSection);
    setActiveSection(); // Run once on load
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.nav-links');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Toggle body scroll when mobile menu is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Add shadow to header on scroll with smooth transition
    const header = document.querySelector('header');
    if (header) {
        // Add transition for smooth shadow appearance
        header.style.transition = 'box-shadow 0.3s ease, background-color 0.6s ease';
        
        // Initial check
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        // Scroll event
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Enhanced custom cursor effect with theme-aware colors
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        // Update cursor colors based on theme
        const updateCursorColors = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            cursor.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)';
            cursorFollower.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)';
        };
        
        // Initial color setup
        updateCursorColors();
        
        // Update colors when theme changes
        document.addEventListener('themeChanged', updateCursorColors);
        
        // Smooth cursor movement
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let isCursorOverClickable = false;
        
        // Get all interactive elements once
        const interactiveElementsSelector = [
            'a', 'button', 'input', 'textarea', 'select', 'label', 
            '[role="button"]', '[tabindex]', '.btn', '.card', '.project-card'
        ].join(',');
        
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Check if over clickable element
            const target = e.target;
            isCursorOverClickable = target.matches(interactiveElementsSelector) || 
                                  target.closest(interactiveElementsSelector);
            
            if (isCursorOverClickable) {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-follower-hover');
            } else {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-follower-hover');
            }
        });
        
        // Smooth follow animation
        const animateCursor = () => {
            // Cursor (small dot) follows instantly
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            
            // Follower (larger circle) follows with easing
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            followerX += dx * 0.2;
            followerY += dy * 0.2;
            
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Click effect
        document.addEventListener('mousedown', () => {
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) scale(0.7)`;
        });
        
        document.addEventListener('mouseup', () => {
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) scale(1)`;
        });
        
        // No need for separate hover listeners since we're handling it in mousemove
    }
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    // Initial check on load
    
    // Update active nav link on load and scroll
    window.addEventListener('load', updateActiveNavLink);
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update colors when theme changes
    document.addEventListener('themeChanged', updateCursorColors);
    
    // Smooth cursor movement
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isCursorOverClickable = false;
    
    // Get all interactive elements once
    const interactiveElementsSelector = [
        'a', 'button', 'input', 'textarea', 'select', 'label', 
        '[role="button"]', '[tabindex]', '.btn', '.card', '.project-card'
    ].join(',');

    // Asegúrate de que languageButtons esté declarado correctamente
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // Update active state
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    
    // Set language function
    function setLanguage(lang) {
        // Update about section
        const aboutSections = document.querySelectorAll('.language-section');
        aboutSections.forEach(section => {
            if (section.getAttribute('data-lang') === lang) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        
        // Update document language attribute
        document.documentElement.setAttribute('lang', lang);
        
        // Update title based on language
        const title = lang === 'es' ? 'Héctor - Desarrollador Flutter & Python' : "Héctor's Portfolio | Flutter & Python Developer";
        document.title = title;
    }
});
