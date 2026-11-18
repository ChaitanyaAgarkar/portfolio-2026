import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { CHAPTER_ROUTES, type ChapterMeta } from '@/data/navigation';
import { About } from '@/components/sections/About';
import { Impact } from '@/components/sections/Impact';
import { EnterpriseShowcase } from '@/components/sections/EnterpriseShowcase';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
import { Skills } from '@/components/sections/Skills';
import { CodingStats } from '@/components/sections/CodingStats';
import { Contact } from '@/components/sections/Contact';
import { cn } from '@/lib/utils/cn';

interface SectionRoutePageProps {
  chapterId: ChapterMeta['id'];
}

export function SectionRoutePage({ chapterId }: SectionRoutePageProps) {
  const index = CHAPTER_ROUTES.findIndex((c) => c.id === chapterId);
  const current = CHAPTER_ROUTES[index] ?? CHAPTER_ROUTES[0];
  const prevChapter = CHAPTER_ROUTES[(index - 1 + CHAPTER_ROUTES.length) % CHAPTER_ROUTES.length];
  const nextChapter = CHAPTER_ROUTES[(index + 1) % CHAPTER_ROUTES.length];

  return (
    <div className="min-h-screen bg-[#EEEEEE] pt-20">
      <h1 className="sr-only">{current.title}</h1>

      {/* Compact Chapter Switcher Header */}
      <div className="border-b border-black/10 bg-[#E4E4E4] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/12 bg-white px-3 py-1.5 font-mono text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#2060FF]/50 hover:text-[#164CE0]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Overview</span>
            </Link>

            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#BE123C] uppercase">
              CHAPTER {current.index} / 06 · {current.label}
            </span>
          </div>

          <div
            aria-label="Portfolio sections switcher"
            className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1"
          >
            {CHAPTER_ROUTES.map((item) => {
              const isCurrent = item.id === current.id;
              return (
                <Link
                  key={item.id}
                  to={item.route}
                  className={cn(
                    'shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] font-medium transition-colors',
                    isCurrent
                      ? 'border-[#2060FF] bg-[#2060FF] text-white'
                      : 'border-black/10 bg-white text-[#555555] hover:border-black/25 hover:text-[#111111]',
                  )}
                >
                  {item.index} · {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Focused Section Content */}
      {chapterId === 'about' ? (
        <>
          <About />
          <Impact />
        </>
      ) : chapterId === 'work' ? (
        <>
          <EnterpriseShowcase />
          <Projects />
        </>
      ) : chapterId === 'experience' ? (
        <>
          <Experience />
          <Education />
        </>
      ) : chapterId === 'skills' ? (
        <Skills />
      ) : chapterId === 'coding' ? (
        <CodingStats />
      ) : (
        <Contact />
      )}

      {/* Chapter Pager Bar */}
      <div className="border-t border-black/10 bg-[#EEEEEE] py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            to={prevChapter.route}
            className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black/12 bg-white px-3.5 py-2.5 font-mono text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#2060FF]/50 hover:text-[#164CE0]"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{prevChapter.label}</span>
          </Link>

          <Link
            to={nextChapter.route}
            className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black/12 bg-white px-3.5 py-2.5 font-mono text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#2060FF]/50 hover:text-[#164CE0]"
          >
            <span className="truncate">{nextChapter.label}</span>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

