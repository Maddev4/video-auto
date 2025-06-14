import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleCanvasProps {
  className?: string;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  // Performance settings based on device
  const getParticleCount = () => {
    const width = window.innerWidth;
    if (width < 768) return 30; // Mobile
    if (width < 1024) return 50; // Tablet
    return 80; // Desktop
  };

  const colors = [
    'rgba(147, 51, 234, 0.6)', // Purple
    'rgba(59, 130, 246, 0.6)', // Blue
    'rgba(168, 85, 247, 0.4)', // Light purple
    'rgba(99, 102, 241, 0.4)', // Indigo
  ];

  const initParticles = (canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const particleCount = getParticleCount();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    particlesRef.current = particles;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    
    // Create gradient for glow effect
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 2
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright core
    ctx.fillStyle = particle.color.replace('0.6', '0.8').replace('0.4', '0.6');
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const maxDistance = 120;
    const mouseDistance = 150;

    particles.forEach((particle, i) => {
      // Connect particles to each other
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - particle.x;
        const dy = particles[j].y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Connect particles to mouse
      const mouseDx = mouseRef.current.x - particle.x;
      const mouseDy = mouseRef.current.y - particle.y;
      const mouseDistanceActual = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

      if (mouseDistanceActual < mouseDistance) {
        const opacity = (1 - mouseDistanceActual / mouseDistance) * 0.4;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
        ctx.stroke();
        ctx.restore();
      }
    });
  };

  const updateParticles = (canvas: HTMLCanvasElement, particles: Particle[]) => {
    particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse attraction
      const mouseDx = mouseRef.current.x - particle.x;
      const mouseDy = mouseRef.current.y - particle.y;
      const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

      if (mouseDistance < 100) {
        const force = (100 - mouseDistance) / 100 * 0.01;
        particle.vx += mouseDx * force * 0.01;
        particle.vy += mouseDy * force * 0.01;
      }

      // Boundary collision with smooth bounce
      if (particle.x <= 0 || particle.x >= canvas.width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= canvas.height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }

      // Velocity damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Subtle opacity animation
      particle.opacity += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.002;
      particle.opacity = Math.max(0.1, Math.min(0.7, particle.opacity));
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    updateParticles(canvas, particles);
    drawConnections(ctx, particles);
    
    particles.forEach(particle => {
      drawParticle(ctx, particle);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    initParticles(canvas);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  };

  const handleVisibilityChange = () => {
    setIsVisible(!document.hidden);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: -1,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.85) 100%)'
      }}
    />
  );
};

export default ParticleCanvas;