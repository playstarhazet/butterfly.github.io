// Image loading handlers
document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
        img.classList.add('loading');
    }
    
    img.onload = () => img.classList.remove('loading');
    img.onerror = () => {
        img.classList.remove('loading');
        console.error('Failed to load image:', img.src);
    };
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const closeButton = document.querySelector('.close-lightbox');
const prevBtn = lightbox.querySelector('.prev-btn');
const nextBtn = lightbox.querySelector('.next-btn');

// Get all images that can be viewed in lightbox
const images = Array.from(document.querySelectorAll('.photo-grid img, .photo-grid-three img, .hero img, .single-photo img'));
let currentImageIndex = 0;

// Function to show image by index
function showImage(index) {
    currentImageIndex = index;
    const targetImage = images[index];
    lightboxImg.src = targetImage.src;
    lightboxImg.alt = targetImage.alt; // Copy alt text from original image
    
    // Add error handling for image loading
    lightboxImg.onerror = () => {
        console.error('Failed to load image');
        showNotification('Failed to load image');
    };
}

// Function to show next image
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
}

// Function to show previous image
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex);
}

// Add click handlers to all images
images.forEach((img, index) => {
    img.addEventListener('click', () => {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        showImage(index);
    });
});

// Touch handling for swipe
let touchStartX = 0;
let touchEndX = 0;
let touchCount = 0;

lightbox.addEventListener('touchstart', e => {
    touchCount = e.touches.length;
    if (touchCount === 1) { // Only track single touch for swipe
        touchStartX = e.changedTouches[0].screenX;
    }
}, false);

lightbox.addEventListener('touchend', e => {
    if (touchCount === 1) { // Only handle swipe if it was a single touch
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    touchCount = 0;
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // minimum distance for swipe
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swiped left - show next
            showNextImage();
        } else {
            // Swiped right - show previous
            showPrevImage();
        }
    }
}

// Arrow key navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Button click handlers
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

// Close lightbox when clicking outside the image or on close button
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

closeButton.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}); 