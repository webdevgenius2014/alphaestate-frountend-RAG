"use client";

import { useEffect, useRef } from "react";
import { COLORS, WEIGHTS } from "@/app/constant";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    rgb: string;
    opacity: number;
}


function pickColor() {
    const r = Math.random();
    if (r < WEIGHTS[0]) return COLORS[0];
    if (r < WEIGHTS[0] + WEIGHTS[1]) return COLORS[1];
    return COLORS[2];
}

export const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const spawn = () => {
            const count = Math.max(150, Math.floor((canvas.width * canvas.height) / 4000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.9,
                vy: (Math.random() - 0.5) * 0.9,
                radius: Math.random() * 2.5 + 1,
                rgb: pickColor(),
                opacity: Math.random() * 0.35 + 0.08,
            }));
        };

        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Particles
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.rgb},${p.opacity})`;
                ctx.fill();
            }

            rafId = requestAnimationFrame(tick);
        };

        resize();
        spawn();
        tick();

        const onResize = () => { resize(); spawn(); };
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};
