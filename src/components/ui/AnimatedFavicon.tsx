"use client";

import { useEffect, useRef } from "react";

const BAR_COUNT = 5;
const BAR_WIDTH = 4;
const GAP = 3;
const PADDING = 3;
const CANVAS_SIZE = 32;
const BG_COLOR = "#0a0a0a";
const BAR_COLOR = "#EF4444";

export default function AnimatedFavicon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    linkRef.current =
      document.querySelector('link[rel="icon"]') ||
      document.querySelector('link[rel="shortcut icon"]');

    if (!linkRef.current) {
      const link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
      linkRef.current = link;
    }

    const totalWidth = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * GAP + PADDING * 2;
    const offsetX = Math.floor((CANVAS_SIZE - totalWidth) / 2);
    const maxHeight = CANVAS_SIZE - PADDING * 2;

    let phase = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const heights: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        heights.push(
          Math.sin(phase + i * 1.2) * 0.4 +
            Math.sin(phase * 1.7 + i * 0.8) * 0.3 +
            0.5
        );
      }

      ctx.fillStyle = BAR_COLOR;
      for (let i = 0; i < BAR_COUNT; i++) {
        const h = Math.max(4, heights[i] * maxHeight);
        const x = offsetX + i * (BAR_WIDTH + GAP);
        const y = CANVAS_SIZE - PADDING - h;
        ctx.fillRect(x, y, BAR_WIDTH, h);
      }

      linkRef.current!.href = canvas.toDataURL("image/png");
      phase += 0.12;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      style={{ display: "none" }}
    />
  );
}
