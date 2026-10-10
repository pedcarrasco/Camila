import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  symbol: string;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

const ICONS = ['🌹', '💖', '✨', '🐾', '🌸', '🧸', '💕', '🌷'];

export const triggerCelebration = () => {
  // Multiphase kawaii celebration confetti with hearts, roses and golden sparkles
  const end = Date.now() + 3.5 * 1000;
  const colors = ['#FF4D6D', '#FF758F', '#FFB3C1', '#FFCCD5', '#FFF0F3', '#FFD166'];

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
      ticks: 200,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
      ticks: 200,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

export const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial particles
    const particleCount = Math.min(Math.floor(width / 35), 32);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 14 + 14,
        speedY: Math.random() * 0.7 + 0.4,
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        symbol: ICONS[Math.floor(Math.random() * ICONS.length)],
        opacity: Math.random() * 0.5 + 0.35,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobble += p.wobbleSpeed;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.6;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px -apple-system, BlinkMacSystemFont, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};
