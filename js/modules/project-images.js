// Función para inicializar las imágenes del proyecto
function initializeProjectImages(container) {
    console.log('Inicializando imágenes del proyecto');
    
    const images = container.querySelectorAll('.project-image');
    if (images.length === 0) {
        console.log('No se encontraron imágenes en el contenedor');
        return;
    }
    
    console.log(`Se encontraron ${images.length} imágenes`);
    
    // Asegurarse de que todas las imágenes se muestren correctamente
    images.forEach((img, index) => {
        console.log(`Imagen ${index + 1} cargada:`, img.src);
        
        // Añadir efecto de carga
        img.onload = () => {
            console.log(`Imagen cargada: ${img.src}`);
            img.style.opacity = '1';
        };
        
        // Manejar errores de carga
        img.onerror = () => {
            console.error(`Error al cargar la imagen: ${img.src}`);
            img.style.opacity = '1'; // Mostrar igualmente aunque haya error
        };
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const imageContainers = document.querySelectorAll('.project-images');
    imageContainers.forEach(container => {
        initializeProjectImages(container);
    });
});
