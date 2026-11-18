import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Command, Menu, Moon, Sun, X } from 'lucide-react';
import { NAV_LINKS, SECTION_ROUTE_MAP } from '@/data/navigation';
import { PROFILE } from '@/data/profile';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useUIStore((s) => s.activeSection);
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    route: string,
  ) => {
    event.preventDefault();
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      navigate(route || SECTION_ROUTE_MAP[sectionId] || '/');
      return;
    }

    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `/#${sectionId}`);
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-black/10 bg-[#EEEEEE]/90 backdrop-blur-md shadow-xs shadow-black/5'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="group inline-flex items-center gap-2 rounded-lg py-1"
          aria-label={`${PROFILE.name} Home — ${PROFILE.brandTag}`}
        >
          <span className="inline-flex items-center rounded-lg border border-black/12 bg-white px-3 py-1.5 font-mono text-xs font-bold tracking-tight text-[#111111] shadow-xs transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#2060FF] group-hover:shadow-md sm:text-sm">
            <span className="text-[#164CE0] transition-transform duration-200 group-hover:-translate-x-0.5">
              &lt;
            </span>
            <span>Chaieeetanya</span>
            <span className="text-[#BE123C] transition-transform duration-200 group-hover:translate-x-0.5">
              /&gt;
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => {
            const isProjectsRoute = location.pathname.startsWith('/projects');
            const isSectionRoute = location.pathname === item.route;
            const isActive = isProjectsRoute
              ? item.sectionId === 'work'
              : location.pathname !== '/'
                ? isSectionRoute
                : activeSection === item.sectionId;

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.sectionId, item.route)}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'hover-underline-slide relative rounded-md px-3 py-2 font-mono text-xs tracking-wider uppercase transition-colors',
                    isActive ? 'font-semibold text-[#164CE0]' : 'text-[#555555] hover:text-[#111111]',
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-3 bottom-0.5 left-3 h-[2px] rounded-full bg-gradient-to-r from-[#2060FF] to-[#FF4060]"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light studio mode' : 'Obsidian dark mode'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/12 bg-white text-[#111111] shadow-xs transition-colors hover:border-[#2060FF]/60 hover:text-[#164CE0]"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#FFCC00]" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-[#164CE0]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command interface (Ctrl+K)"
            data-cursor-label="CMD"
            className="inline-flex items-center gap-2 rounded-lg border border-black/12 bg-white px-3 py-1.5 font-mono text-xs text-[#444444] shadow-xs transition-colors hover:border-[#2060FF]/60 hover:text-[#111111]"
          >
            <Command className="h-3.5 w-3.5 text-[#164CE0]" aria-hidden="true" />
            <span className="hidden md:inline">CMD</span>
            <kbd className="hidden rounded border border-black/10 bg-[#EEEEEE] px-1.5 py-0.5 text-[10px] text-[#444444] sm:inline">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/12 bg-white text-[#111111] shadow-xs lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
