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
        } catch (error) {
            console.error(`Error loading ${section} section:`, error);
        }
    }

    // Re-initialize any scripts that need to run after content is loaded
    if (window.initTheme) window.initTheme();
    if (window.initI18n) window.initI18n();
    if (window.initMain) window.initMain();
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

// After all sections are loaded, initialize additional scripts
async function initializeScripts() {
    await loadCarouselScript();
    
    // Re-initialize any scripts that need to run after content is loaded
    if (window.initTheme) window.initTheme();
    if (window.initI18n) window.initI18n();
    if (window.initMain) window.initMain();
}

// Modify the loadSections function to use initializeScripts
const originalLoadSections = loadSections;
window.loadSections = async function() {
    await originalLoadSections();
    await initializeScripts();
};

// Export for testing if needed
export { loadSections };
