import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Database, Github, Layers } from 'lucide-react';
import type { ProjectItem } from '@/types/project';
import { cn } from '@/lib/utils/cn';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ProjectPreview } from './ProjectPreview';

interface ProjectShowcaseProps {
  project: ProjectItem;
  reversed?: boolean;
}

export function ProjectShowcase({ project, reversed = false }: ProjectShowcaseProps) {
  return (
    <article
      data-project-row
      className="group relative grid gap-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-black/20 hover:shadow-md sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10"
    >
      {/* Subtle project-specific top accent hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-8 left-8 h-[2px] rounded-full opacity-80"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Editorial info block */}
      <div className={cn('space-y-5 lg:col-span-6', reversed && 'lg:order-2')}>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="font-mono text-xs font-bold tracking-widest"
            style={{ color: project.accentColor }}
          >
            PROJECT {project.index}
          </span>
          <span className="text-slate-900/20" aria-hidden="true">
            /
          </span>
          <span className="font-mono text-xs text-[#555555]">{project.category}</span>
          <span
            className="rounded-full border bg-[#EEEEEE] px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase"
            style={{
              borderColor: `${project.accentColor}45`,
              color: project.accentColor,
            }}
          >
            {project.status}
          </span>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
            <Link
              to={`/projects/${project.slug}`}
              className="hover-underline-slide inline-block pb-0.5 transition-colors hover:text-[#164CE0]"
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-1 font-mono text-xs text-[#555555]">{project.tagline}</p>
        </div>

        <p className="text-sm leading-relaxed text-[#555555] sm:text-base">
          {project.description}
        </p>

        {/* Architecture & DB metadata */}
        <dl className="grid gap-3 rounded-xl border border-black/10 bg-[#EEEEEE] p-4 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#555555] uppercase">
              <Layers className="h-3 w-3 text-[#164CE0]" aria-hidden="true" />
              Architecture
            </dt>
            <dd className="mt-1 text-xs font-medium text-[#111111]">{project.architecture}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#555555] uppercase">
              <Database className="h-3 w-3 text-[#BE123C]" aria-hidden="true" />
              Database
            </dt>
            <dd className="mt-1 text-xs font-medium text-[#111111]">{project.database}</dd>
          </div>
          {project.performance ? (
            <div className="border-t border-black/10 pt-2.5 sm:col-span-2">
              <dt className="font-mono text-[10px] font-semibold tracking-wider text-[#BE123C] uppercase">
                Supplied Performance
              </dt>
              <dd className="mt-0.5 font-mono text-xs font-medium text-[#111111]">{project.performance}</dd>
            </div>
          ) : null}
        </dl>

        {/* Tech stack */}
        <ul className="flex flex-wrap gap-1.5" aria-label={`${project.title} technology stack`}>
          {project.stack.map((tech) => (
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
            to={`/projects/${project.slug}`}
            variant="primary"
            cursorLabel="VIEW"
            className="px-4 py-2.5 font-mono text-xs tracking-wider uppercase"
          >
            <span>View Project</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </MagneticButton>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="LIVE"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/12 bg-white px-4 py-2.5 font-mono text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#FF4060]/60 hover:text-[#BE123C]"
            >
              <span>Live Demo</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="CODE"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/12 bg-white px-3.5 py-2.5 font-mono text-xs font-medium text-[#555555] shadow-xs transition-colors hover:border-black/25 hover:text-[#111111]"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          ) : null}

          {!project.liveUrl && !project.githubUrl && project.availabilityNote ? (
            <span className="font-mono text-[11px] text-[#555555]">
              Private build · Architecture case study available
            </span>
          ) : null}
        </div>
      </div>

      {/* Interactive preview column */}
      <div className={cn('space-y-4 lg:col-span-6', reversed && 'lg:order-1')}>
        <ProjectPreview project={project} />

        {/* Accessible key features list */}
        <div className="rounded-xl border border-black/10 bg-[#EEEEEE] p-4">
          <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#555555] uppercase">
            Key Capabilities
          </p>
          <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            {project.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-xs text-[#111111]">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: project.accentColor }}
                  aria-hidden="true"
                />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
