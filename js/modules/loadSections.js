// Import modal functionality
import { initModal } from './modal.js';

// Array of sections to load in order
const sections = [
    'header',
    'hero',
    'about',
    'skills',
    'projects',
    'contact',
    'footer'
];

// Function to load sections asynchronously
async function loadSections() {
    const app = document.getElementById('app');
    
    for (const section of sections) {
        try {
            const response = await fetch(`sections/${section}.html`);
            if (!response.ok) {
                console.error(`Failed to load ${section} section:`, response.statusText);
                continue;
            }
            const html = await response.text();
            app.innerHTML += html;
            console.log(`Sección ${section} cargada correctamente`);
        } catch (error) {
            console.error(`Error loading ${section} section:`, error);
        }
    }
    
    // Inicializar scripts adicionales después de cargar todo el contenido
    await initializeScripts();
}

// Start loading sections when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSections);
} else {
    loadSections();
}

// Load carousel script after all sections are loaded
function loadCarouselScript() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'js/modules/carousel.js';
        script.onload = resolve;
        document.body.appendChild(script);
    });
}

// Load project images script after all sections are loaded
function loadProjectImagesScript() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'js/modules/project-images.js';
        script.onload = resolve;
        document.body.appendChild(script);
    });
}

// Function to initialize the carousel
function initializeCarousel() {
    console.log('Inicializando carrusel...');
    
    // Seleccionar elementos del DOM
    const track = document.querySelector('.carousel-track');
    if (!track) {
        console.error('No se encontró el elemento .carousel-track');
        return;
    }
    
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dots = Array.from(document.querySelectorAll('.carousel-indicator'));
    
    // Configuración del carrusel
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Configurar el ancho del track para que quepan todas las diapositivas
    track.style.width = `${slideCount * 100}%`;
    
    // Función para mover el carrusel a una diapositiva específica
    const goToSlide = (index) => {
        // Asegurarse de que el índice esté dentro de los límites
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        // Actualizar el índice actual
        currentSlide = index;
        
        // Mover el track
        track.style.transform = `translateX(-${currentSlide * (100 / slideCount)}%)`;
        
        // Actualizar los indicadores
        updateDots();
    };
    
    // Función para actualizar los indicadores de navegación
    const updateDots = () => {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('current-slide');
            } else {
                dot.classList.remove('current-slide');
            }
        });
    };
    
    // Event Listeners
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
        }
    });
    
    // Navegación por los indicadores
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Inicializar el carrusel
    updateDots();
    
    // Navegación por gestos táctiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
        const swipeThreshold = 50; // Mínimo de píxeles para considerar un deslizamiento
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Deslizamiento hacia la izquierda (siguiente)
                goToSlide(currentSlide + 1);
            } else {
                // Deslizamiento hacia la derecha (anterior)
                goToSlide(currentSlide - 1);
            }
        }
    };
    
    console.log('Carrusel inicializado correctamente');
}

// After all sections are loaded, initialize additional scripts
async function initializeScripts() {
    try {
        console.log('Inicializando scripts adicionales...');
        
        // Initialize theme switcher if it exists
        if (window.initTheme) {
            console.log('Inicializando tema...');
            window.initTheme();
        }
        
        // Initialize i18n if it exists
        if (window.initI18n) {
            console.log('Inicializando i18n...');
            window.initI18n();
        }
        
        // Initialize main scripts if they exist
        if (window.initMain) {
            console.log('Inicializando scripts principales...');
            window.initMain();
        }
        
        // Initialize carousels
        const carousels = document.querySelectorAll('.carousel');
        if (carousels.length > 0) {
            await loadCarouselScript();
            
            // Initialize carousel after a short delay to ensure DOM is ready
            console.log('Inicializando carrusel...');
            setTimeout(() => {
                initializeCarousel();
            }, 500);
        }
        
        // Initialize modal functionality
        initModal();
        
        console.log('Todos los scripts se han inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar los scripts:', error);
    }
}

// Modify the loadSections function to use initializeScripts
const originalLoadSections = loadSections;
window.loadSections = async function() {
    await originalLoadSections();
    await initializeScripts();
};

// Export for testing if needed
export { loadSections };
