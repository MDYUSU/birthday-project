// Simple Bestie Trivia - Disabled Version
// This file is kept for compatibility but doesn't show any quiz

class BestieTriviaQuiz {
    constructor() {
        // No quiz functionality - just initialize
        this.init();
    }
    
    init() {
        // Do nothing - let the letter show normally
        console.log('Bestie Trivia Quiz disabled - letter will show normally');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BestieTriviaQuiz();
});
