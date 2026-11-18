import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations/gsap';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUIStore } from '@/stores/uiStore';

export function CustomCursor() {
  const mounted = useHasMounted();
  const isFinePointer = useMediaQuery('(pointer: fine)');
  const reducedMotion = useReducedMotion();

  const cursorVariant = useUIStore((s) => s.cursorVariant);
  const cursorLabel = useUIStore((s) => s.cursorLabel);
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const enabled = mounted && isFinePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.body.classList.add('has-custom-cursor');

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    const show = () => {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    };

    const hide = () => {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const onMove = (e: MouseEvent) => {
      show();
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labeledEl = target.closest<HTMLElement>('[data-cursor-label]');
      if (labeledEl) {
        const label = labeledEl.getAttribute('data-cursor-label');
        setCursor('magnetic', label);
        return;
      }

      const interactive = target.closest('a, button, [role="button"]');
      if (interactive) {
        setCursor('pointer', null);
        return;
      }

      resetCursor();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', hide);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', hide);
    };
  }, [enabled, setCursor, resetCursor]);

  if (!enabled) return null;

  const isExpanded = cursorVariant === 'magnetic' || cursorVariant === 'pointer';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-[width,height,border-color,background-color] duration-200 ease-out will-change-transform flex items-center justify-center rounded-full border"
        style={{
          width: cursorLabel ? 72 : isExpanded ? 44 : 28,
          height: cursorLabel ? 72 : isExpanded ? 44 : 28,
          borderColor: cursorLabel
            ? 'rgba(32, 96, 255, 0.75)'
            : isExpanded
              ? 'rgba(17, 17, 17, 0.65)'
              : 'rgba(17, 17, 17, 0.25)',
          backgroundColor: cursorLabel ? 'rgba(255, 255, 255, 0.94)' : 'transparent',
        }}
      >
        {cursorLabel ? (
          <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#164CE0] uppercase">
            {cursorLabel}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2060FF] opacity-0 will-change-transform"
      />
    </div>
  );
}

