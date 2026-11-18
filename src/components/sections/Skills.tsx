import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/skills';
import { ensureGsapRegistered, gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/stores/uiStore';

const NODE_POSITIONS = [
  { x: 50, y: 12 },
  { x: 84, y: 27 },
  { x: 90, y: 60 },
  { x: 70, y: 88 },
  { x: 30, y: 88 },
  { x: 10, y: 60 },
  { x: 16, y: 27 },
];

export function Skills() {
  const [activeCatId, setActiveCatId] = useState(SKILL_CATEGORIES[0].id);
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const activeCategory =
    SKILL_CATEGORIES.find((cat) => cat.id === activeCatId) ?? SKILL_CATEGORIES[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.from('[data-skills-reveal]', {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="relative z-10 border-t border-black/10 bg-[#E4E4E4] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="skills-heading">
          <SectionHeading
            eyebrow="07 // TECHNICAL ARSENAL"
            title="THE TOOLS BEHIND THE ENGINEERING."
            subtitle="Select any cluster around the central engineering core to explore the languages, frameworks, databases, and operational infrastructure used in production."
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Interactive Orbital Constellation Map (Desktop & Tablet) + Accessible Tabs */}
          <div
            data-skills-reveal
            className="min-w-0 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6 lg:col-span-6"
          >
            <div className="relative mx-auto hidden aspect-square max-w-[440px] sm:block">
              {/* SVG Orbital Rings & Animated Connections */}
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke={isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.12)'}
                  strokeWidth="0.35"
                  strokeDasharray="1.5 1.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="24"
                  fill="none"
                  stroke={isDark ? 'rgba(96, 165, 250, 0.35)' : 'rgba(91, 61, 245, 0.25)'}
                  strokeWidth="0.35"
                />

                {SKILL_CATEGORIES.map((cat, idx) => {
                  const pos = NODE_POSITIONS[idx];
                  const isActive = cat.id === activeCategory.id;
                  return (
                    <line
                      key={cat.id}
                      x1="50"
                      y1="50"
                      x2={pos.x}
                      y2={pos.y}
                      stroke={
                        isActive
                          ? cat.accent
                          : isDark
                            ? 'rgba(255, 255, 255, 0.18)'
                            : 'rgba(74, 82, 104, 0.25)'
                      }
                      strokeWidth={isActive ? '0.65' : '0.3'}
                      className={isActive && !reducedMotion ? 'animate-dash-flow' : undefined}
                    />
                  );
                })}
              </svg>

              {/* Central Engineering Core */}
              <div className="absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#FF4060]/50 bg-[#EEEEEE] text-center shadow-md shadow-cyan-900/10">
                <Cpu className="h-5 w-5 text-[#BE123C]" aria-hidden="true" />
                <span className="mt-1 font-mono text-[9px] font-bold tracking-[0.16em] text-[#111111] uppercase">
                  SYSTEM CORE
                </span>
              </div>

              {/* Cluster Nodes */}
              {SKILL_CATEGORIES.map((cat, idx) => {
                const pos = NODE_POSITIONS[idx];
                const isActive = cat.id === activeCategory.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCatId(cat.id)}
                    aria-pressed={isActive}
                    data-cursor-label="CLUSTER"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-center transition-all duration-200',
                      isActive
                        ? 'z-10 scale-105 border-[#FF4060] bg-[#FFF1F2] text-[#111111] shadow-md'
                        : 'border-black/12 bg-[#EEEEEE] text-[#555555] hover:border-black/30 hover:text-[#111111]',
                    )}
                  >
                    <span
                      className="block font-mono text-[9px] font-bold"
                      style={{ color: cat.accent }}
                    >
                      {cat.index}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] font-semibold whitespace-nowrap">
                      {cat.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile & Screen-reader accessible category selector */}
            <div
              role="tablist"
              aria-label="Technology skill categories"
              className="grid grid-cols-1 gap-2 sm:mt-4 sm:hidden"
            >
              {SKILL_CATEGORIES.map((cat) => {
                const isSelected = cat.id === activeCategory.id;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => setActiveCatId(cat.id)}
                    className={cn(
                      'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200',
                      isSelected
                        ? 'border-[#FF4060] bg-[#FFF1F2] text-[#111111]'
                        : 'border-black/10 bg-[#EEEEEE] text-[#555555] hover:-translate-y-0.5 hover:border-black/25 hover:bg-white hover:text-[#111111]',
                    )}
                  >
                    <span className="font-display text-sm font-semibold">{cat.name}</span>
                    <span className="font-mono text-xs font-semibold text-[#BE123C]">
                      {cat.items.length} tools
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Category Details + Full Scannable Index */}
          <div data-skills-reveal className="min-w-0 space-y-6 lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-black/12 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                  <div>
                    <span
                      className="font-mono text-xs font-bold tracking-[0.18em] uppercase"
                      style={{ color: activeCategory.accent }}
                    >
                      CLUSTER {activeCategory.index}
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#111111]">
                      {activeCategory.name}
                    </h3>
                  </div>
                  <span className="rounded-full border border-black/10 bg-[#E4E4E4] px-3 py-1 font-mono text-xs font-medium text-[#555555]">
                    {activeCategory.items.length} Technologies
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#555555]">
                  {activeCategory.summary}
                </p>

                <ul
                  aria-label={`${activeCategory.name} technologies`}
                  className="mt-6 flex flex-wrap gap-2.5"
                >
                  {activeCategory.items.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-lg border border-black/10 bg-[#EEEEEE] px-3.5 py-2 font-mono text-xs font-medium text-[#111111] transition-colors hover:border-[#FF4060]/50"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Quick category switch chips for keyboard & desktop convenience */}
            <div className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-xs">
              <p className="font-mono text-[11px] font-semibold tracking-wider text-[#555555] uppercase">
                All Engineering Clusters
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILL_CATEGORIES.map((cat) => {
                  const selected = cat.id === activeCategory.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCatId(cat.id)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                        selected
                          ? 'border-[#FF4060] bg-[#FFF1F2] text-[#BE123C]'
                          : 'border-black/10 bg-[#EEEEEE] text-[#555555] hover:text-[#111111]',
                      )}
                    >
                      {cat.index}. {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
