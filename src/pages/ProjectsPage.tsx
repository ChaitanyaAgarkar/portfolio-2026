import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectShowcase } from '@/components/projects/ProjectShowcase';
import { cn } from '@/lib/utils/cn';

const STATUS_FILTERS = ['ALL', 'ACTIVE', 'LIVE', 'BETA', 'PRIVATE'] as const;

export function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('ALL');

  const filteredProjects = useMemo(() => {
    if (filter === 'ALL') return PROJECTS;
    return PROJECTS.filter((p) => p.status === filter);
  }, [filter]);

  return (
    <div className="relative z-10 min-h-screen bg-[#EEEEEE]/94 pt-28 pb-24 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-[#555555]">
            <Link to="/" className="hover:text-[#111111]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#BE123C]">Projects</span>
          </nav>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-black/12 bg-white px-3.5 py-2 font-mono text-xs font-medium text-[#555555] shadow-xs transition-colors hover:border-black/25 hover:text-[#111111]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        <SectionHeading
          as="h1"
          eyebrow="PROJECT ARCHIVE // 01 – 06"
          title="SELECTED ENGINEERING PROJECTS."
          subtitle="Full-stack systems, real-time collaborative workspaces, machine learning pipelines, and mobile commerce applications."
          actions={
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by status">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  aria-pressed={filter === status}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                    filter === status
                      ? 'border-[#2060FF] bg-[#2060FF] text-white'
                      : 'border-black/12 bg-white text-[#555555] hover:text-[#111111]',
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          }
        />

        <div className="mt-14 space-y-10">
          {filteredProjects.map((project, idx) => (
            <ProjectShowcase
              key={project.slug}
              project={project}
              reversed={idx % 2 === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
