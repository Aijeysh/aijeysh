"use client";

import { useEffect, useRef, ElementType, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "fade" | "scale";
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  as?: ElementType;
}

export function ScrollReveal({
  children,
  className = "",
  variant = "default",
  delay = 0,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const revealClass =
    variant === "fade"
      ? "reveal--fade"
      : variant === "scale"
      ? "reveal--scale"
      : "reveal";

  const staggerClass = delay > 0 ? `stagger-${delay}` : "";

  return (
    <Tag
      ref={ref}
      className={[revealClass, staggerClass, className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
}

/** Wraps a list of children and stagger-reveals each child */
export function StaggerReveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode[];
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={className}>
      {children.map((child, i) => (
        <ScrollReveal key={i} delay={(Math.min(i + 1, 6)) as 1 | 2 | 3 | 4 | 5 | 6}>
          {child}
        </ScrollReveal>
      ))}
    </Tag>
  );
}
