// Language translations
const translations = {
    en: {
        nav: {
            home: 'Home',
            projects: 'Projects',
            about: 'About Me',
            contact: 'Contact'
        },
        hero: {
            title: "Hello, I'm Héctor",
            description: "Full Stack Developer passionate about creating innovative digital solutions",
            cta1: "Contact Me",
            cta2: "View Projects"
        },
        about: {
            title: "About Me",
            whoami: "Who I Am",
            description1: "I'm Héctor, a dedicated software developer specializing in mobile application development with Flutter and robust backend solutions using Python. My expertise extends to crafting powerful web applications with both Django and Flask.",
            description2: "With a proven track record in software development, I am passionate about building applications that are not only visually compelling but also exceptionally functional and user-friendly. I am committed to delivering clean, maintainable, and scalable code, consistently adhering to industry best practices and the latest technological advancements.",
            description3: "Beyond my technical prowess, I bring a competitive spirit to every project, honed through participation in various tournaments. This drive ensures a relentless pursuit of excellence and a commitment to achieving outstanding results.",
            skills: "Technical Stack"
        },
        projects: {
            title: "My Projects"
        },
        footer: {
            rights: "All rights reserved."
        }
    },
    es: {
        nav: {
            home: 'Inicio',
            projects: 'Proyectos',
            about: 'Sobre Mí',
            contact: 'Contacto'
        },
        hero: {
            title: "Hola, soy Héctor",
            description: "Desarrollador Full Stack apasionado por crear soluciones digitales innovadoras",
            cta1: "Contáctame",
            cta2: "Ver Proyectos"
        },
        about: {
            title: "Sobre Mí",
            whoami: "¿Quién soy?",
            description1: "¡Hola! Soy Héctor, un desarrollador de software apasionado por crear soluciones digitales innovadoras. Me especializo en desarrollo móvil con Flutter y en la creación de APIs robustas con Python.",
            description2: "Con varios años de experiencia en el desarrollo de software, me enorgullezco de crear aplicaciones que no solo son visualmente atractivas, sino también altamente funcionales y fáciles de usar.",
            description3: "Mi enfoque se centra en escribir código limpio, mantenible y escalable, siguiendo las mejores prácticas de la industria y las últimas tendencias tecnológicas. Me encanta aprender nuevas tecnologías y enfrentar desafíos que me permitan crecer profesionalmente.",
            skills: "Habilidades Principales"
        },
        projects: {
            title: "Mis Proyectos"
        },
        footer: {
            rights: "Todos los derechos reservados."
        }
    }
};

// Language and theme management
class I18n {
    constructor() {
        this.language = localStorage.getItem('language') || 'en';
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setLanguage(this.language);
        this.setTheme(this.theme);
        this.bindEvents();
    }

