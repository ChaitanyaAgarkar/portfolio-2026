import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';
import { CHAPTER_ROUTES } from '@/data/navigation';

export function MobileChapterHub() {
  return (
    <section
      aria-labelledby="mobile-chapters-heading"
      className="border-t border-black/10 bg-[#E4E4E4] px-4 py-14 md:hidden"
    >
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#164CE0] uppercase">
              02 // PORTFOLIO CHAPTERS
            </p>
            <h2
              id="mobile-chapters-heading"
              className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#111111]"
            >
              Explore by Section
            </h2>
          </div>
          <Layers className="h-5 w-5 text-[#BE123C]" aria-hidden="true" />
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[#555555]">
          Each section opens on its own focused view for quick mobile browsing.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CHAPTER_ROUTES.map((chapter) => (
            <Link
              key={chapter.id}
              to={chapter.route}
              className="studio-card group flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4 transition-transform active:scale-[0.99]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#BE123C]">
                    {chapter.index}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-[#555555] uppercase">
                    ROUTE
                  </span>
                </div>
                <p className="mt-1 font-display text-base font-bold text-[#111111] group-hover:text-[#164CE0]">
                  {chapter.label}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#555555]">{chapter.title}</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-[#EEEEEE] text-[#111111] group-hover:border-[#2060FF]/50 group-hover:text-[#164CE0]">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5">
          <Link
            to="/projects"
            className="flex w-full items-center justify-between rounded-xl border border-[#2060FF]/35 bg-white px-4 py-3.5 font-mono text-xs font-semibold tracking-wider text-[#164CE0] uppercase shadow-xs"
          >
            <span>Browse Full Projects Index (6)</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

