// Initialize modal functionality
export function initModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return; // Exit if modal doesn't exist

    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.getElementsByClassName("close-modal")[0];
    const projectImages = document.querySelectorAll('.project-image-container');

    // Function to open modal with the clicked image
    function openModal(imgContainer) {
        const img = imgContainer.querySelector('.project-image');
        if (!img) return;
        
        modal.style.display = "flex";
        setTimeout(() => {
            modal.style.opacity = "1";
        }, 10);
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        document.body.style.overflow = 'hidden';
    }

    // Add click event to all project images
    projectImages.forEach(container => {
        container.onclick = () => openModal(container);
    });

    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.opacity = "0";
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
            document.body.style.overflow = 'auto';
        };
    }

    // Close modal when clicking outside the image
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.opacity = "0";
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
            document.body.style.overflow = 'auto';
        }
    };

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.opacity = "0";
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
            document.body.style.overflow = 'auto';
        }
    });
}
