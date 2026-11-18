import { ArrowLeft, FolderGit2 } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function NotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative z-10 flex min-h-[78vh] items-center justify-center px-4 pt-28 pb-20"
    >
      <div className="max-w-xl rounded-2xl border border-black/12 bg-white/95 p-8 text-center shadow-lg sm:p-12">
        <p className="font-mono text-xs font-semibold tracking-[0.24em] text-[#BE123C] uppercase">
          ERROR 404 // ROUTE NOT FOUND
        </p>
        <h1
          id="not-found-heading"
          className="mt-4 font-display text-4xl font-bold tracking-tight text-[#111111] sm:text-5xl"
        >
          COORDINATES UNKNOWN.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">
          The requested path does not map to a published section or project node inside The Digital
          Dimension.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton to="/" variant="primary" cursorLabel="HOME" className="font-mono text-xs uppercase">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Home</span>
          </MagneticButton>
          <MagneticButton
            to="/projects"
            variant="secondary"
            cursorLabel="WORK"
            className="font-mono text-xs uppercase"
          >
            <FolderGit2 className="h-4 w-4 text-[#BE123C]" aria-hidden="true" />
            <span>Browse Projects</span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
