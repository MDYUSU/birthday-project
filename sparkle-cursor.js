// Particle Sparkle Cursor Effect
class SparkleCursor {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.isMouseMoving = false;
        this.mouseMoveTimer = null;
        this.colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98', '#DDA0DD', '#F0E68C'];
        
        this.init();
    }

    init() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Start animation loop
        this.animate();
        
        // Clean up particles periodically
        setInterval(() => this.cleanupParticles(), 2000);
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Clear existing timer
        if (this.mouseMoveTimer) {
            clearTimeout(this.mouseMoveTimer);
        }
        
        // Set mouse as moving
        this.isMouseMoving = true;
        
        // Create particles at mouse position
        if (this.shouldCreateParticle()) {
            this.createParticle(e.clientX, e.clientY);
        }
        
        // Set timer to stop mouse movement detection
        this.mouseMoveTimer = setTimeout(() => {
            this.isMouseMoving = false;
        }, 100);
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }

    shouldCreateParticle() {
        // Calculate distance from last position
        const distance = Math.sqrt(
            Math.pow(this.mouseX - this.lastMouseX, 2) + 
            Math.pow(this.mouseY - this.lastMouseY, 2)
        );
        
        // Create particle if mouse moved enough distance
        return distance > 15; // Adjust for particle density
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'sparkle-particle';
        
        // Random properties
        const size = Math.random() * 6 + 2; // 2-8px
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const duration = 1000 + Math.random() * 500; // 1-1.5 seconds
        const offsetX = (Math.random() - 0.5) * 20; // Random offset
        const offsetY = (Math.random() - 0.5) * 20;
        
        // Set styles
        particle.style.cssText = `
            position: fixed;
            left: ${x + offsetX}px;
            top: ${y + offsetY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 1;
            box-shadow: 0 0 6px ${color}, 0 0 12px ${color};
            transform: translate(-50%, -50%) scale(1);
        `;
        
        // Add to document and particles array
        document.body.appendChild(particle);
        
        const particleData = {
            element: particle,
            x: x + offsetX,
            y: y + offsetY,
            size: size,
            opacity: 1,
            scale: 1,
            createdAt: Date.now(),
            duration: duration
        };
        
        this.particles.push(particleData);
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeParticle(particleData);
        }, duration);
    }

    animate() {
        const currentTime = Date.now();
        
        this.particles.forEach(particle => {
            const age = currentTime - particle.createdAt;
            const progress = age / particle.duration;
            
            if (progress >= 1) {
                this.removeParticle(particle);
                return;
            }
            
            // Fade out and shrink effect
            particle.opacity = Math.max(0, 1 - progress);
            particle.scale = Math.max(0.1, 1 - progress * 0.8);
            
            // Update particle styles
            particle.element.style.opacity = particle.opacity;
            particle.element.style.transform = `translate(-50%, -50%) scale(${particle.scale})`;
            
            // Add floating effect
            const floatY = Math.sin(progress * Math.PI * 2) * 10;
            particle.element.style.top = `${particle.y + floatY}px`;
        });
        
        requestAnimationFrame(() => this.animate());
    }

    removeParticle(particleData) {
        const index = this.particles.indexOf(particleData);
        if (index > -1) {
            this.particles.splice(index, 1);
            if (particleData.element && particleData.element.parentNode) {
                particleData.element.parentNode.removeChild(particleData.element);
            }
        }
    }

    cleanupParticles() {
        // Remove any particles that weren't cleaned up properly
        this.particles = this.particles.filter(particle => {
            const age = Date.now() - particle.createdAt;
            if (age > particle.duration + 1000) { // Extra time buffer
                if (particle.element && particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
                return false;
            }
            return true;
        });
    }
}

// Initialize sparkle cursor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SparkleCursor();
});
