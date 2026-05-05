// Dynamic Photo Background System
class PhotoBackground {
    constructor(images = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg','photo4.jpg','photo5.jpg']) {
        this.images = images;
        this.currentIndex = 0;
        this.container = null;
        this.slides = [];
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.createSlides();
        this.startSlideshow();
    }
    
    createContainer() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'photo-background-container';
        document.body.appendChild(this.container);
    }
    
    createSlides() {
        // Create slide elements for each image
        this.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'photo-background-slide';
            slide.style.backgroundImage = `url(${image})`;
            
            // Set first slide as active
            if (index === 0) {
                slide.classList.add('active');
            }
            
            this.container.appendChild(slide);
            this.slides.push(slide);
        });
    }
    
    startSlideshow() {
        // Change image every 3 seconds
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, 3000);
    }
    
    nextSlide() {
        // Hide current slide
        this.slides[this.currentIndex].classList.remove('active');
        
        // Move to next slide
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        
        // Show next slide
        this.slides[this.currentIndex].classList.add('active');
    }
    
    stopSlideshow() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    // Method to update images dynamically
    updateImages(newImages) {
        this.stopSlideshow();
        this.images = newImages;
        this.currentIndex = 0;
        
        // Clear existing slides
        this.container.innerHTML = '';
        this.slides = [];
        
        // Recreate with new images
        this.createSlides();
        this.startSlideshow();
    }
    
    // Method to change opacity dynamically
    setOpacity(opacity) {
        const style = document.createElement('style');
        style.textContent = `.photo-background-slide.active { opacity: ${opacity} !important; }`;
        document.head.appendChild(style);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // You can customize images here if needed
    const photoBackground = new PhotoBackground([
        'photo1.png',
        'photo2.png', 
        'photo3.png',
        'photo4.png',
        'photo5.png'
    ]);
    
    // Make it globally accessible
    window.photoBackground = photoBackground;
});
