import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Database,
  Github,
  Layers,
  Pause,
  Play,
  SlidersHorizontal,
} from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { ensureGsapRegistered, prefersReducedMotion } from '@/lib/animations/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { sphereSynth } from '@/lib/audio/sphereSynth';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectPreview } from '@/components/projects/ProjectPreview';
import { cn } from '@/lib/utils/cn';

const AUTO_GLIDE_INTERVAL_MS = 6500;

export function Projects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(Date.now());
  const reducedMotion = useReducedMotion();

  const activeProject = PROJECTS[activeIdx] ?? PROJECTS[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();
  }, []);

  const goToSlide = useCallback((nextIdx: number, newDirection: number) => {
    setDirection(newDirection);
    setActiveIdx(nextIdx);
    setProgress(0);
    lastStepTimeRef.current = Date.now();
    sphereSynth.unlock();
    sphereSynth.playAccentShift(nextIdx);
  }, []);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIdx - 1 + PROJECTS.length) % PROJECTS.length;
    goToSlide(prevIdx, -1);
  }, [activeIdx, goToSlide]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIdx + 1) % PROJECTS.length;
    goToSlide(nextIdx, 1);
  }, [activeIdx, goToSlide]);

  // Keyboard arrow navigation when hovering or focused inside the section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if user is not typing in an input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener('keydown', handleKeyDown);
    return () => {
      section.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrev, handleNext]);

  // Auto-play timer loop with progress bar
  useEffect(() => {
    if (!isAutoPlay || isHovered || reducedMotion) {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      return;
    }

    lastStepTimeRef.current = Date.now();
    const tickInterval = 50;

    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - lastStepTimeRef.current;
      const pct = Math.min(100, (elapsed / AUTO_GLIDE_INTERVAL_MS) * 100);
      setProgress(pct);

      if (elapsed >= AUTO_GLIDE_INTERVAL_MS) {
        handleNext();
      }
    }, tickInterval);

    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [isAutoPlay, isHovered, reducedMotion, handleNext]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 36 : -36,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 340, damping: 32 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -36 : 36,
      opacity: 0,
      scale: 0.99,
      transition: {
        x: { type: 'spring', stiffness: 340, damping: 32 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      tabIndex={0}
      aria-labelledby="projects-heading"
      aria-roledescription="carousel"
      className="relative z-10 border-t border-black/10 bg-[#E4E4E4] py-20 outline-none sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="projects-heading">
          <SectionHeading
            eyebrow="05 // SELECTED PERSONAL PROJECTS"
            title="ARCHITECTED & SHIPPED."
            subtitle="Full-stack platforms, real-time collaborative workspaces, applied machine learning pipelines, and mobile commerce ecosystems."
            actions={
              <div className="flex flex-wrap items-center gap-2.5">
                <MagneticButton
                  to="/projects"
                  variant="outline"
                  cursorLabel="INDEX"
                  className="font-mono text-xs tracking-wider uppercase"
                >
                  <span>All Projects (6)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#BE123C]" aria-hidden="true" />
                </MagneticButton>
              </div>
            }
          />
        </div>

        {/* =========================================================================
            GLIDER COCKPIT: Ticker, Navigation Controls & Horizontal Switcher Rail
           ========================================================================= */}
        <div className="mt-12 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-3.5 shadow-xs sm:p-4">
            {/* Status Telemetry & Step Odometer */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-lg border border-black/10 bg-[#EEEEEE] px-3 py-1.5 font-mono text-xs font-semibold text-[#111111]">
                <span
                  className="h-2 w-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: activeProject.accentColor }}
                  aria-hidden="true"
                />
                <span className="text-[#555555]">SPEC</span>
                <span className="font-bold">{activeProject.index}</span>
                <span className="text-[#555555]">/ 06</span>
              </span>

              <span
                className="hidden rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase sm:inline-block"
                style={{
                  borderColor: `${activeProject.accentColor}45`,
                  color: activeProject.accentColor,
                }}
              >
                {activeProject.status}
              </span>

              <span className="hidden font-mono text-xs text-[#555555] md:inline">
                {activeProject.category}
              </span>
            </div>

            {/* Glider Controls: Prev, Next, Auto-Glide, Keyboard hint */}
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1 font-mono text-[10px] text-[#555555] lg:inline-flex">
                <kbd className="rounded border border-black/12 bg-[#EEEEEE] px-1.5 py-0.5">←</kbd>
                <kbd className="rounded border border-black/12 bg-[#EEEEEE] px-1.5 py-0.5">→</kbd>
                <span className="ml-1">Navigate</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  sphereSynth.unlock();
                  setIsAutoPlay((prev) => !prev);
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all',
                  isAutoPlay
                    ? 'border-[#2060FF] bg-[#2060FF]/10 text-[#164CE0]'
                    : 'border-black/12 bg-[#EEEEEE] text-[#555555] hover:text-[#111111]',
                )}
                aria-pressed={isAutoPlay}
                aria-label={isAutoPlay ? 'Pause auto-glide' : 'Start auto-glide'}
                title={isAutoPlay ? 'Pause auto-glide' : 'Auto-glide every 6.5s'}
              >
                {isAutoPlay ? (
                  <>
                    <Pause className="h-3 w-3 text-[#164CE0]" aria-hidden="true" />
                    <span className="hidden sm:inline">Gliding</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 text-[#555555]" aria-hidden="true" />
                    <span className="hidden sm:inline">Auto-Glide</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/12 bg-white text-[#111111] shadow-xs transition-colors hover:border-[#2060FF] hover:text-[#164CE0] active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next project"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/12 bg-white text-[#111111] shadow-xs transition-colors hover:border-[#2060FF] hover:text-[#164CE0] active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Glider Tabs Segmented Rail */}
          <div
            role="tablist"
            aria-label="Select personal project slide"
            className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PROJECTS.map((project, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={project.slug}
                  role="tab"
                  id={`project-tab-${project.slug}`}
                  aria-selected={isSelected}
                  aria-controls={`project-panel-${project.slug}`}
                  onClick={() => goToSlide(idx, idx > activeIdx ? 1 : -1)}
                  className={cn(
                    'group relative flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-left transition-all duration-200',
                    isSelected
                      ? 'border-black/20 bg-white text-[#111111] shadow-xs'
                      : 'border-black/8 bg-white/70 text-[#555555] hover:border-black/20 hover:bg-white hover:text-[#111111]',
                  )}
                >
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: project.accentColor }}
                  >
                    {project.index}
                  </span>
                  <span className="font-display text-xs font-semibold whitespace-nowrap sm:text-sm">
                    {project.title}
                  </span>

                  {isSelected ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-3 bottom-0 left-3 h-[2px] rounded-full"
                      style={{ backgroundColor: project.accentColor }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Animated Auto-Glide Progress Line (when active) */}
          {isAutoPlay ? (
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-black/10"
              aria-hidden="true"
            >
              <div
                className="h-full transition-all duration-75 ease-linear"
                style={{
                  width: `${progress}%`,
                  backgroundColor: activeProject.accentColor,
                }}
              />
            </div>
          ) : null}
        </div>

        {/* =========================================================================
            ACTIVE GLIDER STAGE: Animated Showcase with Drag & Swipe Gestures
           ========================================================================= */}
        <div
          className="relative mt-5 min-h-[520px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={activeProject.slug}
              role="tabpanel"
              id={`project-panel-${activeProject.slug}`}
              aria-labelledby={`project-tab-${activeProject.slug}`}
              custom={direction}
              variants={reducedMotion ? undefined : slideVariants}
              initial={reducedMotion ? { opacity: 1 } : 'enter'}
              animate={reducedMotion ? { opacity: 1 } : 'center'}
              exit={reducedMotion ? { opacity: 0 } : 'exit'}
              drag={reducedMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -45 || info.velocity.x < -280) {
                  handleNext();
                } else if (info.offset.x > 45 || info.velocity.x > 280) {
                  handlePrev();
                }
              }}
              className="studio-card group relative grid cursor-grab gap-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md active:cursor-grabbing sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10"
            >
              {/* Top project-specific accent hairline */}
              <div
                aria-hidden="true"
                className="absolute top-0 right-8 left-8 h-[2px] rounded-full opacity-85 transition-colors duration-300"
                style={{ backgroundColor: activeProject.accentColor }}
              />

              {/* Ambient radial corner glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full opacity-20 blur-3xl transition-colors duration-500"
                style={{
                  background: `radial-gradient(circle, ${activeProject.accentColor} 0%, transparent 70%)`,
                }}
              />

              {/* Left Column: Editorial Specs, Tech Stack & Primary Actions */}
              <div className="relative z-10 space-y-5 lg:col-span-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="font-mono text-xs font-bold tracking-widest uppercase"
                    style={{ color: activeProject.accentColor }}
                  >
                    PROJECT {activeProject.index}
                  </span>
                  <span className="text-black/20" aria-hidden="true">
                    /
                  </span>
                  <span className="font-mono text-xs text-[#555555]">
                    {activeProject.category}
                  </span>
                  <span
                    className="rounded-full border bg-[#EEEEEE] px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase"
                    style={{
                      borderColor: `${activeProject.accentColor}45`,
                      color: activeProject.accentColor,
                    }}
                  >
                    {activeProject.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl lg:text-4xl">
                    <Link
                      to={`/projects/${activeProject.slug}`}
                      className="hover-underline-slide inline-block pb-0.5 transition-colors hover:text-[#164CE0]"
                    >
                      {activeProject.title}
                    </Link>
                  </h3>
                  <p className="mt-1 font-mono text-xs text-[#555555] sm:text-sm">
                    {activeProject.tagline}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[#555555] sm:text-base">
                  {activeProject.description}
                </p>

                {/* Architecture & DB metadata */}
                <dl className="grid gap-3 rounded-xl border border-black/10 bg-[#EEEEEE] p-4 sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#555555] uppercase">
                      <Layers className="h-3 w-3 text-[#164CE0]" aria-hidden="true" />
                      Architecture
                    </dt>
                    <dd className="mt-1 text-xs font-medium text-[#111111]">
                      {activeProject.architecture}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#555555] uppercase">
                      <Database className="h-3 w-3 text-[#BE123C]" aria-hidden="true" />
                      Database
                    </dt>
                    <dd className="mt-1 text-xs font-medium text-[#111111]">
                      {activeProject.database}
                    </dd>
                  </div>
                  {activeProject.performance ? (
                    <div className="border-t border-black/10 pt-2.5 sm:col-span-2">
                      <dt className="font-mono text-[10px] font-semibold tracking-wider text-[#BE123C] uppercase">
                        Supplied Performance
                      </dt>
                      <dd className="mt-0.5 font-mono text-xs font-medium text-[#111111]">
                        {activeProject.performance}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {/* Tech stack */}
                <ul
                  className="flex flex-wrap gap-1.5"
                  aria-label={`${activeProject.title} technology stack`}
                >
                  {activeProject.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded border border-black/10 bg-[#E4E4E4] px-2.5 py-1 font-mono text-[11px] font-medium text-[#111111]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <MagneticButton
                    to={`/projects/${activeProject.slug}`}
                    variant="primary"
                    cursorLabel="VIEW"
                    className="px-4 py-2.5 font-mono text-xs tracking-wider uppercase"
                  >
                    <span>View Project Case Study</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </MagneticButton>

                  {activeProject.liveUrl ? (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor-label="LIVE"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-black/12 bg-white px-4 py-2.5 font-mono text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#FF4060]/60 hover:text-[#BE123C]"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}

                  {activeProject.githubUrl ? (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor-label="CODE"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-black/12 bg-white px-3.5 py-2.5 font-mono text-xs font-medium text-[#555555] shadow-xs transition-colors hover:border-black/25 hover:text-[#111111]"
                    >
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>GitHub</span>
                    </a>
                  ) : null}

                  {!activeProject.liveUrl && !activeProject.githubUrl && activeProject.availabilityNote ? (
                    <span className="font-mono text-[11px] text-[#555555]">
                      Private build · Architecture case study available
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Right Column: Interactive Preview & Key Capabilities */}
              <div className="relative z-10 space-y-4 lg:col-span-6">
                <ProjectPreview project={activeProject} />

                {/* Accessible key features list */}
                <div className="rounded-xl border border-black/10 bg-[#EEEEEE] p-4">
                  <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#555555] uppercase">
                    Key Capabilities &amp; Verified Engineering
                  </p>
                  <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                    {activeProject.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-[#111111]">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: activeProject.accentColor }}
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* =========================================================================
            BOTTOM GLIDER DECK: Interactive Quick-Select Strip (All 6 at a glance)
           ========================================================================= */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-[#555555] uppercase">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#164CE0]" aria-hidden="true" />
              Quick Project Glider Deck
            </span>
            <span className="font-mono text-xs text-[#555555]">
              Tap any card to glide instantly
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PROJECTS.map((project, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => goToSlide(idx, idx > activeIdx ? 1 : -1)}
                  aria-pressed={isSelected}
                  className={cn(
                    'group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200',
                    isSelected
                      ? 'scale-[1.02] border-black/30 bg-white shadow-md'
                      : 'border-black/10 bg-white/70 hover:border-black/25 hover:bg-white',
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="absolute top-0 right-3 left-3 h-[2px] rounded-full transition-opacity"
                    style={{
                      backgroundColor: project.accentColor,
                      opacity: isSelected ? 1 : 0.35,
                    }}
                  />

                  <div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-bold" style={{ color: project.accentColor }}>
                        {project.index}
                      </span>
                      <span className="text-[10px] text-[#555555]">{project.status}</span>
                    </div>

                    <p className="mt-2 font-display text-xs font-bold text-[#111111] group-hover:text-[#164CE0] sm:text-sm">
                      {project.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 font-mono text-[10px] text-[#555555]">
                      {project.category.split(' ')[0]}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-black/8 pt-2">
                    <span className="font-mono text-[10px] font-medium text-[#164CE0] opacity-0 transition-opacity group-hover:opacity-100">
                      View
                    </span>
                    <ArrowUpRight
                      className="h-3 w-3 text-[#555555] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#164CE0]"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
