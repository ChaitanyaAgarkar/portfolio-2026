import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Award,
  CheckCircle2,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { PROFILE } from '@/data/profile';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buildSubmissionHeatmap, getAcceptedSubmissions } from '@/lib/api/leetcode';
import { animateRevealGroup, gsap } from '@/lib/animations/gsap';
import {
  computePercentage,
  formatNumber,
  formatRelativeTimestamp,
  formatUtcTime,
} from '@/lib/utils/formatters';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils/cn';

const LazyBreakdownChart = lazy(() => import('./LeetCodeBreakdownChart'));

export function CodingStats() {
  const mounted = useHasMounted();
  const reducedMotion = useReducedMotion();
  const {
    stats,
    source,
    lastUpdated,
    isInitialLoading,
    isRefetching,
    isError,
    errorMessage,
    refetch,
  } = useLeetCodeStats();

  const [displaySolved, setDisplaySolved] = useState(stats.totalSolved);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = animateRevealGroup(sectionRef.current, '[data-coding-reveal]', {
      y: 22,
      stagger: 0.07,
    });
    return () => ctx?.revert();
  }, []);

  useEffect(() => {
    if (reducedMotion || !mounted) {
      setDisplaySolved(stats.totalSolved);
      return;
    }

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: stats.totalSolved,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => setDisplaySolved(Math.round(counter.value)),
    });

    return () => {
      tween.kill();
    };
  }, [stats.totalSolved, reducedMotion, mounted]);

  const breakdownData = useMemo(
    () => [
      {
        name: 'Easy',
        solved: stats.easySolved,
        total: stats.totalEasy,
        color: '#FF4060',
      },
      {
        name: 'Medium',
        solved: stats.mediumSolved,
        total: stats.totalMedium,
        color: '#2060FF',
      },
      {
        name: 'Hard',
        solved: stats.hardSolved,
        total: stats.totalHard,
        color: '#D97706',
      },
    ],
    [stats],
  );

  const heatmapDays = useMemo(() => {
    const entries = Object.keys(stats.submissionCalendar);
    if (entries.length === 0) return [];
    return buildSubmissionHeatmap(stats.submissionCalendar, 16);
  }, [stats.submissionCalendar]);

  const acceptedSubmissions = useMemo(
    () => getAcceptedSubmissions(stats.recentSubmissions, 6),
    [stats.recentSubmissions],
  );

  return (
    <section
      id="coding"
      ref={sectionRef}
      aria-labelledby="coding-heading"
      className="relative z-10 border-t border-black/10 bg-[#EEEEEE] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="coding-heading">
          <SectionHeading
            eyebrow="08 // ALGORITHMIC TELEMETRY"
            title="LEETCODE CODING STATISTICS."
            subtitle="Live algorithmic problem-solving metrics synchronized via TanStack Query and validated at runtime with Zod."
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={refetch}
                  disabled={isRefetching}
                  aria-label="Refresh LeetCode statistics"
                  className="inline-flex items-center gap-2 rounded-lg border border-black/12 bg-white px-3.5 py-2.5 font-mono text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#FF4060]/60 hover:text-[#BE123C] disabled:opacity-60"
                >
                  <RefreshCw
                    className={cn('h-3.5 w-3.5', isRefetching && 'animate-spin')}
                    aria-hidden="true"
                  />
                  <span>{isRefetching ? 'Syncing...' : 'Refresh'}</span>
                </button>

                <a
                  href={PROFILE.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="OPEN"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#FF4060]/40 bg-[#FFF1F2] px-4 py-2.5 font-mono text-xs font-semibold text-[#BE123C] transition-colors hover:bg-[#FFE4E6]"
                >
                  <span>LeetCode Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            }
          />
        </div>

        {/* Status / Resilience Banner */}
        <div
          data-coding-reveal
          className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xs shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                source === 'live'
                  ? 'bg-[#FF4060]'
                  : source === 'cached'
                    ? 'bg-[#2060FF]'
                    : 'bg-amber-500',
              )}
              aria-hidden="true"
            />
            <span className="font-semibold text-[#111111]">
              {source === 'live'
                ? 'LIVE API SYNC ACTIVE'
                : source === 'cached'
                  ? 'CACHED LIVE SNAPSHOT'
                  : 'REFERENCE SNAPSHOT FALLBACK'}
            </span>
            {isError && errorMessage ? (
              <span className="inline-flex items-center gap-1.5 text-amber-700">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Live endpoint unreachable; displaying verified fallback metrics.
              </span>
            ) : null}
          </div>

          <span className="text-[#555555]">
            {lastUpdated
              ? `Last synced at ${formatUtcTime(lastUpdated)}`
              : 'Initial reference snapshot (live sync pending)'}
          </span>
        </div>

        {/* Primary KPI Row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            data-coding-reveal
            className="studio-card rounded-2xl border border-black/10 bg-white p-6 shadow-xs"
          >
            <p className="font-mono text-xs font-semibold tracking-wider text-[#555555] uppercase">
              Total Solved
            </p>
            {isInitialLoading && source === 'snapshot' ? (
              <div className="mt-3 h-10 w-28 animate-pulse rounded bg-[#E4E4E4]" aria-hidden="true" />
            ) : (
              <p className="mt-2 font-display text-4xl font-bold text-[#111111]">
                {formatNumber(displaySolved)}
                <span className="ml-2 font-mono text-sm font-normal text-[#555555]">
                  / {formatNumber(stats.totalQuestions)}
                </span>
              </p>
            )}
            <p className="mt-2 font-mono text-[11px] font-semibold text-[#BE123C]">
              {computePercentage(stats.totalSolved, stats.totalQuestions)}% Problem Bank Completion
            </p>
          </div>

          <div
            data-coding-reveal
            className="studio-card rounded-2xl border border-black/10 bg-white p-6 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#555555] uppercase">
                Global Ranking
              </p>
              <Trophy className="h-4 w-4 text-[#164CE0]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-[#111111]">
              #{formatNumber(stats.ranking)}
            </p>
            <p className="mt-2 font-mono text-[11px] text-[#555555]">Worldwide LeetCode Rank</p>
          </div>

          <div
            data-coding-reveal
            className="studio-card rounded-2xl border border-black/10 bg-white p-6 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#555555] uppercase">
                Contribution Points
              </p>
              <Award className="h-4 w-4 text-[#BE123C]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-[#111111]">
              {formatNumber(stats.contributionPoint)}
            </p>
            <p className="mt-2 font-mono text-[11px] text-[#555555]">Verified Community Score</p>
          </div>

          <div
            data-coding-reveal
            className="studio-card rounded-2xl border border-black/10 bg-white p-6 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#555555] uppercase">
                Difficulty Split
              </p>
              <Activity className="h-4 w-4 text-[#BE123C]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-sm font-semibold text-[#111111]">
              <span className="text-[#BE123C]">{stats.easySolved}E</span>
              <span className="mx-2 text-slate-900/20">/</span>
              <span className="text-[#164CE0]">{stats.mediumSolved}M</span>
              <span className="mx-2 text-slate-900/20">/</span>
              <span className="text-amber-600">{stats.hardSolved}H</span>
            </p>
            <p className="mt-3 font-mono text-[11px] text-[#555555]">
              Distinct accepted problems per tier
            </p>
          </div>
        </div>

        {/* Difficulty Progress + Recharts Distribution */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div
            data-coding-reveal
            className="studio-card min-w-0 rounded-2xl border border-black/10 bg-white p-5 shadow-xs sm:p-6 lg:col-span-6"
          >
            <h3 className="font-display text-lg font-bold text-[#111111]">
              Difficulty Distribution
            </h3>
            <div className="mt-5 space-y-4">
              {breakdownData.map((tier) => {
                const pct = computePercentage(tier.solved, tier.total);
                return (
                  <div key={tier.name}>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-semibold text-[#111111]">{tier.name}</span>
                      <span className="text-[#555555]">
                        <strong className="text-[#111111]">{tier.solved}</strong> / {tier.total} (
                        {pct}%)
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`${tier.name} problems solved`}
                      aria-valuenow={tier.solved}
                      aria-valuemin={0}
                      aria-valuemax={tier.total}
                      className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E4E4E4]"
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: tier.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {mounted ? (
              <div className="mt-6 border-t border-black/10 pt-4">
                <Suspense
                  fallback={
                    <div className="h-[200px] w-full animate-pulse rounded-xl bg-[#E4E4E4]" />
                  }
                >
                  <LazyBreakdownChart data={breakdownData} />
                </Suspense>
              </div>
            ) : null}
          </div>

          {/* Heatmap + Recent Accepted Submissions */}
          <div className="min-w-0 space-y-6 lg:col-span-6">
            <div className="min-w-0 rounded-2xl border border-black/10 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-[#111111]">
                  Submission Activity (16 Weeks)
                </h3>
                <span className="font-mono text-[11px] text-[#555555]">UTC Calendar</span>
              </div>

              {heatmapDays.length > 0 ? (
                <div
                  className="mt-4 grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1"
                  role="img"
                  aria-label="LeetCode submission heatmap for the past 16 weeks"
                >
                  {heatmapDays.map((day) => (
                    <div
                      key={day.dateKey}
                      title={`${day.label}: ${day.count} submission${day.count === 1 ? '' : 's'}`}
                      className={cn(
                        'h-3.5 w-3.5 rounded-[3px]',
                        day.level === 0 && 'bg-[#E4E4E4]',
                        day.level === 1 && 'bg-[#FF4060]/35',
                        day.level === 2 && 'bg-[#FF4060]/65',
                        day.level === 3 && 'bg-[#2060FF]/80',
                        day.level === 4 && 'bg-[#2060FF]',
                      )}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-black/10 bg-[#EEEEEE] p-4 font-mono text-xs text-[#555555]">
                  Activity calendar populates automatically when live LeetCode telemetry is reachable.
                </p>
              )}
            </div>

            <div className="min-w-0 rounded-2xl border border-black/10 bg-white p-5 shadow-xs sm:p-6">
              <h3 className="font-display text-lg font-bold text-[#111111]">
                Recent Accepted Submissions
              </h3>

              {isInitialLoading && acceptedSubmissions.length === 0 ? (
                <div className="mt-4 space-y-2.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-[#E4E4E4]" />
                  ))}
                </div>
              ) : acceptedSubmissions.length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {acceptedSubmissions.map((sub) => (
                    <li
                      key={`${sub.titleSlug}-${sub.timestamp}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-[#EEEEEE] px-4 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <a
                          href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex max-w-full items-center gap-1.5 text-sm font-medium text-[#111111] hover:text-[#164CE0]"
                        >
                          <CheckCircle2
                            className="h-3.5 w-3.5 shrink-0 text-[#BE123C]"
                            aria-hidden="true"
                          />
                          <span className="truncate">{sub.title}</span>
                        </a>
                        <p className="mt-0.5 font-mono text-[11px] text-[#555555]">
                          {formatRelativeTimestamp(sub.timestamp)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded border border-[#2060FF]/30 bg-[#F5F3FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#164CE0] uppercase">
                        {sub.lang}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-xl border border-black/10 bg-[#EEEEEE] p-4 font-mono text-xs text-[#555555]">
                  Recent accepted submissions are only displayed from live API responses.{' '}
                  <a
                    href={PROFILE.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#BE123C] underline"
                  >
                    View latest submissions on LeetCode
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
