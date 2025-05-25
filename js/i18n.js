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
            description1: "Hello! I'm Héctor, a passionate software developer specialized in mobile application development with Flutter and backend solutions with Python.",
            description2: "With several years of experience in software development, I take pride in creating applications that are not only visually appealing but also highly functional and user-friendly.",
            description3: "My focus is on writing clean, maintainable, and scalable code, following industry best practices and the latest technological trends. I love learning new technologies and facing challenges that allow me to grow professionally.",
            skills: "Key Skills"
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
        
        // Update active state of language buttons
        document.querySelectorAll('.language-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        // Show/hide language sections
        document.querySelectorAll('.language-section').forEach(section => {
            if (section.dataset.lang === lang) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });

        // Update all translatable elements
        this.translatePage();
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

        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const keys = element.getAttribute('data-i18n').split('.');
            let translation = t;
            
            // Traverse the translation object to get the correct translation
            for (const key of keys) {
                if (translation && translation[key] !== undefined) {
                    translation = translation[key];
                } else {
                    console.warn(`Translation not found for: ${keys.join('.')}`);
                    return;
                }
            }


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
        if (heroTitle) {
            heroTitle.textContent = t.hero.title;
        }

        // Update about section
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            const aboutTitle = aboutSection.querySelector('h2');
            if (aboutTitle) aboutTitle.textContent = t.about.title;
            
            const whoami = aboutSection.querySelector('h3');
            if (whoami) whoami.textContent = t.about.whoami;
            
            const descriptions = aboutSection.querySelectorAll('p[data-i18n^="about.description"]');
            descriptions.forEach((desc, index) => {
                const key = `about.description${index + 1}`;
                if (t.about[`description${index + 1}`]) {
                    desc.textContent = t.about[`description${index + 1}`];
                }
            });
            
            const skillsTitle = aboutSection.querySelector('.skills-title');
            if (skillsTitle) skillsTitle.textContent = t.about.skills;
        }
        
        // Update projects section
        const projectsTitle = document.querySelector('.projects-title');
        if (projectsTitle) projectsTitle.textContent = t.projects.title;
        
        // Update footer
        const footerRights = document.querySelector('.footer-rights');
        if (footerRights) footerRights.textContent = t.footer.rights;
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