    bindEvents() {
        // Language switcher
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang) {
                    this.setLanguage(lang);
                }
            });
        });

        // Theme toggle with emojis
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    setLanguage(lang) {
        if (!translations[lang]) return;
        this.language = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        
        // Update active button
        document.querySelectorAll('.language-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        // Update slider position
        const slider = document.querySelector('.language-slider');
        if (slider) {
            const activeBtn = document.querySelector('.language-btn.active');
            if (activeBtn) {
                slider.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
                slider.style.width = `${activeBtn.offsetWidth}px`;
            }
        }

        // Show only the selected language section
        document.querySelectorAll('.language-section').forEach(section => {
            section.style.display = 'none';
        });
        const activeSections = document.querySelectorAll(`.language-section[data-lang="${lang}"]`);
        activeSections.forEach(section => {
            section.style.display = 'block';
        });

        // Update all translatable elements
        this.translatePage();
        
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        const heroCta = document.querySelectorAll('.hero-cta .btn');
        
        if (heroTitle && translations[lang]?.hero?.title) {
            const nameSpan = heroTitle.querySelector('.text-gradient');
            if (nameSpan) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = translations[lang].hero.title;
                const newText = tempDiv.textContent || tempDiv.innerText || '';
                heroTitle.innerHTML = newText.replace('Héctor', '<span class="text-gradient">Héctor</span>');
            } else {
                heroTitle.innerHTML = translations[lang].hero.title;
            }
        }
        
        if (heroDescription && translations[lang]?.hero?.description) {
            heroDescription.textContent = translations[lang].hero.description;
        }
        
        if (heroCta.length === 2 && translations[lang]?.hero) {
            if (translations[lang].hero.cta1) heroCta[0].textContent = translations[lang].hero.cta1;
            if (translations[lang].hero.cta2) heroCta[1].textContent = translations[lang].hero.cta2;
        }
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Actualizar el emoji del toggle
        const emoji = document.querySelector('.theme-toggle .emoji');
        if (emoji) {
            emoji.style.transform = this.theme === 'dark' ? 'rotate(360deg)' : 'rotate(0deg)';
        }
    }

    translatePage() {
        const lang = this.language;
        const t = translations[lang];

        // Update language attribute on html element
        document.documentElement.lang = lang;

        // Handle language sections
        document.querySelectorAll('.language-section').forEach(section => {
            section.style.display = 'none';
        });
        
        const activeSections = document.querySelectorAll(`.language-section[data-lang="${lang}"]`);
        activeSections.forEach(section => {
            section.style.display = 'block';
            
            // Handle nested language sections (like in skills)
            const nestedSections = section.querySelectorAll('.language-section');
            nestedSections.forEach(nested => {
                if (nested.dataset.lang !== lang) {
                    nested.style.display = 'none';
                } else {
                    nested.style.display = 'inline';
                }
            });
        });

        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            // Skip if element is inside an active language section
            if (element.closest('.language-section') && !element.closest(`.language-section[data-lang="${lang}"]`)) {
                return;
            }

            const keys = element.getAttribute('data-i18n').split('.');
            let translation = t;
            
            // Traverse the translation object to get the correct translation
            let keyExists = true;
            for (const key of keys) {
                if (translation && translation[key] !== undefined) {
                    translation = translation[key];
                } else {
                    console.warn(`Translation not found for: ${keys.join('.')}`);
                    keyExists = false;
                    break;
                }
            }

            if (!keyExists) return;

            // Update the element content or placeholder
            if (element.tagName === 'INPUT' && element.placeholder) {
                element.placeholder = translation;
            } else if (element.hasAttribute('data-html')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && t.hero && t.hero.title) {
            const nameSpan = heroTitle.querySelector('.text-gradient');
            if (nameSpan) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = t.hero.title;
                const newText = tempDiv.textContent || tempDiv.innerText || '';
                heroTitle.innerHTML = newText.replace('Héctor', '<span class="text-gradient">Héctor</span>');
            } else {
                heroTitle.textContent = t.hero.title;
            }
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && t.hero && t.hero.description) {
            heroDescription.textContent = t.hero.description;
        }

        // Update hero CTA buttons
        const heroCta = document.querySelectorAll('.hero-cta .btn');
        if (heroCta.length >= 2 && t.hero) {
            if (t.hero.cta1) heroCta[0].textContent = t.hero.cta1;
            if (t.hero.cta2) heroCta[1].textContent = t.hero.cta2;
        }

        // Update about section
        if (t.about) {
            const aboutTitle = document.querySelector('.about .section-title');
            if (aboutTitle) {
                aboutTitle.innerHTML = `<span class="highlight">${t.about.title}</span>`;
            }
            
            const whoami = document.querySelector('.about h3');
            if (whoami) whoami.textContent = t.about.whoami;
            
            const descriptions = document.querySelectorAll('.about p[data-i18n^="about.description"]');
            descriptions.forEach((desc, index) => {
                if (t.about[`description${index + 1}`]) {
                    desc.textContent = t.about[`description${index + 1}`];
                }
            });
        }
        
        // Update projects section
        const projectsTitle = document.querySelector('.projects .section-title');
        if (projectsTitle && t.projects) {
            projectsTitle.innerHTML = `<span>${t.projects.title}</span>`;
        }
        
        // Update footer
        const footerRights = document.querySelector('.footer-bottom p');
        if (footerRights && t.footer) {
            const year = new Date().getFullYear();
            footerRights.innerHTML = `&copy; ${year} Héctor Zambrano. <span>${t.footer.rights}</span>`;
        }
        
        // Update navigation links
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks.length > 0 && t.nav) {
            navLinks.forEach(link => {
                const navKey = link.getAttribute('data-nav');
                if (navKey && t.nav[navKey]) {
                    link.textContent = t.nav[navKey];
                }
            });
        }
    }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const i18n = new I18n();
    
    // Make i18n available globally if needed
    window.i18n = i18n;
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
});
