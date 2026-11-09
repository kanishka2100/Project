// FlavorShift AI — Interactive Food & Aroma Particle Canvas Engine
// Renders physics-driven floating culinary ingredients and volatile aroma rings
// that react dynamically to cursor movement, speed, and clicks.

(function () {
  'use strict';

  let canvas, ctx;
  let width, height;
  let particles = [];
  let aromaRipples = [];

  // Mouse & Touch Tracking
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    prevX: -1000,
    prevY: -1000,
    speed: 0,
    radius: 140,
    isHovering: false
  };

  // Culinary Particle Archetypes
  const FOOD_GLYPHS = ['🌿', '🌰', '🥑', '🧀', '🍄', '🍅', '🌶️', '🍋', '🧄', '🧈'];
  const AROMA_COLORS_LIGHT = [
    'rgba(255, 107, 53, 0.25)',  // Saffron Orange
    'rgba(245, 158, 11, 0.25)',  // Golden Amber
    'rgba(16, 185, 129, 0.22)',  // Basil Emerald
    'rgba(244, 63, 94, 0.20)',   // Berry Rose
    'rgba(139, 92, 246, 0.18)'   // Truffle Violet
  ];
  const AROMA_COLORS_DARK = [
    'rgba(251, 146, 60, 0.35)',
    'rgba(251, 191, 36, 0.35)',
    'rgba(52, 211, 153, 0.30)',
    'rgba(251, 113, 133, 0.28)',
    'rgba(167, 139, 250, 0.25)'
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 18 + 14; // Font size or circle radius
      this.isGlyph = Math.random() > 0.45; // 55% food emojis, 45% aroma molecular rings
      this.glyph = FOOD_GLYPHS[Math.floor(Math.random() * FOOD_GLYPHS.length)];
      
      // Drifting Physics
      this.baseVx = (Math.random() - 0.5) * 0.4;
      this.baseVy = -(Math.random() * 0.4 + 0.2); // Gentle upward convection drift
      this.vx = this.baseVx;
      this.vy = this.baseVy;

      // Rotation
      this.angle = Math.random() * Math.PI * 2;
      this.vAngle = (Math.random() - 0.5) * 0.015;

      // Pulse / Wave parameters
      this.phase = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.opacity = Math.random() * 0.45 + 0.25;

      this.colorIndex = Math.floor(Math.random() * AROMA_COLORS_LIGHT.length);
    }

    update(isDark) {
      // Natural floating wobble
      this.phase += this.pulseSpeed;
      this.x += this.vx + Math.sin(this.phase) * 0.3;
      this.y += this.vy;
      this.angle += this.vAngle;

      // Dampen velocity back to base convection
      this.vx += (this.baseVx - this.vx) * 0.04;
      this.vy += (this.baseVy - this.vy) * 0.04;

      // Cursor Reaction (Magnetism & Repulsion Wave)
      if (mouse.isHovering) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Repel outward with velocity boost proportional to cursor speed
          const push = force * (1.8 + mouse.speed * 0.08);
          this.vx += Math.cos(angle) * push;
          this.vy += Math.sin(angle) * push;
          this.vAngle += (Math.random() - 0.5) * 0.08 * force;
        }
      }

      // Recycle when off-screen
      if (this.y < -40 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw(ctx, isDark) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const colors = isDark ? AROMA_COLORS_DARK : AROMA_COLORS_LIGHT;
      const baseColor = colors[this.colorIndex];

      if (this.isGlyph) {
        ctx.globalAlpha = isDark ? this.opacity * 0.85 : this.opacity * 0.7;
        ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.glyph, 0, 0);
      } else {
        // Volatile Aroma Compound Molecular Ring
        const ringRadius = this.size * 0.65;
        ctx.globalAlpha = this.opacity * 0.8;
        
        // Outer glowing ring
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner nucleus dot
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Click Aroma Ripple Wave
  class AromaRipple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 5;
      this.maxRadius = 160;
      this.opacity = 0.6;
      this.growth = 4.5;
    }

    update() {
      this.radius += this.growth;
      this.opacity *= 0.95;
    }

    draw(ctx, isDark) {
      if (this.opacity <= 0.02) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark
        ? `rgba(251, 146, 60, ${this.opacity})`
        : `rgba(255, 107, 53, ${this.opacity})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function init() {
    canvas = document.getElementById('food-cursor-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Populate particles based on screen width
    const count = Math.min(Math.floor(width / 32), 48);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // Cursor tracking
    window.addEventListener('mousemove', (e) => {
      mouse.isHovering = true;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.isHovering = false;
    });

    // Touch support for tablets and mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        mouse.isHovering = true;
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.isHovering = false;
    });

    // Click flavor burst ripple
    window.addEventListener('pointerdown', (e) => {
      aromaRipples.push(new AromaRipple(e.clientX, e.clientY));
      if (aromaRipples.length > 8) aromaRipples.shift();

      // Scatter nearby particles on click
      particles.forEach(p => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 1) {
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * 7;
          p.vy += Math.sin(angle) * 7;
        }
      });
    }, { passive: true });

    requestAnimationFrame(renderLoop);
  }

  function renderLoop() {
    if (!ctx) return;

    // Smooth cursor interpolation and speed calculation
    if (mouse.prevX === -1000) {
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    } else {
      mouse.x += (mouse.targetX - mouse.x) * 0.25;
      mouse.y += (mouse.targetY - mouse.y) * 0.25;
      const moveDist = Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY);
      mouse.speed = moveDist;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    }

    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Ambient Cursor Aroma Halo Light
    if (mouse.isHovering && mouse.x > 0 && mouse.y > 0) {
      ctx.save();
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, mouse.radius * 1.3
      );
      if (isDark) {
        gradient.addColorStop(0, 'rgba(251, 146, 60, 0.12)');
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.05)');
        gradient.addColorStop(1, 'rgba(15, 17, 21, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 107, 53, 0.10)');
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.04)');
        gradient.addColorStop(1, 'rgba(255, 251, 245, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // Draw and update aroma ripples
    for (let i = aromaRipples.length - 1; i >= 0; i--) {
      const ripple = aromaRipples[i];
      ripple.update();
      ripple.draw(ctx, isDark);
      if (ripple.opacity <= 0.02) {
        aromaRipples.splice(i, 1);
      }
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update(isDark);
      p.draw(ctx, isDark);
    }

    requestAnimationFrame(renderLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
