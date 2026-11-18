import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight, MapPin } from 'lucide-react';
import { EXPERIENCES } from '@/data/experience';
import { ensureGsapRegistered, gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils/cn';

export function Experience() {
  const [selectedId, setSelectedId] = useState(EXPERIENCES[0].id);
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const activeExperience =
    EXPERIENCES.find((item) => item.id === selectedId) ?? EXPERIENCES[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.from('[data-exp-reveal]', {
        y: 24,
        opacity: 0,
        duration: 0.68,
        stagger: 0.08,
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
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-heading"
      className="relative z-10 border-t border-black/10 bg-[#EEEEEE] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="experience-heading">
          <SectionHeading
            eyebrow="06 // CAREER TRAJECTORY"
            title="PROFESSIONAL EXPERIENCE."
            subtitle="Select any role across the timeline to inspect production responsibilities, engineering impact, and system stacks."
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* Interactive Timeline Rail */}
          <div
            data-exp-reveal
            role="tablist"
            aria-label="Career timeline entries"
            className="relative min-w-0 space-y-3 lg:col-span-5"
          >
            {/* Vertical timeline spine */}
            <div
              aria-hidden="true"
              className="absolute top-5 bottom-5 left-5 w-px bg-black/12"
            />

            {EXPERIENCES.map((exp) => {
              const isSelected = exp.id === activeExperience.id;
              return (
                <button
                  key={exp.id}
                  type="button"
                  role="tab"
                  id={`exp-tab-${exp.id}`}
                  aria-selected={isSelected}
                  aria-controls={`exp-panel-${exp.id}`}
                  onClick={() => setSelectedId(exp.id)}
                  data-cursor-label="SELECT"
                  className={cn(
                    'group relative flex w-full items-start gap-4 rounded-xl border p-4 pl-12 text-left transition-all duration-200',
                    isSelected
                      ? 'border-[#2060FF]/60 bg-white shadow-md shadow-black/5'
                      : 'border-black/10 bg-white/80 hover:translate-x-1 hover:border-black/25 hover:bg-white hover:shadow-sm',
                  )}
                >
                  {/* Node marker */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-5 left-[15px] h-3 w-3 rounded-full border-2 transition-colors',
                      isSelected
                        ? 'border-[#FF4060] bg-[#FF4060]'
                        : 'border-slate-400 bg-[#EEEEEE]',
                    )}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#BE123C]">
                        {exp.index} // {exp.duration}
                      </span>
                      <span className="rounded border border-black/10 bg-[#E4E4E4] px-2 py-0.5 font-mono text-[10px] font-medium text-[#555555]">
                        {exp.type}
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-[#111111] sm:text-lg">
                      {exp.company}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-[#164CE0]">{exp.role}</p>
                  </div>

                  <ChevronRight
                    className={cn(
                      'mt-1 h-4 w-4 shrink-0 transition-transform',
                      isSelected ? 'translate-x-0.5 text-[#BE123C]' : 'text-[#555555]/50',
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Selected Role Detail Dossier */}
          <div data-exp-reveal className="min-w-0 lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeExperience.id}
                role="tabpanel"
                id={`exp-panel-${activeExperience.id}`}
                aria-labelledby={`exp-tab-${activeExperience.id}`}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="rounded-2xl border border-black/12 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#555555]">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#BE123C]">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {activeExperience.duration}
                      </span>
                      {activeExperience.location ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#164CE0]" aria-hidden="true" />
                          {activeExperience.location}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-bold text-[#111111] sm:text-3xl">
                      {activeExperience.role}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-2 font-mono text-sm font-semibold text-[#164CE0]">
                      <Briefcase className="h-4 w-4" aria-hidden="true" />
                      {activeExperience.company}
                    </p>
                  </div>

                  <span className="rounded-full border border-black/10 bg-[#E4E4E4] px-3 py-1 font-mono text-[11px] font-medium text-[#111111]">
                    {activeExperience.type}
                  </span>
                </div>

                <p className="mt-5 hidden text-sm leading-relaxed text-[#555555] sm:text-base md:block">
                  {activeExperience.summary}
                </p>

                {activeExperience.highlights && activeExperience.highlights.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {activeExperience.highlights.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-[#FF4060]/35 bg-[#FFF1F2] px-3 py-1.5 font-mono text-xs font-semibold text-[#BE123C]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6">
                  <h4 className="font-mono text-xs font-semibold tracking-[0.16em] text-[#555555] uppercase">
                    Key Contributions &amp; Engineering Scope
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {activeExperience.responsibilities.map((resp, respIdx) => (
                      <li
                        key={resp}
                        className={cn(
                          'flex items-start gap-3 text-sm leading-relaxed text-[#111111]/90',
                          respIdx > 1 && 'hidden md:flex',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2060FF]"
                        />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 border-t border-black/10 pt-5">
                  <h4 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[#555555] uppercase">
                    Stack &amp; Tooling
                  </h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {activeExperience.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded border border-black/10 bg-[#E4E4E4] px-2.5 py-1 font-mono text-xs font-medium text-[#111111]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
