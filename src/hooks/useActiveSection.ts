import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

const SECTION_IDS = [
  'home',
  'about',
  'impact',
  'enterprise',
  'work',
  'experience',
  'skills',
  'coding',
  'education',
  'contact',
];

export function useActiveSection(enabled: boolean): void {
  const setActiveSection = useUIStore((s) => s.setActiveSection);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0];
        if (top?.target?.id) {
          const mappedId =
            top.target.id === 'impact' || top.target.id === 'enterprise'
              ? 'work'
              : top.target.id === 'education'
                ? 'coding'
                : top.target.id;
          setActiveSection(mappedId);
        }
      },
      {
        rootMargin: '-32% 0px -45% 0px',
        threshold: [0.1, 0.25, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled, setActiveSection]);
}

