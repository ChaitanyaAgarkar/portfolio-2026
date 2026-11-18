import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Toaster } from 'sonner';
import { ensureGsapRegistered, ScrollTrigger } from '@/lib/animations/gsap';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUIStore } from '@/stores/uiStore';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AppRoutes } from '@/app/router';
import { SeoHead } from '@/components/seo/SeoHead';
import { Navbar } from '@/components/layout/Navbar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Loader } from '@/components/ui/Loader';
import { CommandMenu } from '@/components/ui/CommandMenu';
import { CustomCursor } from '@/components/ui/CustomCursor';

export function App() {
  const location = useLocation();
  const mounted = useHasMounted();
  const reducedMotion = useReducedMotion();
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('ca_theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
      }
    } catch {
      // Ignore storage errors
    }
  }, [setTheme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (!mounted || reducedMotion || isCoarse) return;
    ensureGsapRegistered();

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      autoRaf: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, [mounted, reducedMotion, isCoarse]);

  return (
    <QueryProvider>
      <SeoHead pathname={location.pathname} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollProgress />
      <Loader />
      <Navbar />
      <MobileMenu />

      <main id="main-content" className="relative z-10 focus:outline-none" tabIndex={-1}>
        <AppRoutes />
      </main>

      <Footer />

      {mounted ? (
        <>
          <CommandMenu />
          <CustomCursor />
          <Toaster
            theme={theme}
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-elevated)',
                border: '1px solid var(--hairline)',
                color: 'var(--text-primary)',
              },
            }}
          />
        </>
      ) : null}
    </QueryProvider>
  );
}
