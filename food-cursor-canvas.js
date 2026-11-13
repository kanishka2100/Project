// FlavorShift AI — Interactive Culinary Mouse Graphics & Editorial Background Canvas
// Features:
// 1. HiDPI smooth cursor ring & center marker with hover expansion on buttons/cards
// 2. Spice & herb aroma particle trail emitted along mouse movement
// 3. Click aroma ripples and gentle swirling botanical silhouettes

(function () {
  'use strict';

  let canvas, ctx;
  let width = 0, height = 0, dpr = 1;
  let particles = [];
  let steamTrails = [];
  let aromaRipples = [];
  let mouseSparks = [];
  let animId = null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const cursor = {
    x: -1000,
    y: -1000,
    dotX: -1000,
    dotY: -1000,
    targetX: -1000,
    targetY: -1000,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 150,
    ringRadius: 14,
    targetRingRadius: 14,
    ringAngle: 0,
    hovering: false,
    pressed: false,
    active: false,
    lastSpawnX: -1000,
    lastSpawnY: -1000
  };

  class SteamTrail {
    constructor(x) {
      this.init(x);
    }

    init(x) {
      this.baseX = x !== undefined ? x : Math.random() * width;
      this.y = height + Math.random() * 80;
      this.length = Math.random() * 200 + 220;
      this.speed = Math.random() * 0.4 + 0.3;
      this.frequency = Math.random() * 0.015 + 0.008;
      this.amplitude = Math.random() * 28 + 18;
      this.phase = Math.random() * Math.PI * 2;
      this.width = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.1 + 0.04;
      this.deflectX = 0;
    }

    update() {
      if (prefersReducedMotion) return;
      this.y -= this.speed;
      this.phase += this.frequency;

      if (cursor.active) {
        const dx = this.baseX - cursor.x;
        const dy = (this.y - this.length * 0.5) - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < cursor.radius && dist > 1) {
          const force = (cursor.radius - dist) / cursor.radius;
          this.deflectX += (Math.sign(dx) * force * 16 - this.deflectX) * 0.08;
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
      const alpha = isDark ? this.opacity * 1.25 : this.opacity;

      if (isDark) {
        grad.addColorStop(0, 'rgba(242, 213, 196, 0)');
        grad.addColorStop(0.4, `rgba(242, 213, 196, ${alpha})`);
        grad.addColorStop(1, 'rgba(135, 155, 118, 0)');
      } else {
        grad.addColorStop(0, 'rgba(200, 121, 87, 0)');
        grad.addColorStop(0.4, `rgba(200, 121, 87, ${alpha})`);
        grad.addColorStop(1, 'rgba(135, 155, 118, 0)');
      }

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';
      ctx.moveTo(currentX, this.y);
      ctx.bezierCurveTo(
        currentX + Math.sin(this.phase) * this.amplitude,
        this.y - this.length * 0.35,
        currentX - Math.sin(this.phase + 1.2) * (this.amplitude * 0.8),
        this.y - this.length * 0.7,
        currentX + Math.sin(this.phase * 0.7) * 14,
        this.y - this.length
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  class MouseTrailSpark {
    constructor(x, y, vx, vy) {
      this.x = x + (Math.random() - 0.5) * 8;
      this.y = y + (Math.random() - 0.5) * 8;
      this.vx = vx * 0.18 + (Math.random() - 0.5) * 1.2;
      this.vy = vy * 0.18 - (Math.random() * 1.1 + 0.3);
      this.size = Math.random() * 4 + 2.2;
      this.alpha = 0.85;
      this.decay = Math.random() * 0.025 + 0.022;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.14;
      this.kind = Math.floor(Math.random() * 3); // 0: leaf diamond, 1: spice dot, 2: ring spark
      this.tone = Math.floor(Math.random() * 3); // 0: terracotta, 1: sage, 2: peach/gold
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.angle += this.spin;
      this.alpha -= this.decay;
    }

    draw(ctx, isDark) {
      if (this.alpha <= 0.02) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      let color;
      if (this.tone === 0) {
        color = isDark ? `rgba(214, 136, 102, ${this.alpha})` : `rgba(200, 121, 87, ${this.alpha})`;
      } else if (this.tone === 1) {
        color = isDark ? `rgba(154, 178, 135, ${this.alpha})` : `rgba(110, 130, 93, ${this.alpha})`;
      } else {
        color = isDark ? `rgba(242, 213, 196, ${this.alpha})` : `rgba(195, 135, 85, ${this.alpha})`;
      }

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;

      if (this.kind === 0) {
        // Minimal spice diamond / leaf flick
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.7, 0, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.7, 0, 0, -this.size);
        ctx.fill();
      } else if (this.kind === 1) {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  class BotanicalParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 40;
      this.type = Math.floor(Math.random() * 4);
      this.size = Math.random() * 11 + 10;
      this.scale = Math.random() * 0.35 + 0.65;
      this.baseVx = (Math.random() - 0.5) * 0.22;
      this.baseVy = -(Math.random() * 0.3 + 0.14);
      this.vx = this.baseVx;
      this.vy = this.baseVy;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.008;
      this.colorType = Math.floor(Math.random() * 3);
    }

    update() {
      if (prefersReducedMotion) return;
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.angularSpeed;
      this.vx += (this.baseVx - this.vx) * 0.04;
      this.vy += (this.baseVy - this.vy) * 0.04;

      if (cursor.active) {
        const dx = this.x - cursor.x;
        const dy = this.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < cursor.radius && dist > 1) {
          const force = (cursor.radius - dist) / cursor.radius;
          const angle = Math.atan2(dy, dx);
          const push = force * (1.8 + cursor.speed * 0.07);
          this.vx += Math.cos(angle) * push;
          this.vy += Math.sin(angle) * push;
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
        strokeColor = isDark ? 'rgba(154, 178, 135, 0.38)' : 'rgba(135, 155, 118, 0.34)';
        fillColor = isDark ? 'rgba(154, 178, 135, 0.08)' : 'rgba(135, 155, 118, 0.08)';
      } else if (this.colorType === 1) {
        strokeColor = isDark ? 'rgba(214, 136, 102, 0.36)' : 'rgba(200, 121, 87, 0.32)';
        fillColor = isDark ? 'rgba(214, 136, 102, 0.08)' : 'rgba(200, 121, 87, 0.07)';
      } else {
        strokeColor = isDark ? 'rgba(233, 223, 201, 0.32)' : 'rgba(180, 155, 120, 0.35)';
        fillColor = isDark ? 'rgba(233, 223, 201, 0.05)' : 'rgba(233, 223, 201, 0.1)';
      }

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;
      const s = this.size;

      if (this.type === 0) {
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.7, -s * 0.4, s * 0.7, s * 0.5, 0, s);
        ctx.bezierCurveTo(-s * 0.7, s * 0.5, -s * 0.7, -s * 0.4, 0, -s);
        ctx.fill();
        ctx.stroke();
      } else if (this.type === 1) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const rot = (i * Math.PI) / 3;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(rot) * s, Math.sin(rot) * s);
        }
        ctx.stroke();
      } else if (this.type === 2) {
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.85, -0.6, 0.6);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  class AromaRipple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 8;
      this.opacity = 0.65;
      this.growth = 4.6;
    }

    update() {
      this.radius += this.growth;
      this.opacity *= 0.92;
    }

    draw(ctx, isDark) {
      if (this.opacity <= 0.02) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark
        ? `rgba(214, 136, 102, ${this.opacity})`
        : `rgba(200, 121, 87, ${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (this.radius > 24) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(154, 178, 135, ${this.opacity * 0.65})`
          : `rgba(135, 155, 118, ${this.opacity * 0.65})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    canvas = document.getElementById('food-cursor-canvas');
    if (!canvas || typeof canvas.getContext !== 'function') return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const steamCount = Math.max(4, Math.min(Math.floor(width / 260), 7));
    steamTrails = [];
    for (let i = 0; i < steamCount; i++) {
      steamTrails.push(new SteamTrail((width / steamCount) * i + Math.random() * 40));
    }

    const botanicalCount = Math.max(8, Math.min(Math.floor(width / 80), 16));
    particles = [];
    for (let i = 0; i < botanicalCount; i++) {
      particles.push(new BotanicalParticle());
    }

    if (isFinePointer && !prefersReducedMotion) {
      window.addEventListener('mousemove', (e) => {
        cursor.active = true;
        cursor.targetX = e.clientX;
        cursor.targetY = e.clientY;

        const targetEl = e.target;
        const interactive = targetEl && targetEl.closest && targetEl.closest('button, a, select, input, [role="button"], .editorial-card');
        cursor.hovering = Boolean(interactive);
        cursor.targetRingRadius = cursor.hovering ? 24 : 14;

        const movedDist = Math.hypot(e.clientX - cursor.lastSpawnX, e.clientY - cursor.lastSpawnY);
        if (movedDist > 16) {
          cursor.lastSpawnX = e.clientX;
          cursor.lastSpawnY = e.clientY;
          mouseSparks.push(new MouseTrailSpark(e.clientX, e.clientY, cursor.vx, cursor.vy));
          if (mouseSparks.length > 42) mouseSparks.shift();
        }
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        cursor.active = false;
      });
    }

    window.addEventListener('pointerdown', (e) => {
      if (prefersReducedMotion) return;
      cursor.pressed = true;
      cursor.targetRingRadius = 10;
      aromaRipples.push(new AromaRipple(e.clientX, e.clientY));
      if (aromaRipples.length > 6) aromaRipples.shift();

      for (let k = 0; k < 6; k++) {
        const ang = (Math.PI * 2 * k) / 6 + Math.random() * 0.4;
        mouseSparks.push(new MouseTrailSpark(e.clientX, e.clientY, Math.cos(ang) * 10, Math.sin(ang) * 10));
      }
      if (mouseSparks.length > 48) mouseSparks.splice(0, mouseSparks.length - 48);

      particles.forEach(p => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 1) {
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * 4.5;
          p.vy += Math.sin(angle) * 4.5;
        }
      });
    }, { passive: true });

    window.addEventListener('pointerup', () => {
      cursor.pressed = false;
      cursor.targetRingRadius = cursor.hovering ? 24 : 14;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
      } else if (!animId) {
        animId = requestAnimationFrame(render);
      }
    });

    animId = requestAnimationFrame(render);
  }

  function render() {
    if (!ctx) return;

    if (cursor.active) {
      if (cursor.x === -1000) {
        cursor.x = cursor.dotX = cursor.targetX;
        cursor.y = cursor.dotY = cursor.targetY;
      } else {
        cursor.vx = (cursor.targetX - cursor.x) * 0.22;
        cursor.vy = (cursor.targetY - cursor.y) * 0.22;
        cursor.x += cursor.vx;
        cursor.y += cursor.vy;
        cursor.dotX += (cursor.targetX - cursor.dotX) * 0.55;
        cursor.dotY += (cursor.targetY - cursor.dotY) * 0.55;
        cursor.speed = Math.hypot(cursor.vx, cursor.vy);
        cursor.ringRadius += (cursor.targetRingRadius - cursor.ringRadius) * 0.2;
        cursor.ringAngle += cursor.hovering ? 0.035 : 0.015;
      }
    }

    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Background gentle steam & sparse botanical elements
    for (let i = 0; i < steamTrails.length; i++) {
      steamTrails[i].update();
      steamTrails[i].draw(ctx, isDark);
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx, isDark);
    }

    // Mouse-trail spice & herb sparks
    for (let i = mouseSparks.length - 1; i >= 0; i--) {
      const sp = mouseSparks[i];
      sp.update();
      sp.draw(ctx, isDark);
      if (sp.alpha <= 0.02) mouseSparks.splice(i, 1);
    }

    // Click ripples
    for (let i = aromaRipples.length - 1; i >= 0; i--) {
      const rp = aromaRipples[i];
      rp.update();
      rp.draw(ctx, isDark);
      if (rp.opacity <= 0.02) aromaRipples.splice(i, 1);
    }

    // Interactive Desktop Cursor Ring + Inner Dot + Radial Aura
    if (isFinePointer && cursor.active && cursor.x > -100) {
      ctx.save();

      // Subtle warm glow around cursor
      const glow = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 110);
      if (isDark) {
        glow.addColorStop(0, 'rgba(214, 136, 102, 0.14)');
        glow.addColorStop(0.55, 'rgba(154, 178, 135, 0.05)');
        glow.addColorStop(1, 'rgba(27, 44, 36, 0)');
      } else {
        glow.addColorStop(0, 'rgba(200, 121, 87, 0.13)');
        glow.addColorStop(0.55, 'rgba(242, 213, 196, 0.05)');
        glow.addColorStop(1, 'rgba(250, 247, 240, 0)');
      }
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 110, 0, Math.PI * 2);
      ctx.fill();

      // Segmented rotating outer ring
      ctx.translate(cursor.x, cursor.y);
      ctx.rotate(cursor.ringAngle);
      ctx.strokeStyle = cursor.hovering
        ? (isDark ? 'rgba(242, 213, 196, 0.85)' : 'rgba(200, 121, 87, 0.85)')
        : (isDark ? 'rgba(154, 178, 135, 0.65)' : 'rgba(38, 61, 50, 0.5)');
      ctx.lineWidth = cursor.hovering ? 1.8 : 1.3;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, cursor.ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Inner dot
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(214, 136, 102, 0.9)' : 'rgba(200, 121, 87, 0.9)';
      ctx.beginPath();
      ctx.arc(cursor.dotX, cursor.dotY, cursor.hovering ? 3.5 : 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animId = requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
