import { useState } from 'react';
import { Code2, Heart, MessageSquare, Plane, ShoppingBag, Sparkles, Terminal } from 'lucide-react';
import type { ProjectItem } from '@/types/project';
import { cn } from '@/lib/utils/cn';

interface ProjectPreviewProps {
  project: ProjectItem;
  interactive?: boolean;
}

const IDE_THEMES = [
  { name: 'Studio Violet', bg: '#F5F3FF', border: '#2060FF', keyword: '#2060FF', string: '#BE123C', text: '#111111' },
  { name: 'Cyan Lab', bg: '#FFF1F2', border: '#FF4060', keyword: '#BE123C', string: '#2060FF', text: '#111111' },
  { name: 'Obsidian Contrast', bg: '#0F172A', border: '#475569', keyword: '#38BDF8', string: '#C4B5FD', text: '#F8FAFC' },
];

export function ProjectPreview({ project, interactive = true }: ProjectPreviewProps) {
  const [ideThemeIdx, setIdeThemeIdx] = useState(0);
  const [lingoXp, setLingoXp] = useState(140);
  const [selectedRoute, setSelectedRoute] = useState<'DEL-BOM' | 'PNQ-BLR'>('DEL-BOM');

  if (project.screenshotPath) {
    return (
      <figure className="overflow-hidden rounded-xl border border-black/10 bg-[#EEEEEE]">
        <img
          src={project.screenshotPath}
          alt={`${project.title} application interface preview`}
          width={1200}
          height={720}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </figure>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-black/10 bg-[#E4E4E4] p-5 transition-colors duration-300 group-hover:border-[#2060FF]/25"
      aria-label={`Interactive architectural preview for ${project.title}`}
    >
      {/* Top chrome bar */}
      <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: project.accentColor }}
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#111111] uppercase">
            {project.title} // SYSTEM PREVIEW
          </span>
        </div>
        <span className="rounded border border-black/10 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-[#555555]">
          ILLUSTRATIVE VISUALIZATION
        </span>
      </div>

      {project.visualKind === 'chatttt' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="rounded-lg border border-black/10 bg-white p-3">
              <MessageSquare className="h-4 w-4 text-[#BE123C]" aria-hidden="true" />
              <p className="mt-2 font-semibold text-[#111111]">Socket.io</p>
              <p className="text-[10px] text-[#555555]">WS Bridge</p>
            </div>
            <div className="rounded-lg border border-[#FF4060]/45 bg-[#FFF1F2] p-3">
              <p className="text-[10px] font-semibold text-[#BE123C]">LATENCY</p>
              <p className="mt-1 text-base font-bold text-[#111111]">&lt;100ms</p>
              <p className="text-[10px] text-[#555555]">99.2% Uptime</p>
            </div>
            <div className="rounded-lg border border-black/10 bg-white p-3">
              <p className="text-[10px] font-semibold text-[#164CE0]">CACHE</p>
              <p className="mt-2 font-semibold text-[#111111]">Redis + Atlas</p>
              <p className="text-[10px] text-[#555555]">Rooms &amp; Auth</p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-black/10 bg-white p-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#555555]">
              <span>[room:engineering-sync]</span>
              <span className="font-semibold text-[#BE123C]">LIVE STREAM</span>
            </div>
            <div className="rounded bg-[#EEEEEE] px-3 py-2 text-[#111111]">
              &gt; WebSocket frame broadcasted to group &amp; private channels
            </div>
          </div>
        </div>
      )}

      {project.visualKind === 'lingo' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/10 bg-white px-3.5 py-2.5 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#164CE0]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              XP: <strong className="text-[#111111]">{lingoXp}</strong>
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-rose-600">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" aria-hidden="true" />
              5 Hearts
            </span>
            {interactive ? (
              <button
                type="button"
                onClick={() => setLingoXp((xp) => xp + 15)}
                className="rounded border border-[#2060FF]/40 bg-[#F5F3FF] px-2.5 py-1 text-[10px] font-semibold text-[#164CE0] hover:border-[#FF4060] hover:text-[#BE123C]"
              >
                + Complete Lesson (+15 XP)
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            {['01 Phonetics', '02 AI Voice Drill', '03 Vector Recall'].map((step, idx) => (
              <div
                key={step}
                className={cn(
                  'rounded-lg border p-3',
                  idx === 1
                    ? 'border-[#2060FF]/50 bg-[#F5F3FF] text-[#111111]'
                    : 'border-black/10 bg-white text-[#555555]',
                )}
              >
                <span className="block text-[10px] font-semibold text-[#BE123C]">STAGE 0{idx + 1}</span>
                <span className="mt-1 block font-medium">{step.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.visualKind === 'docs' && (
        <div className="space-y-3">
          <div className="rounded-lg border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between border-b border-black/10 pb-2 font-mono text-[10px] text-[#555555]">
              <span>workspace / architecture-rfc.doc</span>
              <span className="font-semibold text-[#BE123C]">OT SYNC &lt;50ms</span>
            </div>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#FFF1F2] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#BE123C]">
                  Cursor: Chaitanya
                </span>
                <span className="font-medium text-[#111111]">TipTap collaborative block tree</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#F5F3FF] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#164CE0]">
                  Comment Thread
                </span>
                <span className="text-[#555555]">Liveblocks annotations + Convex history</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {project.visualKind === 'flight-predictor' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <div className="flex gap-2">
              {(['DEL-BOM', 'PNQ-BLR'] as const).map((route) => (
                <button
                  key={route}
                  type="button"
                  onClick={() => setSelectedRoute(route)}
                  className={cn(
                    'rounded border px-2 py-1 font-medium transition-colors',
                    selectedRoute === route
                      ? 'border-[#0284C7] bg-[#E0F2FE] text-[#111111]'
                      : 'border-black/10 bg-white text-[#555555]',
                  )}
                >
                  {route}
                </button>
              ))}
            </div>
            <span className="font-semibold text-[#0369A1]">R² = 0.9729 · &lt;500ms</span>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-3">
            <svg viewBox="0 0 320 92" className="h-20 w-full" aria-hidden="true">
              <path
                d={
                  selectedRoute === 'DEL-BOM'
                    ? 'M 28 70 Q 160 8 292 66'
                    : 'M 28 58 Q 160 12 292 72'
                }
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.2"
                strokeDasharray="5 5"
              />
              <circle cx="28" cy={selectedRoute === 'DEL-BOM' ? 70 : 58} r="4.5" fill="#2060FF" />
              <circle cx="292" cy={selectedRoute === 'DEL-BOM' ? 66 : 72} r="4.5" fill="#FF4060" />
              <text x="20" y="86" fill="#555555" fontSize="9" fontWeight="600" fontFamily="monospace">
                {selectedRoute === 'DEL-BOM' ? 'DELHI' : 'PUNE'}
              </text>
              <text x="260" y="86" fill="#555555" fontSize="9" fontWeight="600" fontFamily="monospace">
                {selectedRoute === 'DEL-BOM' ? 'MUMBAI' : 'BENGALURU'}
              </text>
            </svg>
            <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-[#555555]">
              <span className="inline-flex items-center gap-1">
                <Plane className="h-3 w-3 text-[#0284C7]" aria-hidden="true" />
                Random Forest Regressor
              </span>
              <span>Flask REST Inference</span>
            </div>
          </div>
        </div>
      )}

      {project.visualKind === 'editum-ide' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#164CE0]">
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
              10 Languages · &lt;1s Exec
            </span>
            {interactive ? (
              <div className="flex gap-1 font-mono text-[10px]">
                {IDE_THEMES.map((theme, idx) => (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => setIdeThemeIdx(idx)}
                    className={cn(
                      'rounded border px-2 py-0.5 font-medium transition-colors',
                      ideThemeIdx === idx
                        ? 'border-[#2060FF] bg-[#F5F3FF] text-[#111111]'
                        : 'border-black/10 bg-white text-[#555555]',
                    )}
                  >
                    {theme.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div
            className="rounded-lg border p-3.5 font-mono text-xs transition-colors"
            style={{
              backgroundColor: IDE_THEMES[ideThemeIdx].bg,
              borderColor: `${IDE_THEMES[ideThemeIdx].border}66`,
              color: IDE_THEMES[ideThemeIdx].text,
            }}
          >
            <p style={{ color: IDE_THEMES[ideThemeIdx].keyword }}>
              async function{' '}
              <span style={{ color: IDE_THEMES[ideThemeIdx].text }}>executeSnippet</span>(lang) &#123;
            </p>
            <p className="pl-4" style={{ color: IDE_THEMES[ideThemeIdx].string }}>
              return edgeRunner.run(&#123; lang, timeoutMs: 1000 &#125;);
            </p>
            <p style={{ color: IDE_THEMES[ideThemeIdx].keyword }}>&#125;</p>
          </div>
        </div>
      )}

      {project.visualKind === 'ecommerce-platform' && (
        <div className="grid gap-2.5 font-mono text-[11px] sm:grid-cols-3">
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <ShoppingBag className="h-4 w-4 text-[#BE123C]" aria-hidden="true" />
            <p className="mt-2 font-semibold text-[#111111]">Mobile App</p>
            <p className="mt-1 text-[10px] text-[#555555]">React Native + Expo + Stripe</p>
          </div>
          <div className="rounded-lg border border-[#2060FF]/35 bg-[#F5F3FF] p-3">
            <Terminal className="h-4 w-4 text-[#164CE0]" aria-hidden="true" />
            <p className="mt-2 font-semibold text-[#111111]">Express REST API</p>
            <p className="mt-1 text-[10px] text-[#555555]">Clerk RBAC + Inngest Jobs</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <p className="text-[10px] font-semibold text-[#BE123C]">OBSERVABILITY</p>
            <p className="mt-2 font-semibold text-[#111111]">Admin + Sentry</p>
            <p className="mt-1 text-[10px] text-[#555555]">Live Analytics Dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
}
