import { useEffect, useRef } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';

export function ScrollProgress() {
  const mounted = useHasMounted();
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mounted) return;

    let rafId = 0;
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pct})`;
      }
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 left-0 z-[70] h-[2px] bg-black/10"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-[#2060FF] via-[#444444] to-[#FF4060]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
