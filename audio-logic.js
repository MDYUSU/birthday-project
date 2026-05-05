// Audio Logic Module for Microphone Blow Detection
class AudioBlowDetector {
    constructor(options = {}) {
        // Configuration options
        this.config = {
            blowThreshold: options.blowThreshold || 0.3,
            requiredConsecutiveReadings: options.requiredConsecutiveReadings || 3,
            onBlowDetected: options.onBlowDetected || (() => {}),
            onDetectionUnavailable: options.onDetectionUnavailable || (() => {}),
            onError: options.onError || (() => {})
        };
        
        // Audio context variables
        this.audioContext = null;
        this.microphone = null;
        this.analyser = null;
        this.dataArray = null;
        this.isListening = false;
        this.consecutiveLoudReadings = 0;
        
        // Bind methods
        this.detectBlow = this.detectBlow.bind(this);
    }
    
    async initialize() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            
            // Configure analyser
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            // Connect microphone to analyser
            this.microphone.connect(this.analyser);
            
            // Start listening for blows
            this.isListening = true;
            this.detectBlow();
            
            console.log("Blow detection initialized successfully!");
            return true;
            
        } catch (error) {
            console.log("Microphone access denied or not available:", error);
            this.config.onDetectionUnavailable(error);
            return false;
        }
    }
    
    detectBlow() {
        if (!this.isListening) return;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        const average = sum / this.dataArray.length;
        const normalizedVolume = average / 255; // Normalize to 0-1
        
        // Check if volume exceeds threshold
        if (normalizedVolume > this.config.blowThreshold) {
            this.consecutiveLoudReadings++;
            
            // Trigger blow effect if we have enough consecutive loud readings
            if (this.consecutiveLoudReadings >= this.config.requiredConsecutiveReadings) {
                this.config.onBlowDetected();
                this.consecutiveLoudReadings = 0; // Reset counter
            }
        } else {
            this.consecutiveLoudReadings = 0; // Reset counter if volume drops
        }
        
        // Continue listening
        requestAnimationFrame(this.detectBlow);
    }
    
    // Update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    // Stop listening
    stop() {
        this.isListening = false;
        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
    
    // Check if microphone is available
    static isMicrophoneAvailable() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioBlowDetector;
}
