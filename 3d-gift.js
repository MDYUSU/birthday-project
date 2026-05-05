// 3D Birthday Gift/Balloon using Three.js
class BirthdayGift3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.gift = null;
        this.balloon = null;
        this.ribbons = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(300, 300);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add renderer to page
        const container = document.getElementById('3d-gift-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
        
        // Create lights
        this.createLights();
        
        // Create 3D objects
        this.createGiftBox();
        this.createBalloon();
        this.createRibbons();
        
        // Add mouse interaction
        this.addMouseInteraction();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation
        this.animate();
    }
    
    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light for shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // Point light for sparkle effect
        const pointLight = new THREE.PointLight(0xff69b4, 0.5, 10);
        pointLight.position.set(0, 2, 2);
        this.scene.add(pointLight);
    }
    
    createGiftBox() {
        // Gift box geometry
        const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: 0xff69b4,
            specular: 0x222222,
            shininess: 100,
        });
        
        this.gift = new THREE.Mesh(boxGeometry, boxMaterial);
        this.gift.position.y = -0.5;
        this.gift.castShadow = true;
        this.gift.receiveShadow = true;
        this.scene.add(this.gift);
        
        // Add ribbon around the box
        const ribbonGeometry = new THREE.BoxGeometry(1.6, 0.1, 1.6);
        const ribbonMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            specular: 0x222222,
            shininess: 100,
        });
        
        // Horizontal ribbon
        const horizontalRibbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        horizontalRibbon.position.y = 0;
        horizontalRibbon.castShadow = true;
        this.gift.add(horizontalRibbon);
        
        // Vertical ribbon
        const verticalRibbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        verticalRibbon.rotation.z = Math.PI / 2;
        verticalRibbon.position.y = 0;
        verticalRibbon.castShadow = true;
        this.gift.add(verticalRibbon);
        
        // Bow on top
        this.createBow();
    }
    
    createBow() {
        const bowGroup = new THREE.Group();
        
        // Bow loops
        const bowGeometry = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
        const bowMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            specular: 0x222222,
            shininess: 100,
        });
        
        const leftLoop = new THREE.Mesh(bowGeometry, bowMaterial);
        leftLoop.position.set(-0.3, 0.9, 0);
        leftLoop.rotation.z = Math.PI / 6;
        leftLoop.castShadow = true;
        bowGroup.add(leftLoop);
        
        const rightLoop = new THREE.Mesh(bowGeometry, bowMaterial);
        rightLoop.position.set(0.3, 0.9, 0);
        rightLoop.rotation.z = -Math.PI / 6;
        rightLoop.castShadow = true;
        bowGroup.add(rightLoop);
        
        // Center knot
        const knotGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const knotMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            specular: 0x222222,
            shininess: 100,
        });
        
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        knot.position.set(0, 0.9, 0);
        knot.castShadow = true;
        bowGroup.add(knot);
        
        this.gift.add(bowGroup);
    }
    
    createBalloon() {
        // Balloon geometry
        const balloonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const balloonMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b8a,
            specular: 0x222222,
            shininess: 100,
            transparent: true,
            opacity: 0.9,
        });
        
        this.balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
        this.balloon.position.set(2, 1, 0);
        this.balloon.castShadow = true;
        this.scene.add(this.balloon);
        
        // Balloon string
        const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
        const stringMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
        
        const balloonString = new THREE.Mesh(stringGeometry, stringMaterial);
        balloonString.position.set(2, -0.5, 0);
        this.scene.add(balloonString);
    }
    
    createRibbons() {
        // Create floating ribbons
        const ribbonColors = [0xff69b4, 0xffd700, 0x6a4c93, 0xff6b8a];
        
        for (let i = 0; i < 5; i++) {
            const ribbonGeometry = new THREE.BoxGeometry(0.05, 2, 0.1);
            const ribbonMaterial = new THREE.MeshPhongMaterial({
                color: ribbonColors[i % ribbonColors.length],
                specular: 0x222222,
                shininess: 100,
                transparent: true,
                opacity: 0.8,
            });
            
            const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
            ribbon.position.set(
                (Math.random() - 0.5) * 4,
                Math.random() * 2 - 1,
                (Math.random() - 0.5) * 2
            );
            ribbon.rotation.x = Math.random() * Math.PI;
            ribbon.rotation.y = Math.random() * Math.PI;
            ribbon.castShadow = true;
            
            this.ribbons.push(ribbon);
            this.scene.add(ribbon);
        }
    }
    
    addMouseInteraction() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Calculate target rotation based on mouse position
            this.targetRotationY = this.mouseX * 0.5;
            this.targetRotationX = this.mouseY * 0.3;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth rotation interpolation
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;
        
        // Apply rotations
        if (this.gift) {
            this.gift.rotation.y = this.currentRotationY;
            this.gift.rotation.x = this.currentRotationX;
        }
        
        // Floating animation for balloon
        if (this.balloon) {
            this.balloon.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.2;
            this.balloon.rotation.y += 0.01;
        }
        
        // Floating ribbons
        this.ribbons.forEach((ribbon, index) => {
            ribbon.rotation.y += 0.02 * (index % 2 === 0 ? 1 : -1);
            ribbon.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });
        
        // Auto-rotation when no mouse interaction
        if (Math.abs(this.mouseX) < 0.1 && Math.abs(this.mouseY) < 0.1) {
            if (this.gift) {
                this.gift.rotation.y += 0.005;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        // Keep renderer size fixed for the small container
        this.renderer.setSize(300, 300);
    }
}

// Initialize 3D gift when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE !== 'undefined') {
        new BirthdayGift3D();
    } else {
        console.warn('Three.js not loaded. Please include Three.js library.');
    }
});
