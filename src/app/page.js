'use client';

import { useEffect } from 'react';
import CertificateVerifier from '@/components/CertificateVerifier';

export default function Home() {
  useEffect(() => {
    // Initialize matrix canvas effect
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01アウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = Array(columns)
      .fill(0)
      .map(() => Math.random() * canvas.height);

    const draw = () => {
      ctx.fillStyle = 'rgba(14, 22, 54, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(24, 188, 233, 0.3)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i]);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
      <CertificateVerifier />
    </div>
  );
}
