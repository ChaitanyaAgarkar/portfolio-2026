import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SECTION_ROUTE_MAP } from '@/data/navigation';
import { PROFILE } from '@/data/profile';
import { ensureGsapRegistered, gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { sphereSynth } from '@/lib/audio/sphereSynth';
import { SPHERE_ACCENTS, useUIStore } from '@/stores/uiStore';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SpheresHeroCanvas } from '@/components/three/SpheresHeroCanvas';

const ACCENT_NAMES = ['Cobalt', 'Crimson', 'Solar', 'Mint'] as const;

export function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroAccentIndex = useUIStore((s) => s.heroAccentIndex);
  const cycleHeroAccent = useUIStore((s) => s.cycleHeroAccent);
  const activeAccent = SPHERE_ACCENTS[heroAccentIndex];
  const [soundMuted, setSoundMuted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-stagger]', {
        y: 18,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      navigate(SECTION_ROUTE_MAP[id] || '/');
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    sphereSynth.setMuted(nextMuted);
    if (!nextMuted) {
      sphereSynth.playAccentShift(heroAccentIndex);
    }
  };

  const handleCycleAccent = () => {
    const nextIdx = (heroAccentIndex + 1) % SPHERE_ACCENTS.length;
    sphereSynth.unlock();
    sphereSynth.playAccentShift(nextIdx);
    cycleHeroAccent();
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction and Professional Overview"
      onPointerDown={() => sphereSynth.unlock()}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#EEEEEE] pt-24 pb-16 sm:pt-28 sm:pb-20"
    >
      {/* Full-bleed transparent 3D physics spheres canvas unified seamlessly with studio background */}
      <div className="absolute inset-0 z-0">
        <SpheresHeroCanvas className="h-full w-full" />
      </div>

      {/* Subtle scrim ensuring effortless copy legibility when spheres scatter behind copy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#EEEEEE] via-[#EEEEEE]/82 to-transparent lg:inset-y-0 lg:right-auto lg:w-[56%] lg:bg-gradient-to-r lg:from-[#EEEEEE] lg:via-[#EEEEEE]/85 lg:to-transparent"
      />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="min-w-0 lg:col-span-6">
            <div data-hero-stagger className="flex max-w-full flex-wrap items-center gap-2.5 sm:gap-3">
              <span className="pointer-events-auto inline-flex max-w-full items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#111111] uppercase shadow-xs transition-transform duration-200 hover:-translate-y-0.5 hover:border-black/25 hover:shadow-sm sm:px-3.5 sm:text-[11px] sm:tracking-[0.16em]">
                <span
                  className="h-2 w-2 rounded-full transition-colors"
                  style={{ backgroundColor: activeAccent }}
                  aria-hidden="true"
                />
                {PROFILE.availability}
              </span>
              <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/95 px-3 py-1 font-mono text-xs font-medium text-[#444444] shadow-xs transition-transform duration-200 hover:-translate-y-0.5 hover:border-black/25 hover:shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-[#164CE0]" aria-hidden="true" />
                {PROFILE.shortLocation}
              </span>
            </div>

            <p
              data-hero-stagger
              className="typo-eyebrow pointer-events-auto mt-7 font-mono text-xs font-semibold tracking-[0.22em] text-[#164CE0] uppercase sm:text-sm"
            >
              {PROFILE.heroDesignation}
            </p>

            <h1
              data-hero-stagger
              aria-label={PROFILE.name.toUpperCase()}
              className="pointer-events-auto mt-3 w-fit font-display text-4xl leading-[0.98] font-bold tracking-[-0.03em] text-[#111111] sm:text-6xl lg:text-7xl"
            >
              {PROFILE.name
                .toUpperCase()
                .split(' ')
                .map((word, wordIdx, arr) => (
                  <span key={`${word}-${wordIdx}`}>
                    <span className="inline-block whitespace-nowrap">
                      {Array.from(word).map((char, charIdx) => (
                        <span key={`${wordIdx}-${charIdx}`} className="typo-hero-char">
                          {char}
                        </span>
                      ))}
                    </span>
                    {wordIdx < arr.length - 1 ? ' ' : null}
                  </span>
                ))}
            </h1>

            <p
              data-hero-stagger
              className="mt-5 max-w-xl text-base leading-relaxed font-normal text-[#333333] sm:mt-6 sm:text-2xl sm:leading-snug"
            >
              &ldquo;{PROFILE.heroStatement}&rdquo;
            </p>

            <p
              data-hero-stagger
              className="mt-5 hidden font-mono text-xs font-medium tracking-wider text-[#555555] sm:block sm:text-sm"
            >
              {PROFILE.coreStackSummary}
            </p>

            <div
              data-hero-stagger
              className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3.5"
            >
              <MagneticButton
                variant="primary"
                cursorLabel="EXPLORE"
                onClick={() => scrollToSection('work')}
                className="px-6 py-3.5 font-mono text-xs tracking-[0.14em] uppercase"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowDownRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </MagneticButton>

              <MagneticButton
                variant="secondary"
                cursorLabel="CONNECT"
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3.5 font-mono text-xs tracking-[0.14em] uppercase"
              >
                <span>LET&apos;S CONNECT</span>
              </MagneticButton>
            </div>

            <div
              data-hero-stagger
              className="pointer-events-auto mt-8 flex flex-wrap items-center gap-5 border-t border-black/10 pt-6"
            >
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="OPEN"
                className="group hover-underline-slide inline-flex items-center gap-2 pb-1 font-mono text-xs font-medium tracking-wider text-[#444444] uppercase transition-colors hover:text-[#111111]"
              >
                <Github
                  className="h-4 w-4 text-[#111111] transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>GitHub</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="OPEN"
                className="group hover-underline-slide inline-flex items-center gap-2 pb-1 font-mono text-xs font-medium tracking-wider text-[#444444] uppercase transition-colors hover:text-[#111111]"
              >
                <Linkedin
                  className="h-4 w-4 text-[#164CE0] transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>LinkedIn</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <span className="hidden h-3 w-px bg-black/15 sm:inline-block" aria-hidden="true" />

              <span className="hidden font-mono text-[11px] text-[#555555] sm:inline">
                Press{' '}
                <kbd className="rounded border border-black/15 bg-white px-1.5 py-0.5 font-semibold text-[#111111]">
                  Ctrl+K
                </kbd>{' '}
                for CMD
              </span>
            </div>
          </div>

          <div className="pointer-events-none flex min-h-[165px] min-w-0 items-end justify-center sm:justify-end lg:col-span-6 lg:min-h-[480px]">
            <div className="pointer-events-auto inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/90 px-3.5 py-2 shadow-xs backdrop-blur-sm transition-all duration-200 hover:border-black/25 hover:bg-white hover:shadow-sm sm:rounded-full sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#444444]">
                <Sparkles className="h-3.5 w-3.5 text-[#164CE0]" aria-hidden="true" />
                <span className="hidden lg:inline">Hover to scatter · Click canvas for palette</span>
                <span className="lg:hidden">Tap spheres to scatter</span>
              </span>

              <span className="h-3.5 w-px bg-black/12" aria-hidden="true" />

              <button
                type="button"
                onClick={handleCycleAccent}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#EEEEEE] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#111111] transition-all duration-200 hover:scale-105 hover:border-black/30"
                aria-label={`Cycle 3D sphere accent color (current: ${ACCENT_NAMES[heroAccentIndex]})`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/15"
                  style={{ backgroundColor: activeAccent }}
                  aria-hidden="true"
                />
                <span>{ACCENT_NAMES[heroAccentIndex]}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleSound}
                aria-pressed={!soundMuted}
                aria-label={soundMuted ? 'Unmute sphere physics sound' : 'Mute sphere physics sound'}
                className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#111111] transition-all duration-200 hover:scale-105 hover:border-[#2060FF]/50 hover:text-[#164CE0]"
              >
                {soundMuted ? (
                  <VolumeX className="h-3 w-3 text-[#BE123C]" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-3 w-3 text-[#164CE0]" aria-hidden="true" />
                )}
                <span>{soundMuted ? 'Muted' : 'Sound'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
