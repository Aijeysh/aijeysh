"use client";

import { useEffect, useRef } from "react";

/**
 * HeroCursorGlow
 * Renders a radial gradient that follows the cursor inside the hero section.
 * Progressively enhanced — does nothing on touch devices.
 */
export function HeroCursorGlow() {
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const hero = glow?.closest(".hero-band") as HTMLElement | null;
    if (!glow || !hero) return;

    let raf: number;

    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        glow.style.left = `${e.clientX - rect.left}px`;
        glow.style.top = `${e.clientY - rect.top}px`;
        glow.style.opacity = "1";
      });
    };

    const handleLeave = () => {
      glow.style.opacity = "0";
    };

    hero.addEventListener("mousemove", handleMove);
    hero.addEventListener("mouseleave", handleLeave);

    return () => {
      hero.removeEventListener("mousemove", handleMove);
      hero.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={glowRef} className="hero-cursor-glow" aria-hidden="true" />;
}

/**
 * ScrollHeader
 * Adds a scrolled class to the header after a threshold.
 */
export function ScrollHeader() {
  useEffect(() => {
    const header = document.querySelector(".site-header") as HTMLElement | null;
    if (!header) return;

    const handler = () => {
      if (window.scrollY > 24) {
        header.classList.add("site-header--scrolled");
      } else {
        header.classList.remove("site-header--scrolled");
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();

    return () => window.removeEventListener("scroll", handler);
  }, []);

  return null;
}

/**
 * MagneticButton wrapper
 * Applies a subtle magnetic pull effect on hover.
 */
export function MagneticWrap({
  children,
  strength = 0.35,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const handleLeave = () => {
      el.style.transform = "translate(0,0)";
      el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
    };

    const handleEnter = () => {
      el.style.transition = "transform 0.15s ease";
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return <div ref={ref} style={{ display: "inline-block" }}>{children}</div>;
}
