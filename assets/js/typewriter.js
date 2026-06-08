// Typewriter effect for dynamic role display
class Typewriter {
  constructor(elementId, words, typingSpeed = 100, deletingSpeed = 50, delayBetween = 2000) {
    this.element = document.getElementById(elementId);
    if (!this.element) return;

    this.words = words;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.delayBetween = delayBetween;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.timeoutId = null;

    this.type();
  }

  type() {
    const currentWord = this.words[this.wordIndex];
    const displayedText = this.isDeleting
      ? currentWord.substring(0, this.charIndex - 1)
      : currentWord.substring(0, this.charIndex + 1);

    this.element.textContent = displayedText;
    this.element.style.borderRight = '2px solid rgba(199, 112, 240, 0.8)';

    let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      // Word is complete, wait before deleting
      speed = this.delayBetween;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      // Word is deleted, move to next word
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      speed = 500; // Pause before starting new word
    } else {
      this.charIndex += this.isDeleting ? -1 : 1;
    }

    this.timeoutId = setTimeout(() => this.type(), speed);
  }

  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const roles = [
    'Product Strategist',
    'AI Automation Engineer',
    'Business Researcher',
    'Technical Builder'
  ];

  new Typewriter('typewriter-text', roles, 80, 40, 2000);
});
