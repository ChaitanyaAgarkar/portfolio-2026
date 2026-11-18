import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { gsap, ensureGsapRegistered } from '@/lib/animations/gsap';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { sphereSynth } from '@/lib/audio/sphereSynth';
import { useUIStore } from '@/stores/uiStore';

const INTRO_SESSION_KEY = 'ca_digital_dimension_tudum_v3';

const SPECTRUM_RIBBONS = [
  '#2060FF',
  '#4F46E5',
  '#F8FAFC',
  '#FF4060',
  '#FFCC00',
  '#20FFA0',
  '#2060FF',
  '#FF4060',
];

export function Loader() {
  const mounted = useHasMounted();
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  const introSkipped = useUIStore((s) => s.introSkipped);
  const setIntroSkipped = useUIStore((s) => s.setIntroSkipped);
  const spheresReady = useUIStore((s) => s.spheresReady);

  const [active, setActive] = useState(false);
  const [minBeatDone, setMinBeatDone] = useState(false);
  const [progress, setProgress] = useState(14);
  const [soundPlayed, setSoundPlayed] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const reticleRef = useRef<SVGSVGElement | null>(null);
  const sphereLeftRef = useRef<SVGCircleElement | null>(null);
  const sphereRightRef = useRef<SVGCircleElement | null>(null);
  const sphereTopRef = useRef<SVGCircleElement | null>(null);
  const shockwaveRef = useRef<HTMLDivElement | null>(null);
  const monogramRef = useRef<HTMLDivElement | null>(null);
  const ribbonsRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const dismissedRef = useRef(false);

  const isHomeRoute = location.pathname === '/';
  const readyToReveal = !isHomeRoute || spheresReady;

  const finishIntro = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Ignore storage errors
    }
    setActive(false);
    setIntroSkipped(true);
  }, [setIntroSkipped]);

  const triggerSignatureSound = useCallback(() => {
    if (soundPlayed) return;
    sphereSynth.unlock();
    const played = sphereSynth.playStartupSignature();
    if (played) {
      setSoundPlayed(true);
    }
  }, [soundPlayed]);

  useEffect(() => {
    if (!mounted) return;
    if (reducedMotion || introSkipped) {
      dismissedRef.current = true;
      setActive(false);
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === '1';
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen) {
      dismissedRef.current = true;
      setActive(false);
      return;
    }

    setActive(true);
  }, [mounted, reducedMotion, introSkipped]);

  // Choreographed graphic-designer sequence: 3 spheres collide -> shockwave -> <C/> -> <Chaieeetanya/>
  useEffect(() => {
    if (!active || !overlayRef.current) return;
    ensureGsapRegistered();

    triggerSignatureSound();

    const state = { pct: 14 };
    // Fail-safe guarantee: intro never stalls even if WebGL/WebGPU is unavailable or throttled
    const hardFailsafe = window.setTimeout(finishIntro, 3600);

    const ctx = gsap.context(() => {
      const ribbonNodes = ribbonsRef.current?.querySelectorAll<HTMLElement>('[data-ribbon-bar]');
      const tl = gsap.timeline();

      // Continuous slow orbital rotation on telemetry reticle
      if (reticleRef.current) {
        gsap.to(reticleRef.current, {
          rotation: 120,
          duration: 4,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

      // Phase 1 ("tu"): 3 sculpted vector spheres converge from triad points to dead center
      if (sphereLeftRef.current && sphereRightRef.current && sphereTopRef.current) {
        tl.fromTo(
          sphereLeftRef.current,
          { attr: { cx: 34, cy: 138 }, opacity: 0, scale: 0.45 },
          {
            attr: { cx: 100, cy: 100 },
            opacity: 1,
            scale: 1,
            duration: 0.34,
            ease: 'power3.in',
          },
          0,
        )
          .fromTo(
            sphereRightRef.current,
            { attr: { cx: 166, cy: 138 }, opacity: 0, scale: 0.45 },
            {
              attr: { cx: 100, cy: 100 },
              opacity: 1,
              scale: 1,
              duration: 0.34,
              ease: 'power3.in',
            },
            0,
          )
          .fromTo(
            sphereTopRef.current,
            { attr: { cx: 100, cy: 26 }, opacity: 0, scale: 0.45 },
            {
              attr: { cx: 100, cy: 100 },
              opacity: 1,
              scale: 1,
              duration: 0.34,
              ease: 'power3.in',
            },
            0,
          )
          .to(
            [sphereLeftRef.current, sphereRightRef.current, sphereTopRef.current],
            {
              opacity: 0,
              scale: 1.5,
              duration: 0.16,
              ease: 'power2.out',
            },
            0.34,
          );
      }

      // Phase 2 ("dum"): Concentric chromatic shockwave + <C/> stamp impact
      if (shockwaveRef.current) {
        tl.fromTo(
          shockwaveRef.current,
          { scale: 0.25, opacity: 0.95 },
          { scale: 2.35, opacity: 0, duration: 0.68, ease: 'expo.out' },
          0.33,
        );
      }

      tl.fromTo(
        monogramRef.current,
        { scale: 0.6, opacity: 0, rotation: -6 },
        { scale: 1.08, opacity: 1, rotation: 0, duration: 0.26, ease: 'back.out(2)' },
        0.34,
      )
        .to(
          monogramRef.current,
          {
            scale: 0.96,
            duration: 0.14,
            ease: 'power2.inOut',
          },
          0.6,
        )
        .to(
          monogramRef.current,
          {
            scale: 1.04,
            duration: 0.24,
            ease: 'power2.out',
          },
          0.74,
        )
        .to(
          state,
          {
            pct: 86,
            duration: 1.05,
            ease: 'power2.out',
            onUpdate: () => setProgress(Math.round(state.pct)),
          },
          0,
        );

      // Prismatic vertical light ribbons burst on impact
      if (ribbonNodes?.length) {
        tl.fromTo(
          ribbonNodes,
          { scaleY: 0.1, opacity: 0 },
          {
            scaleY: 1,
            opacity: 0.85,
            duration: 0.52,
            stagger: { each: 0.035, from: 'center' },
            ease: 'power3.out',
          },
          0.35,
        ).to(
          ribbonNodes,
          {
            scaleX: 2.4,
            opacity: 0,
            duration: 0.48,
            stagger: { each: 0.03, from: 'edges' },
            ease: 'power2.inOut',
          },
          0.86,
        );
      }

      // Phase 3: Crisp architectural unfold of <Chaieeetanya/> wordmark + edition subtitle
      tl.fromTo(
        wordmarkRef.current,
        { y: 16, opacity: 0, letterSpacing: '0.36em' },
        {
          y: 0,
          opacity: 1,
          letterSpacing: '-0.02em',
          duration: 0.58,
          ease: 'power3.out',
        },
        0.58,
      )
        .fromTo(
          taglineRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.44, ease: 'power2.out' },
          0.74,
        )
        .call(() => {
          setMinBeatDone(true);
        });
    }, overlayRef);

    return () => {
      window.clearTimeout(hardFailsafe);
      ctx.revert();
    };
  }, [active, finishIntro, triggerSignatureSound]);

  // Sequence Final Reveal: Hold until 3D spheres render their first frame, then crisp iris dissolve
  useEffect(() => {
    if (!active || !minBeatDone || !readyToReveal || !overlayRef.current) return;

    setProgress(100);
    const exitCtx = gsap.context(() => {
      gsap.to(overlayRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.46,
        delay: 0.1,
        ease: 'power2.inOut',
        onComplete: finishIntro,
      });
    }, overlayRef);

    return () => exitCtx.revert();
  }, [active, minBeatDone, readyToReveal, finishIntro]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio and 3D WebGPU scene"
      onPointerDown={triggerSignatureSound}
      className="fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-[#0B0B0F] px-5 py-7 text-white sm:px-12 sm:py-10"
    >
      {/* Swiss graphic grid & radial darkroom vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(32,96,255,0.2),rgba(255,64,96,0.12)_38%,transparent_72%)]"
      />

      {/* Swiss editorial corner registration crop marks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 left-4 h-3 w-3 border-t border-l border-white/25 sm:top-7 sm:left-7"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-4 h-3 w-3 border-t border-r border-white/25 sm:top-7 sm:right-7"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-white/25 sm:bottom-7 sm:left-7"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 bottom-4 h-3 w-3 border-r border-b border-white/25 sm:right-7 sm:bottom-7"
      />

      {/* Prismatic vertical light ribbons */}
      <div
        ref={ribbonsRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 px-6 sm:gap-5"
      >
        {SPECTRUM_RIBBONS.map((color, idx) => (
          <span
            key={idx}
            data-ribbon-bar
            className="h-[68vh] w-2 origin-center rounded-full opacity-0 blur-[1px] sm:w-3.5"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
            }}
          />
        ))}
      </div>

      {/* Top studio header bar */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#2060FF]" />
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#60A5FA] uppercase sm:text-xs">
            00 // THE DIGITAL DIMENSION
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerSignatureSound();
            }}
            aria-label="Play startup signature sound"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-[10px] font-medium tracking-wider text-white/80 uppercase transition-colors hover:border-[#2060FF] hover:text-white"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
            <span className="hidden sm:inline">{soundPlayed ? 'Studio Audio' : 'Tap Sound'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finishIntro();
            }}
            className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 font-mono text-[11px] font-medium tracking-wider text-white uppercase transition-colors hover:border-[#FF4060] hover:bg-white/15"
          >
            Skip Intro
          </button>
        </div>
      </div>

      {/* Center Kinetic Typography & Sculptural Sphere Collision Stage */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
          {/* Concentric orbital reticle & 3 colliding specular spheres */}
          <svg
            ref={reticleRef}
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <radialGradient id="loader-cobalt" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="50%" stopColor="#2060FF" />
                <stop offset="100%" stopColor="#0F172A" />
              </radialGradient>
              <radialGradient id="loader-crimson" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="50%" stopColor="#FF4060" />
                <stop offset="100%" stopColor="#4C0519" />
              </radialGradient>
              <radialGradient id="loader-pearl" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>
            </defs>

            <circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <circle
              cx="100"
              cy="100"
              r="62"
              fill="none"
              stroke="rgba(96,165,250,0.22)"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="8"
              x2="100"
              y2="24"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="176"
              x2="100"
              y2="192"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />

            <circle ref={sphereLeftRef} cx="34" cy="138" r="14" fill="url(#loader-cobalt)" />
            <circle ref={sphereRightRef} cx="166" cy="138" r="14" fill="url(#loader-crimson)" />
            <circle ref={sphereTopRef} cx="100" cy="26" r="12" fill="url(#loader-pearl)" />
          </svg>

          {/* Collision chromatic shockwave ring */}
          <div
            ref={shockwaveRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-24 w-24 rounded-full border-2 border-[#60A5FA]/80 opacity-0 shadow-[0_0_32px_rgba(32,96,255,0.65)]"
          />

          {/* <C/> Monogram Seal */}
          <div
            ref={monogramRef}
            aria-hidden="true"
            className="relative flex h-24 w-24 items-center justify-center opacity-0 sm:h-28 sm:w-28"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2060FF]/50 via-[#FF4060]/35 to-transparent blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/25 bg-[#12131B]/95 shadow-2xl sm:h-24 sm:w-24">
              <span className="font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                <span className="text-[#2060FF]">&lt;</span>
                <span>C</span>
                <span className="text-[#FF4060]">/&gt;</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p
            ref={wordmarkRef}
            className="font-mono text-2xl font-bold tracking-tight text-white opacity-0 sm:text-4xl lg:text-5xl"
          >
            <span className="text-[#2060FF]">&lt;</span>
            <span>Chaieeetanya</span>
            <span className="text-[#FF4060]">/&gt;</span>
          </p>
          <p
            ref={taglineRef}
            className="mt-3 font-mono text-[10px] tracking-[0.22em] text-white/65 uppercase opacity-0 sm:text-xs"
          >
            CHAITANYA AGARKAR // ENGINEERING BEYOND INTERFACES
          </p>
        </div>
      </div>

      {/* Bottom 3D Spheres Initialization Telemetry Bar */}
      <div className="relative z-10 mx-auto w-full max-w-md space-y-2">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">
          <span>
            {readyToReveal ? '3D PHYSICS STAGE READY' : 'INITIALIZING 3D SPHERES & PHYSICS'}
          </span>
          <span className="font-semibold text-white">{progress}%</span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#2060FF] via-[#FF4060] to-[#FFCC00] transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
