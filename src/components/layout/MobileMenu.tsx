import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail, Moon, Sun, Terminal, X } from 'lucide-react';
import { NAV_LINKS, SECTION_ROUTE_MAP } from '@/data/navigation';
import { PROFILE } from '@/data/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUIStore } from '@/stores/uiStore';

export function MobileMenu() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const reducedMotion = useReducedMotion();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen]);

  const handleNav = (sectionId: string, route?: string) => {
    setOpen(false);
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      navigate(route || SECTION_ROUTE_MAP[sectionId] || '/');
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[75] flex flex-col justify-between bg-[#EEEEEE]/98 px-6 py-6 backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <span className="font-mono text-xs font-semibold tracking-wider text-[#164CE0]">
              NAVIGATION // {PROFILE.brandTag}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close mobile menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/12 bg-white text-[#111111] shadow-xs"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Mobile sections" className="my-auto py-6">
            <ul className="space-y-3">
              {NAV_LINKS.map((item, idx) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(item.sectionId, item.route);
                    }}
                    className="group flex items-baseline justify-between rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-black/10 hover:bg-white"
                  >
                    <span className="font-display text-2xl font-bold tracking-tight text-[#111111] group-hover:text-[#164CE0]">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-[#555555]">0{idx + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4 border-t border-black/10 pt-5">
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleNav('contact', '/contact')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2060FF] px-3 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-sm"
              >
                <Mail className="h-4 w-4" />
                Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setCommandOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/12 bg-white px-3 py-3 font-mono text-xs tracking-wider text-[#111111] uppercase"
              >
                <Terminal className="h-4 w-4 text-[#164CE0]" />
                CMD
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/12 bg-white px-3 py-3 font-mono text-xs tracking-wider text-[#111111] uppercase"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-[#FFCC00]" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-[#164CE0]" />
                    Dark
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#555555]">
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#111111]"
              >
                GitHub <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#111111]"
              >
                LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={PROFILE.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#111111]"
              >
                LeetCode <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
