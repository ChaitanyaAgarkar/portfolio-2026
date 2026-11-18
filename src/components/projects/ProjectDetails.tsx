import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Github,
  Layers,
  Zap,
} from 'lucide-react';
import type { ProjectItem } from '@/types/project';
import { PROJECTS } from '@/data/projects';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ProjectPreview } from './ProjectPreview';

interface ProjectDetailsProps {
  project: ProjectItem;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const related = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-mono text-xs text-[#555555]">
        <Link to="/" className="transition-colors hover:text-[#111111]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/projects" className="transition-colors hover:text-[#111111]">
          Projects
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-[#BE123C]">{project.title}</span>
      </nav>

      {/* Header */}
      <header className="border-b border-black/10 pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="font-mono text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: project.accentColor }}
          >
            PROJECT {project.index} // {project.category}
          </span>
          <span
            className="rounded-full border bg-white px-3 py-0.5 font-mono text-[11px] font-semibold uppercase"
            style={{
              borderColor: `${project.accentColor}50`,
              color: project.accentColor,
            }}
          >
            {project.status}
          </span>
        </div>

        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        <p className="mt-3 font-mono text-sm text-[#555555] sm:text-base">{project.tagline}</p>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#111111]/85 sm:text-lg">
          {project.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.liveUrl ? (
            <MagneticButton
              href={project.liveUrl}
              target="_blank"
              variant="primary"
              cursorLabel="LIVE"
              className="px-5 py-3 font-mono text-xs tracking-wider uppercase"
            >
              <span>Launch Live Deployment</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
          ) : null}

          {project.githubUrl ? (
            <MagneticButton
              href={project.githubUrl}
              target="_blank"
              variant="secondary"
              cursorLabel="CODE"
              className="px-5 py-3 font-mono text-xs tracking-wider uppercase"
            >
              <Github className="h-4 w-4 text-[#164CE0]" aria-hidden="true" />
              <span>View Source on GitHub</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </MagneticButton>
          ) : null}

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-black/12 bg-white px-4 py-3 font-mono text-xs font-medium text-[#555555] shadow-xs transition-colors hover:border-black/25 hover:text-[#111111]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>All Projects</span>
          </Link>
        </div>

        {project.availabilityNote ? (
          <p className="mt-4 font-mono text-xs text-[#555555]">{project.availabilityNote}</p>
        ) : null}
      </header>

      {/* Preview + System Specs */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProjectPreview project={project} />
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#BE123C] uppercase">
              <Layers className="h-4 w-4" aria-hidden="true" />
              System Architecture
            </h2>
            <p className="mt-2 text-sm text-[#111111]">{project.architecture}</p>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#164CE0] uppercase">
              <Database className="h-4 w-4" aria-hidden="true" />
              Data &amp; Persistence
            </h2>
            <p className="mt-2 text-sm text-[#111111]">{project.database}</p>
          </div>

          {project.performance ? (
            <div className="rounded-xl border border-[#FF4060]/35 bg-[#FFF1F2]/75 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <h2 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#BE123C] uppercase">
                <Zap className="h-4 w-4" aria-hidden="true" />
                Performance Benchmark
              </h2>
              <p className="mt-2 font-mono text-sm font-medium text-[#111111]">{project.performance}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Architecture Topology Nodes */}
      <section aria-labelledby="arch-topology-heading" className="mt-14">
        <h2
          id="arch-topology-heading"
          className="font-mono text-xs font-semibold tracking-[0.2em] text-[#BE123C] uppercase"
        >
          Component Flow &amp; Layer Responsibilities
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {project.architectureNodes.map((node, index) => (
            <div
              key={node.id}
              className="rounded-xl border border-black/10 bg-white p-5 shadow-xs"
            >
              <span className="font-mono text-[10px] font-semibold text-[#164CE0]">NODE 0{index + 1}</span>
              <h3 className="mt-2 font-display text-base font-semibold text-[#111111]">
                {node.label}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#555555]">{node.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features & Stack */}
      <div className="mt-14 grid gap-8 lg:grid-cols-12">
        <section
          aria-labelledby="features-heading"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7"
        >
          <h2 id="features-heading" className="font-display text-xl font-bold text-[#111111]">
            Implemented Features
          </h2>
          <ul className="mt-5 space-y-3">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-[#555555]">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#BE123C]"
                  aria-hidden="true"
                />
                <span className="text-[#111111]">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="stack-heading"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 lg:col-span-5"
        >
          <h2 id="stack-heading" className="font-display text-xl font-bold text-[#111111]">
            Technology Stack
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-lg border border-black/10 bg-[#E4E4E4] px-3 py-1.5 font-mono text-xs font-medium text-[#111111]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Related Projects */}
      <section aria-labelledby="related-heading" className="mt-16 border-t border-black/10 pt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 id="related-heading" className="font-display text-2xl font-bold text-[#111111]">
            Related Engineering Builds
          </h2>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#BE123C] hover:underline"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              to={`/projects/${item.slug}`}
              className="group rounded-xl border border-black/10 bg-white p-5 shadow-xs transition-all hover:border-[#FF4060]/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold" style={{ color: item.accentColor }}>PROJECT {item.index}</span>
                <span className="text-[#555555]">{item.status}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-[#111111] group-hover:text-[#164CE0]">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#555555]">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
