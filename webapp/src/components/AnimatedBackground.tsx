"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { 
      x: number; y: number; radius: number; 
      vx: number; vy: number; 
      alpha: number; twinkleSpeed: number; twinkleDir: number;
      isShootingStar: boolean;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000); 
      for (let i = 0; i < numParticles; i++) {
        const isShootingStar = Math.random() > 0.99; // 1% chance for a shooting star
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: isShootingStar ? Math.random() * 1.5 + 0.8 : Math.random() * 1.2 + 0.1,
          vx: isShootingStar ? (Math.random() + 0.5) * 3 : (Math.random() - 0.5) * 0.15, 
          vy: isShootingStar ? (Math.random() + 0.5) * 3 : (Math.random() - 0.5) * 0.15,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: isShootingStar ? 0 : (Math.random() * 0.015 + 0.005),
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          isShootingStar
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Twinkle effect (only for regular stars)
        if (!p.isShootingStar) {
          p.alpha += p.twinkleSpeed * p.twinkleDir;
          if (p.alpha >= 1) {
            p.alpha = 1;
            p.twinkleDir = -1;
          } else if (p.alpha <= 0.1) {
            p.alpha = 0.1;
            p.twinkleDir = 1;
          }
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        
        // Add a slight glow to shooting stars
        if (p.isShootingStar) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = "white";
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Interactive Cursor Glow */}
      {mounted && (
        <div
          className="fixed inset-0 z-[-5] transition-opacity duration-300 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 157, 0.1), transparent 80%)`,
          }}
        />
      )}

      <div className="fixed inset-0 -z-50 bg-[#04070D] overflow-hidden pointer-events-none">
        {/* 1. Starry Night Canvas with Twinkling & Shooting Stars */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-80"></canvas>

        {/* 2. Northern Lights / Aurora Borealis Bands */}
        {/* Deep Purple/Indigo Base */}
        <div className="absolute top-[-10%] right-[-20%] w-[120vw] h-[60vh] bg-gradient-to-bl from-[#7a00ff]/20 via-[#00e1ff]/10 to-transparent mix-blend-screen filter blur-[100px] opacity-70 animate-aurora-2 rounded-[100%] origin-top-right z-1"></div>
        
        {/* Vibrant Emerald/Teal Sweep */}
        <div className="absolute top-[-20%] left-[-10%] w-[130vw] h-[55vh] bg-gradient-to-br from-[#00ff9d]/25 via-[#00e1ff]/15 to-transparent mix-blend-screen filter blur-[110px] opacity-80 animate-aurora-1 rounded-[100%] origin-top-left z-1"></div>
        
        {/* Central Bright Cyan Highlight */}
        <div className="absolute top-[5%] left-[5%] w-[90vw] h-[35vh] bg-gradient-to-r from-transparent via-[#00ff9d]/20 to-transparent mix-blend-screen filter blur-[80px] opacity-90 animate-aurora-3 rounded-[100%] origin-center z-1"></div>

        {/* 3. Infinite Diagonal Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_80%,transparent_100%)] animate-grid-flow z-2"></div>

        {/* 4. Cinematic Noise Filter */}
        <div 
          className="absolute inset-0 z-3 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>

        {/* 5. Edge Vignette Overlay */}
        <div className="absolute inset-0 z-4 bg-[radial-gradient(ellipse_at_center,transparent_20%,#04070D_130%)]"></div>
      </div>
    </>
  );
}
