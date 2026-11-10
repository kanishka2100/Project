// FlavorShift AI — Editorial Culinary Background Canvas Engine
// Features:
// 1. Organic rising aroma steam trails (soft bezier curves undulating upward)
// 2. Minimalist botanical silhouettes (delicate basil leaves, spice star anise, citrus wheel segments)
// 3. Fluid cursor reaction (particles and steam waves gently swirl around cursor)
// 4. Subtle click flavor ripples and ambient watercolor lighting

(function () {
  'use strict';

  let canvas, ctx;
  let width, height;
  let particles = [];
  let steamTrails = [];
  let aromaRipples = [];
  let animId = null;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cursor tracking with smoothed physics
  const cursor = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 160,
    active: false
  };

  // Sophisticated Culinary Color Palette for Canvas
  const PALETTE = {
    sage: '#879B76',
    forest: '#263D32',
    terracotta: '#C87957',
    peach: '#F2D5C4',
    beige: '#E9DFC9',
    espresso: '#302820',
  };

  // ========================================================
  // 1. AROMA STEAM TRAILS (Soft bezier curves rising organically)
  // ========================================================
  class SteamTrail {
    constructor(x) {
      this.init(x);
    }

    init(x) {
      this.baseX = x !== undefined ? x : Math.random() * width;
      this.y = height + Math.random() * 80;
      this.length = Math.random() * 220 + 260;
      this.speed = Math.random() * 0.45 + 0.35;
      this.frequency = Math.random() * 0.015 + 0.008;
      this.amplitude = Math.random() * 35 + 20;
      this.phase = Math.random() * Math.PI * 2;
      this.width = Math.random() * 2.5 + 1.2;
      this.opacity = Math.random() * 0.14 + 0.06;
      this.deflectX = 0;
    }

    update() {
      if (prefersReducedMotion) return;
      this.y -= this.speed;
      this.phase += this.frequency;

      // Deflect around cursor
      if (cursor.active) {
        const dx = this.baseX - cursor.x;
        const dy = (this.y - this.length * 0.5) - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < cursor.radius && dist > 1) {
          const force = (cursor.radius - dist) / cursor.radius;
          this.deflectX += (Math.sign(dx) * force * 15 - this.deflectX) * 0.08;
        } else {
          this.deflectX *= 0.95;
        }
      } else {
        this.deflectX *= 0.95;
      }

      if (this.y + this.length < -50) {
        this.init();
      }
    }

    draw(ctx, isDark) {
      ctx.save();
      const currentX = this.baseX + this.deflectX;
      
      const grad = ctx.createLinearGradient(currentX, this.y, currentX, this.y - this.length);
      const alpha = isDark ? this.opacity * 1.3 : this.opacity;
      
      if (isDark) {
        grad.addColorStop(0, `rgba(242, 213, 196, 0)`);
        grad.addColorStop(0.35, `rgba(242, 213, 196, ${alpha})`);
        grad.addColorStop(0.7, `rgba(233, 223, 201, ${alpha * 0.7})`);
        grad.addColorStop(1, `rgba(135, 155, 118, 0)`);
      } else {
        grad.addColorStop(0, `rgba(200, 121, 87, 0)`);
        grad.addColorStop(0.35, `rgba(200, 121, 87, ${alpha})`);
        grad.addColorStop(0.7, `rgba(233, 223, 201, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(135, 155, 118, 0)`);
      }

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';

      const startY = this.y;
      const endY = this.y - this.length;

      const cp1X = currentX + Math.sin(this.phase) * this.amplitude;
      const cp1Y = startY - this.length * 0.35;
      const cp2X = currentX - Math.sin(this.phase + 1.2) * (this.amplitude * 0.8);
      const cp2Y = startY - this.length * 0.7;

      ctx.moveTo(currentX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, currentX + Math.sin(this.phase * 0.7) * 15, endY);
      ctx.stroke();

      ctx.restore();
    }
  }

  // ========================================================
  // 2. BOTANICAL INGREDIENT SILHOUETTES
  // (Minimal vector basil leaves, anise stars, citrus segments)
  // ========================================================
  class BotanicalParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 40;
      this.type = Math.floor(Math.random() * 4); // 0: Basil, 1: Star Anise, 2: Citrus Segment, 3: Peppercorn
      this.size = Math.random() * 14 + 12;
      this.scale = Math.random() * 0.4 + 0.7;

      this.baseVx = (Math.random() - 0.5) * 0.25;
      this.baseVy = -(Math.random() * 0.35 + 0.15);
      this.vx = this.baseVx;
      this.vy = this.baseVy;

      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.008;

      this.opacity = Math.random() * 0.22 + 0.18;
      this.colorType = Math.floor(Math.random() * 3); // Sage, Terracotta, Beige
    }

    update() {
      if (prefersReducedMotion) return;
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.angularSpeed;

      this.vx += (this.baseVx - this.vx) * 0.04;
      this.vy += (this.baseVy - this.vy) * 0.04;

      // Cursor interaction
      if (cursor.active) {
        const dx = this.x - cursor.x;
        const dy = this.y - cursor.y;
        const dist = Math.hypot(dx, dy);

        if (dist < cursor.radius && dist > 1) {
          const force = (cursor.radius - dist) / cursor.radius;
          const angle = Math.atan2(dy, dx);
          const push = force * (1.6 + cursor.speed * 0.06);

          this.vx += Math.cos(angle) * push;
          this.vy += Math.sin(angle) * push;
          this.angularSpeed += (Math.random() - 0.5) * 0.02 * force;
        }
      }

      if (this.y < -50 || this.x < -60 || this.x > width + 60) {
        this.reset(false);
      }
    }

    draw(ctx, isDark) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(this.scale, this.scale);

      let strokeColor, fillColor;
      if (this.colorType === 0) {
        strokeColor = isDark ? 'rgba(154, 178, 135, 0.45)' : 'rgba(135, 155, 118, 0.40)';
        fillColor = isDark ? 'rgba(154, 178, 135, 0.12)' : 'rgba(135, 155, 118, 0.10)';
      } else if (this.colorType === 1) {
        strokeColor = isDark ? 'rgba(214, 136, 102, 0.45)' : 'rgba(200, 121, 87, 0.38)';
        fillColor = isDark ? 'rgba(214, 136, 102, 0.12)' : 'rgba(200, 121, 87, 0.09)';
      } else {
        strokeColor = isDark ? 'rgba(233, 223, 201, 0.40)' : 'rgba(233, 223, 201, 0.55)';
        fillColor = isDark ? 'rgba(233, 223, 201, 0.08)' : 'rgba(233, 223, 201, 0.15)';
      }

      ctx.lineWidth = 1.3;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;

      const s = this.size;

      if (this.type === 0) {
        // Minimalist Basil Leaf
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.7, -s * 0.4, s * 0.7, s * 0.5, 0, s);
        ctx.bezierCurveTo(-s * 0.7, s * 0.5, -s * 0.7, -s * 0.4, 0, -s);
        ctx.fill();
        ctx.stroke();

        // Central leaf vein
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.75);
        ctx.lineTo(0, s * 0.75);
        ctx.stroke();
      } else if (this.type === 1) {
        // Star Anise (6-pointed floral spice)
        ctx.beginPath();
        const rays = 6;
        for (let i = 0; i < rays; i++) {
          const rot = (i * Math.PI) / 3;
          const rx = Math.cos(rot) * s;
          const ry = Math.sin(rot) * s;
          ctx.moveTo(0, 0);
          ctx.lineTo(rx, ry);
          ctx.arc(rx * 0.85, ry * 0.85, 2.5, 0, Math.PI * 2);
        }
        ctx.stroke();
      } else if (this.type === 2) {
        // Citrus Wheel Segment
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.9, -0.6, 0.6);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, s * 0.65, -0.5, 0.5);
        ctx.stroke();
      } else {
        // Delicate Coriander/Spice Seed
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // ========================================================
  // 3. CLICK AROMA RIPPLES (Culinary fragrance burst)
  // ========================================================
  class AromaRipple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 8;
      this.maxRadius = 180;
      this.opacity = 0.55;
      this.growth = 4.2;
    }

    update() {
      this.radius += this.growth;
      this.opacity *= 0.94;
    }

    draw(ctx, isDark) {
      if (this.opacity <= 0.02) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark
        ? `rgba(214, 136, 102, ${this.opacity})`
        : `rgba(200, 121, 87, ${this.opacity})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      if (this.radius > 30) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(154, 178, 135, ${this.opacity * 0.6})`
          : `rgba(135, 155, 118, ${this.opacity * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
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

    // Populate Steam Trails (spaced across width)
    const steamCount = Math.max(4, Math.min(Math.floor(width / 220), 8));
    steamTrails = [];
    for (let i = 0; i < steamCount; i++) {
      const stepX = (width / steamCount) * i + Math.random() * 50;
      steamTrails.push(new SteamTrail(stepX));
    }

    // Populate Botanical Particles (tastefully sparse, non-distracting)
    const botanicalCount = Math.max(8, Math.min(Math.floor(width / 60), 22));
    particles = [];
    for (let i = 0; i < botanicalCount; i++) {
      particles.push(new BotanicalParticle());
    }

    // Cursor tracking
    window.addEventListener('mousemove', (e) => {
      cursor.active = true;
      cursor.targetX = e.clientX;
      cursor.targetY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      cursor.active = false;
    });

    // Touch support for tablets/mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        cursor.active = true;
        cursor.targetX = e.touches[0].clientX;
        cursor.targetY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      cursor.active = false;
    });

    // Click culinary ripple
    window.addEventListener('pointerdown', (e) => {
      aromaRipples.push(new AromaRipple(e.clientX, e.clientY));
      if (aromaRipples.length > 6) aromaRipples.shift();

      // Gently nudge botanical particles
      particles.forEach(p => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 200 && dist > 1) {
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * 5;
          p.vy += Math.sin(angle) * 5;
        }
      });
    }, { passive: true });

    // Handle tab visibility to pause when inactive (0% battery drain)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
      } else {
        if (!animId) animId = requestAnimationFrame(render);
      }
    });

    animId = requestAnimationFrame(render);
  }

  function render() {
    if (!ctx) return;

    // Smooth cursor interpolation
    if (cursor.x === -1000) {
      cursor.x = cursor.targetX;
      cursor.y = cursor.targetY;
    } else {
      cursor.vx = (cursor.targetX - cursor.x) * 0.2;
      cursor.vy = (cursor.targetY - cursor.y) * 0.2;
      cursor.x += cursor.vx;
      cursor.y += cursor.vy;
      cursor.speed = Math.hypot(cursor.vx, cursor.vy);
    }

    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Ambient Ethereal Cursor Glow Halo
    if (cursor.active && cursor.x > 0 && cursor.y > 0) {
      ctx.save();
      const haloGrad = ctx.createRadialGradient(
        cursor.x, cursor.y, 0,
        cursor.x, cursor.y, cursor.radius * 1.4
      );
      if (isDark) {
        haloGrad.addColorStop(0, 'rgba(214, 136, 102, 0.08)');
        haloGrad.addColorStop(0.5, 'rgba(154, 178, 135, 0.03)');
        haloGrad.addColorStop(1, 'rgba(27, 44, 36, 0)');
      } else {
        haloGrad.addColorStop(0, 'rgba(200, 121, 87, 0.07)');
        haloGrad.addColorStop(0.5, 'rgba(242, 213, 196, 0.03)');
        haloGrad.addColorStop(1, 'rgba(250, 247, 240, 0)');
      }
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // 1. Render Steam Trails (Rising Background Layer)
    for (let i = 0; i < steamTrails.length; i++) {
      steamTrails[i].update();
      steamTrails[i].draw(ctx, isDark);
    }

    // 2. Render Aroma Ripples (Click waves)
    for (let i = aromaRipples.length - 1; i >= 0; i--) {
      const ripple = aromaRipples[i];
      ripple.update();
      ripple.draw(ctx, isDark);
      if (ripple.opacity <= 0.02) {
        aromaRipples.splice(i, 1);
      }
    }

    // 3. Render Botanical Particles (Minimal vector leaves & spice)
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx, isDark);
    }

    animId = requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
