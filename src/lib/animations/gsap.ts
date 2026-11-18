import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function ensureGsapRegistered(): void {
  if (typeof window === 'undefined' || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function animateRevealGroup(
  container: HTMLElement | null,
  selector: string,
  options?: {
    y?: number;
    stagger?: number;
    duration?: number;
    start?: string;
  },
): gsap.Context | null {
  if (!container || typeof window === 'undefined') return null;
  ensureGsapRegistered();

  if (prefersReducedMotion()) {
    return null;
  }

  const { y = 26, stagger = 0.08, duration = 0.72, start = 'top 84%' } = options ?? {};

  return gsap.context(() => {
    const targets = container.querySelectorAll<HTMLElement>(selector);
    if (!targets.length) return;

    gsap.from(targets, {
      y,
      opacity: 0,
      duration,
      stagger,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: container,
        start,
        once: true,
      },
    });
  }, container);
}

export { gsap, ScrollTrigger };

