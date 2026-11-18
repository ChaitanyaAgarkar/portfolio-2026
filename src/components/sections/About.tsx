import { useEffect, useRef, useState } from 'react';
import { ABOUT_CONTENT } from '@/data/profile';
import { ensureGsapRegistered, gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils/cn';

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [showExtendedCopy, setShowExtendedCopy] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.from('[data-about-reveal]', {
        y: 28,
        opacity: 0,
        duration: 0.72,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const currentStage = ABOUT_CONTENT.evolutionStages[activeStage];

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative z-10 border-t border-black/10 bg-[#EEEEEE] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="about-heading">
          <SectionHeading
            eyebrow={ABOUT_CONTENT.eyebrow}
            title={ABOUT_CONTENT.heading}
          />
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Editorial storytelling column */}
          <div className="min-w-0 space-y-6 lg:col-span-6">
            {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-about-reveal
                className={cn(
                  'leading-relaxed',
                  index === 0
                    ? 'font-display text-2xl font-medium tracking-tight text-[#111111] sm:text-3xl'
                    : cn(
                        'text-base text-[#555555] sm:text-lg',
                        !showExtendedCopy && 'hidden md:block',
                      ),
                )}
              >
                {paragraph}
              </p>
            ))}

            {ABOUT_CONTENT.paragraphs.length > 1 ? (
              <button
                type="button"
                onClick={() => setShowExtendedCopy((prev) => !prev)}
                className="font-mono text-xs font-semibold text-[#164CE0] underline underline-offset-4 md:hidden"
              >
                {showExtendedCopy ? 'Show concise overview' : 'Read full engineering philosophy'}
              </button>
            ) : null}

            <div
              data-about-reveal
              className="mt-8 grid grid-cols-1 gap-4 border-t border-black/10 pt-8 font-mono text-xs sm:grid-cols-3"
            >
              <div>
                <p className="font-semibold text-[#BE123C]">LIFECYCLE</p>
                <p className="mt-1 text-[#111111]">Architecture → CI/CD</p>
              </div>
              <div>
                <p className="font-semibold text-[#164CE0]">FOCUS</p>
                <p className="mt-1 text-[#111111]">Scalable Systems</p>
              </div>
              <div>
                <p className="font-semibold text-[#BE123C]">STANDARD</p>
                <p className="mt-1 text-[#111111]">Maintainable UX</p>
              </div>
            </div>
          </div>

          {/* Interactive Idea -> Architecture -> Production evolution diagram */}
          <div
            data-about-reveal
            className="min-w-0 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8 lg:col-span-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
              <span className="font-mono text-xs tracking-[0.18em] text-[#555555] uppercase">
                ENGINEERING EVOLUTION MODEL
              </span>
              <span className="font-mono text-xs font-semibold text-[#BE123C]">
                STAGE {currentStage.step} / 03
              </span>
            </div>

            {/* Geometric visual metaphor */}
            <div className="my-6 flex items-center justify-center rounded-xl border border-black/10 bg-[#E4E4E4] p-6">
              <svg
                viewBox="0 0 380 170"
                className="h-40 w-full max-w-md"
                role="img"
                aria-label={`Diagram illustrating ${currentStage.phase}: ${currentStage.title}`}
              >
                {/* Connecting structural paths */}
                <line
                  x1="68"
                  y1="85"
                  x2="190"
                  y2="85"
                  stroke={activeStage >= 1 ? '#2060FF' : '#CBD5E1'}
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <line
                  x1="190"
                  y1="85"
                  x2="312"
                  y2="85"
                  stroke={activeStage >= 2 ? '#FF4060' : '#CBD5E1'}
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />

                {/* Stage 01: Idea (Seed point + rings) */}
                <g
                  onClick={() => setActiveStage(0)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="68"
                    cy="85"
                    r={activeStage === 0 ? 30 : 22}
                    fill="#FFFFFF"
                    stroke={activeStage === 0 ? '#FF4060' : '#64748B'}
                    strokeOpacity={activeStage === 0 ? 1 : 0.45}
                    strokeWidth="1.8"
                    className="transition-all duration-300"
                  />
                  <circle
                    cx="68"
                    cy="85"
                    r="6"
                    fill={activeStage === 0 ? '#FF4060' : '#2060FF'}
                  />
                  <text
                    x="68"
                    y="138"
                    textAnchor="middle"
                    fill={activeStage === 0 ? '#111111' : '#555555'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    01 IDEA
                  </text>
                </g>

                {/* Stage 02: Architecture (Structured wireframe lattice) */}
                <g
                  onClick={() => setActiveStage(1)}
                  className="cursor-pointer"
                >
                  <polygon
                    points="190,48 224,67 224,103 190,122 156,103 156,67"
                    fill="#FFFFFF"
                    stroke={activeStage === 1 ? '#2060FF' : '#64748B'}
                    strokeOpacity={activeStage === 1 ? 1 : 0.45}
                    strokeWidth={activeStage === 1 ? '2.2' : '1.4'}
                    className="transition-all duration-300"
                  />
                  <polygon
                    points="190,62 210,73 210,97 190,108 170,97 170,73"
                    fill="none"
                    stroke="#FF4060"
                    strokeOpacity={activeStage === 1 ? 0.95 : 0.35}
                    strokeWidth="1.4"
                  />
                  <text
                    x="190"
                    y="142"
                    textAnchor="middle"
                    fill={activeStage === 1 ? '#111111' : '#555555'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    02 ARCHITECTURE
                  </text>
                </g>

                {/* Stage 03: Production Software (Solid crystalline system) */}
                <g
                  onClick={() => setActiveStage(2)}
                  className="cursor-pointer"
                >
                  <rect
                    x="282"
                    y="55"
                    width="60"
                    height="60"
                    rx="10"
                    fill="#FFFFFF"
                    stroke={activeStage === 2 ? '#FF4060' : '#64748B'}
                    strokeOpacity={activeStage === 2 ? 1 : 0.45}
                    strokeWidth={activeStage === 2 ? '2.2' : '1.4'}
                    className="transition-all duration-300"
                  />
                  <path
                    d="M298 85L307 94L327 74"
                    fill="none"
                    stroke={activeStage === 2 ? '#FF4060' : '#64748B'}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="312"
                    y="138"
                    textAnchor="middle"
                    fill={activeStage === 2 ? '#111111' : '#555555'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    03 PRODUCTION
                  </text>
                </g>
              </svg>
            </div>

            {/* Interactive stage selector tabs */}
            <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Evolution stages">
              {ABOUT_CONTENT.evolutionStages.map((stage, idx) => {
                const selected = idx === activeStage;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveStage(idx)}
                    className={cn(
                      'rounded-lg border px-3 py-2.5 text-left font-mono text-[11px] transition-colors',
                      selected
                        ? 'border-[#FF4060]/60 bg-[#FFF1F2] text-[#111111] shadow-xs'
                        : 'border-black/10 bg-[#EEEEEE] text-[#555555] hover:border-black/25 hover:text-[#111111]',
                    )}
                  >
                    <span className="block text-[10px] font-semibold text-[#BE123C]">{stage.step}</span>
                    <span className="mt-0.5 block truncate font-semibold">{stage.phase}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-black/10 bg-[#EEEEEE] p-5">
              <h3 className="font-display text-lg font-semibold text-[#111111]">
                {currentStage.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#555555]">
                {currentStage.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
