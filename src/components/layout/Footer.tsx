import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Radio } from 'lucide-react';
import { NAV_LINKS, SECTION_ROUTE_MAP } from '@/data/navigation';
import { PROFILE } from '@/data/profile';
import { useHasMounted } from '@/hooks/useHasMounted';

export function Footer() {
  const mounted = useHasMounted();
  const [puneTime, setPuneTime] = useState('--:--:-- IST');
  const [pulseCount, setPulseCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const currentYear = mounted ? new Date().getFullYear() : 2026;

  useEffect(() => {
    if (!mounted) return;
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setPuneTime(`${formatted} IST`);
      } catch {
        setPuneTime('IST');
      }
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShortcut = (sectionId: string) => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      navigate(SECTION_ROUTE_MAP[sectionId] || '/');
      return;
    }
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate('/');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <footer className="relative z-10 border-t border-black/10 bg-[#E4E4E4]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex flex-col items-start gap-3">
              <span className="inline-flex items-center rounded-lg border border-black/12 bg-white px-3 py-1.5 font-mono text-sm font-bold text-[#111111] shadow-xs">
                <span className="text-[#164CE0]">&lt;</span>
                <span>Chaieeetanya</span>
                <span className="text-[#BE123C]">/&gt;</span>
              </span>
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-[#111111]">
                  {PROFILE.name}
                </p>
                <p className="font-mono text-xs text-[#555555]">
                  Software Developer · {PROFILE.shortLocation}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm font-mono text-xs font-semibold tracking-[0.16em] text-[#164CE0] uppercase">
              {PROFILE.signature}
            </p>

            {/* Lightweight interactive telemetry node */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-lg border border-black/10 bg-white px-3.5 py-2.5 shadow-xs">
              <button
                type="button"
                onClick={() => setPulseCount((c) => c + 1)}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-medium text-[#111111] transition-colors hover:text-[#164CE0]"
                aria-label="Send interactive telemetry ping"
              >
                <Radio
                  className={`h-3.5 w-3.5 text-[#BE123C] ${pulseCount > 0 ? 'animate-pulse' : ''}`}
                  aria-hidden="true"
                />
                <span>NODE_PUNE</span>
              </button>
              <span className="text-black/20" aria-hidden="true">
                |
              </span>
              <span className="font-mono text-[11px] text-[#555555]">{puneTime}</span>
              {pulseCount > 0 ? (
                <span className="rounded bg-[#2060FF]/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#164CE0]">
                  ACK #{pulseCount}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-8 min-[460px]:grid-cols-2 sm:grid-cols-3 md:col-span-7">
            <div className="min-w-0">
              <h3 className="font-mono text-xs font-semibold tracking-[0.18em] text-[#555555] uppercase">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleShortcut(link.sectionId);
                      }}
                      className="hover-underline-slide inline-block pb-0.5 text-[#444444] transition-colors hover:text-[#111111]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    to="/projects"
                    className="hover-underline-slide inline-block pb-0.5 text-[#444444] transition-colors hover:text-[#164CE0]"
                  >
                    All Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="font-mono text-xs font-semibold tracking-[0.18em] text-[#555555] uppercase">
                Connect
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href={PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover-underline-slide inline-flex items-center gap-1 pb-0.5 text-[#444444] transition-colors hover:text-[#111111]"
                  >
                    GitHub{' '}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li>
                  <a
                    href={PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover-underline-slide inline-flex items-center gap-1 pb-0.5 text-[#444444] transition-colors hover:text-[#111111]"
                  >
                    LinkedIn{' '}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li>
                  <a
                    href={PROFILE.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover-underline-slide inline-flex items-center gap-1 pb-0.5 text-[#444444] transition-colors hover:text-[#111111]"
                  >
                    LeetCode{' '}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li className="min-w-0">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="hover-underline-slide inline-block max-w-full pb-0.5 break-all text-[#444444] transition-colors hover:text-[#164CE0]"
                  >
                    {PROFILE.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="min-w-0 flex flex-col justify-between min-[460px]:col-span-2 sm:col-span-1">
              <div>
                <h3 className="font-mono text-xs font-semibold tracking-[0.18em] text-[#555555] uppercase">
                  Direct Line
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li>
                    <a
                      href={PROFILE.phoneHref}
                      className="text-[#444444] transition-colors hover:text-[#111111]"
                    >
                      {PROFILE.phone}
                    </a>
                  </li>
                  <li className="text-[#555555]">{PROFILE.shortLocation}</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                data-cursor-label="TOP"
                aria-label="Back to top"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg border border-black/12 bg-white px-3.5 py-2 font-mono text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#2060FF]/60 hover:text-[#164CE0]"
              >
                <span>Back to top</span>
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-6 text-xs text-[#555555] sm:flex-row sm:items-center">
          <p>
            © {currentYear} {PROFILE.brandTag} · {PROFILE.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-[#555555]">
            React 19 · TypeScript · Three.js · Rapier · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
