import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, Layers3 } from 'lucide-react';
import { ENTERPRISE_SYSTEMS } from '@/data/enterpriseSystems';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { animateRevealGroup } from '@/lib/animations/gsap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils/cn';
import { EnterpriseDiagram } from './EnterpriseDiagram';

export function EnterpriseShowcase() {
  const [selectedId, setSelectedId] = useState(ENTERPRISE_SYSTEMS[0].id);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = animateRevealGroup(sectionRef.current, '[data-enterprise-reveal]', {
      y: 24,
      stagger: 0.08,
    });
    return () => ctx?.revert();
  }, []);

  const activeSystem =
    ENTERPRISE_SYSTEMS.find((sys) => sys.id === selectedId) ?? ENTERPRISE_SYSTEMS[0];

  return (
    <section
      id="enterprise"
      ref={sectionRef}
      aria-labelledby="enterprise-heading"
      className="relative z-10 border-t border-black/10 bg-[#EEEEEE] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="enterprise-heading">
          <SectionHeading
            eyebrow="04 // ENTERPRISE ENGINEERING SHOWCASE"
            title="BEHIND THE SYSTEMS."
            subtitle="Engineering products that power real-world operations."
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* Interactive selector rail */}
          <div
            data-enterprise-reveal
            role="tablist"
            aria-label="Enterprise systems engineered"
            className="flex min-w-0 max-w-full gap-2.5 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {ENTERPRISE_SYSTEMS.map((sys) => {
              const isSelected = sys.id === activeSystem.id;
              return (
                <button
                  key={sys.id}
                  role="tab"
                  type="button"
                  id={`tab-${sys.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${sys.id}`}
                  onClick={() => setSelectedId(sys.id)}
                  data-cursor-label="INSPECT"
                  className={cn(
                    'group flex min-w-[235px] shrink-0 flex-col rounded-xl border p-4 text-left transition-all duration-200 lg:min-w-0',
                    isSelected
                      ? 'border-[#FF4060]/60 bg-white shadow-md shadow-black/5'
                      : 'border-black/10 bg-white/80 hover:translate-x-1 hover:border-black/25 hover:bg-white hover:shadow-sm',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'font-mono text-[11px] font-semibold',
                        isSelected ? 'text-[#BE123C]' : 'text-[#164CE0]',
                      )}
                    >
                      SYSTEM {sys.index}
                    </span>
                    <Layers3
                      className={cn(
                        'h-3.5 w-3.5 transition-colors',
                        isSelected ? 'text-[#BE123C]' : 'text-[#555555]/60',
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111111]">
                    {sys.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-[#555555]">{sys.domain}</p>
                </button>
              );
            })}
          </div>

          {/* Architectural dossier + live visual simulation */}
          <div data-enterprise-reveal className="min-w-0 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSystem.id}
                role="tabpanel"
                id={`panel-${activeSystem.id}`}
                aria-labelledby={`tab-${activeSystem.id}`}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="rounded-2xl border border-black/12 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6">
                  <div>
                    <span className="font-mono text-xs font-semibold tracking-[0.18em] text-[#BE123C] uppercase">
                      {activeSystem.index} // {activeSystem.domain}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-[#111111] sm:text-3xl">
                      {activeSystem.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-[#2060FF]/35 bg-[#F5F3FF] px-3 py-1 font-mono text-[11px] font-semibold text-[#164CE0]">
                    ENTERPRISE PRODUCTION
                  </span>
                </div>

                <p className="mt-5 hidden text-base leading-relaxed text-[#555555] md:block">
                  {activeSystem.overview}
                </p>

                {/* Interactive system architecture visualization */}
                <div className="mt-6 rounded-xl border border-black/10 bg-[#E4E4E4] p-4 sm:p-5">
                  <EnterpriseDiagram type={activeSystem.diagramType} />
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-mono text-xs font-semibold tracking-wider text-[#111111] uppercase">
                      Core Capabilities
                    </h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {activeSystem.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="rounded-md border border-black/10 bg-[#EEEEEE] px-2.5 py-1 text-xs font-medium text-[#555555]"
                        >
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="hidden md:block">
                    <h4 className="font-mono text-xs font-semibold tracking-wider text-[#111111] uppercase">
                      Engineering Highlights
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {activeSystem.engineeringHighlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-xs leading-relaxed text-[#555555]"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#BE123C]"
                            aria-hidden="true"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {activeSystem.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-[#2060FF]/25 bg-[#F5F3FF] px-2 py-0.5 font-mono text-[11px] font-medium text-[#111111]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#555555]">
                    <Info className="h-3.5 w-3.5 shrink-0 text-[#164CE0]" aria-hidden="true" />
                    <span>{activeSystem.confidentialityNote}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
