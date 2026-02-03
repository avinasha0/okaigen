"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#1a6aff",
  "#0d5aeb",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#f43f5e",
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function CelebrationConfetti() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!mounted || !visible) return null;

  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    left: randomBetween(0, 100),
    size: randomBetween(6, 14),
    delay: randomBetween(0, 0.8),
    duration: randomBetween(2, 3.5),
    shape: Math.random() > 0.5 ? "circle" : "square",
    tx: randomBetween(-80, 80)}));

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animation: `confetti-fly ${p.duration}s ease-out ${p.delay}s forwards`,
            "--confetti-tx": `${p.tx}px`} as React.CSSProperties}
        />
      ))}
    </div>
  );
}
