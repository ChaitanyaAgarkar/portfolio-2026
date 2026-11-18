import { useEffect, useRef } from 'react';
import { Award, GraduationCap, Medal } from 'lucide-react';
import { ACHIEVEMENTS, EDUCATION_ENTRIES } from '@/data/education';
import { ensureGsapRegistered, gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Education() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.from('[data-edu-reveal]', {
        y: 24,
        opacity: 0,
        duration: 0.68,
        stagger: 0.09,
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
      id="education"
      ref={sectionRef}
      aria-labelledby="education-heading"
      className="relative z-10 border-t border-black/10 bg-[#E4E4E4] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="education-heading">
          <SectionHeading
            eyebrow="09 // ACADEMIC FOUNDATION & HONORS"
            title="EDUCATION & ACHIEVEMENTS."
            subtitle="Computer science academic record and competitive engineering recognitions."
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* Education entries */}
          <div className="min-w-0 space-y-5 lg:col-span-6">
            <h3 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.18em] text-[#BE123C] uppercase">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Academic Credentials
            </h3>

            {EDUCATION_ENTRIES.map((edu) => (
              <article
                key={edu.id}
                data-edu-reveal
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-xs transition-colors hover:border-black/20"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-[#164CE0]">{edu.period}</span>
                  <span className="rounded-full border border-black/10 bg-[#FFF1F2] px-3 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[#BE123C] uppercase">
                    {edu.status}
                  </span>
                </div>

                <h4 className="mt-3 font-display text-xl font-bold text-[#111111]">
                  {edu.degree}
                </h4>
                <p className="mt-1 text-sm font-medium text-[#111111]">
                  {edu.institution}
                  {edu.affiliation ? (
                    <span className="text-[#555555]"> · {edu.affiliation}</span>
                  ) : null}
                </p>

                {edu.score ? (
                  <p className="mt-3 inline-block rounded-lg border border-[#FF4060]/35 bg-[#FFF1F2] px-3 py-1 font-mono text-xs font-semibold text-[#BE123C]">
                    {edu.score}
                  </p>
                ) : null}

                <p className="mt-3 text-sm leading-relaxed text-[#555555]">{edu.details}</p>
              </article>
            ))}
          </div>

          {/* Achievements */}
          <div className="min-w-0 space-y-5 lg:col-span-6">
            <h3 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.18em] text-[#164CE0] uppercase">
              <Award className="h-4 w-4" aria-hidden="true" />
              Verified Recognitions
            </h3>

            {ACHIEVEMENTS.map((item) => (
              <article
                key={item.id}
                data-edu-reveal
                className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-xs transition-colors hover:border-[#2060FF]/45"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#BE123C]">
                    <Medal className="h-3.5 w-3.5" aria-hidden="true" />
                    HONOR {item.index} // {item.year}
                  </span>
                  <span className="rounded border border-black/10 bg-[#E4E4E4] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#111111]">
                    {item.tag}
                  </span>
                </div>

                <h4 className="mt-3 font-display text-xl font-bold text-[#111111]">
                  {item.title}
                </h4>
                <p className="mt-1 font-mono text-xs font-semibold text-[#164CE0]">{item.subtitle}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#555555]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
