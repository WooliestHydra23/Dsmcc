// Particle animation system inspired by react-tsparticles
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = 'rgba(199, 112, 240, ' + this.opacity + ')'; // Purple with opacity
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off walls
    if (this.x > this.canvas.width) this.x = 0;
    if (this.x < 0) this.x = this.canvas.width;
    if (this.y > this.canvas.height) this.y = 0;
    if (this.y < 0) this.y = this.canvas.height;

    // Fade in/out
    this.opacity += (Math.random() - 0.5) * 0.01;
    this.opacity = Math.max(0.1, Math.min(0.6, this.opacity));
    this.color = 'rgba(199, 112, 240, ' + this.opacity + ')';
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ParticleSystem {
  constructor(canvasId, particleCount = 100) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = particleCount;
    this.animationId = null;

    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Create particles
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }

    // Start animation
    this.animate();

    // Click to spawn particles
    this.canvas.addEventListener('click', (e) => this.spawnParticles(e));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnParticles(event) {
    const x = event.clientX;
    const y = event.clientY;

    for (let i = 0; i < 5; i++) {
      const particle = new Particle(this.canvas);
      particle.x = x;
      particle.y = y;
      particle.speedX = (Math.random() - 0.5) * 2;
      particle.speedY = (Math.random() - 0.5) * 2;
      this.particles.push(particle);
    }

    // Keep particle count reasonable
    if (this.particles.length > this.particleCount * 2) {
      this.particles = this.particles.slice(-this.particleCount);
    }
  }

  animate() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(12, 5, 19, 0.1)'; // Slight fade effect
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    for (let particle of this.particles) {
      particle.update();
      particle.draw(this.ctx);
    }

    // Draw connections between nearby particles
    this.drawConnections();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawConnections() {
    const connectionDistance = 100;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.2;
          this.ctx.strokeStyle = 'rgba(199, 112, 240, ' + opacity + ')';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particle-canvas', 120);
});
