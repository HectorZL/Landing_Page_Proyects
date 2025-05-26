// Supported image formats in order of preference
const SUPPORTED_FORMATS = ['webp', 'png', 'jpg', 'jpeg'];

// Function to check if an image exists
async function findImageFormat(projectName, imagePath) {
    // Try the exact path first
    const exists = await checkImageExists(imagePath);
    if (exists) return imagePath;
    
    // If not found, try with different extensions
    const basePath = imagePath.substring(0, imagePath.lastIndexOf('.')) || imagePath;
    
    for (const format of SUPPORTED_FORMATS) {
        const imgPath = `${basePath}.${format}`;
        const exists = await checkImageExists(imgPath);
        if (exists) return imgPath;
    }
    return null; // No valid image found
}

// Function to check if an image exists
function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            console.log(`Image loaded successfully: ${url}`);
            resolve(true);
        };
        img.onerror = () => {
            console.log(`Failed to load image: ${url}`);
            resolve(false);
        };
        img.src = url;
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize all carousels on the page
    const carousels = Array.from(document.querySelectorAll('.project-carousel'));
    
    // Wait for all carousels to be initialized
    await Promise.all(carousels.map(initCarousel));
    
    async function initCarousel(carousel) {
        const projectName = carousel.dataset.project;
        if (!projectName) return;
        
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const dots = Array.from(carousel.querySelectorAll('.dot'));
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const carouselContainer = carousel.querySelector('.carousel-container');
        
        // Hide controls initially
        if (prevBtn) prevBtn.style.opacity = '0';
        if (nextBtn) nextBtn.style.opacity = '0';
        
        // Show/hide controls on hover
        carousel.addEventListener('mouseenter', () => {
            if (prevBtn) prevBtn.style.opacity = '1';
            if (nextBtn) nextBtn.style.opacity = '1';
        });
        
        carousel.addEventListener('mouseleave', () => {
            if (prevBtn) prevBtn.style.opacity = '0';
            if (nextBtn) nextBtn.style.opacity = '0';
        });
        
        // Load images
        console.log(`Initializing carousel for project: ${projectName}`);
        for (const slide of slides) {
            const img = slide.querySelector('img');
            if (img && img.dataset.src) {
                console.log(`Processing image with data-src: ${img.dataset.src}`);
                const imgPath = await findImageFormat(projectName, img.dataset.src);
                console.log(`Found image path: ${imgPath}`);
                if (imgPath) {
                    img.src = imgPath;
                    console.log(`Set image source to: ${imgPath}`);
                    // Add a class when image is loaded for better transitions
                    img.onload = () => {
                        console.log(`Image loaded successfully: ${imgPath}`);
                        img.classList.add('loaded');
                    };
                    img.onerror = (e) => {
                        console.error(`Error loading image: ${imgPath}`, e);
                    };
                } else {
                    console.warn(`No valid image found for ${projectName}/${img.dataset.src}`);
                }
            } else {
                console.warn('Image or data-src attribute missing in slide:', slide);
            }
        }
        
        let currentSlide = 0;
        const slideCount = slides.length;
        
        // Set initial active slide
        updateCarousel();
        
        // Auto-advance carousel every 5 seconds
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause auto-advancement on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                updateCarousel();
                resetInterval();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                resetInterval();
            });
        });
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        }
        
        function updateCarousel() {
            // Update slides
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Update track position
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum swipe distance in pixels
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - go to previous slide
                    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                } else {
                    // Swipe left - go to next slide
                    currentSlide = (currentSlide + 1) % slideCount;
                }
                updateCarousel();
                resetInterval();
            }
        }
    }
});
