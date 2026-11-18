import '@testing-library/jest-dom/vitest';
import { afterAll, vi } from 'vitest';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });

  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();

  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
}

afterAll(() => {
  try {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    ScrollTrigger.clearMatchMedia();
  } catch {
    // Ignore if ScrollTrigger was not registered in non-DOM test files
  }
});
