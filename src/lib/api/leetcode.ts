import { SITE_CONFIG } from '@/data/profile';
import {
  LeetCodeApiResponseSchema,
  type LeetCodeStatsData,
  type RecentSubmissionItem,
} from '@/types/leetcode';

/**
 * Initial reference snapshot supplied at project inception.
 * Live API data overrides these values whenever reachable.
 * Recent submissions and heatmap days are intentionally empty here so
 * unavailable data is never fabricated.
 */
export const LEETCODE_REFERENCE_SNAPSHOT: LeetCodeStatsData = {
  totalSolved: 548,
  totalSubmissions: [
    { difficulty: 'All', count: 549, submissions: 737 },
    { difficulty: 'Easy', count: 205, submissions: 279 },
    { difficulty: 'Medium', count: 257, submissions: 343 },
    { difficulty: 'Hard', count: 87, submissions: 115 },
  ],
  totalQuestions: 4110,
  easySolved: 204,
  totalEasy: 975,
  mediumSolved: 257,
  totalMedium: 2146,
  hardSolved: 87,
  totalHard: 989,
  ranking: 179919,
  contributionPoint: 4053,
  reputation: 0,
  submissionCalendar: {},
  recentSubmissions: [],
  matchedUserStats: undefined,
};

const CACHE_KEY = 'ca_portfolio_leetcode_cache_v1';

export interface CachedLeetCodePayload {
  data: LeetCodeStatsData;
  fetchedAt: number;
}

export function parseLeetCodeResponse(raw: unknown): LeetCodeStatsData {
  const parsed = LeetCodeApiResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('LeetCode API returned an unexpected payload shape.');
  }
  return parsed.data;
}

export function readCachedLeetCodeStats(): CachedLeetCodePayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data?: unknown; fetchedAt?: number };
    if (typeof parsed.fetchedAt !== 'number') return null;
    const validData = parseLeetCodeResponse(parsed.data);
    return { data: validData, fetchedAt: parsed.fetchedAt };
  } catch {
    return null;
  }
}

export function writeCachedLeetCodeStats(payload: CachedLeetCodePayload): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

export async function fetchLeetCodeStats(
  signal?: AbortSignal,
  endpoint: string = SITE_CONFIG.leetcodeApiUrl,
): Promise<CachedLeetCodePayload> {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), 8500);

  const onParentAbort = () => timeoutController.abort();
  signal?.addEventListener('abort', onParentAbort, { once: true });

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      throw new Error(`LeetCode API request failed with status ${response.status}.`);
    }

    const json: unknown = await response.json();
    const data = parseLeetCodeResponse(json);
    const payload: CachedLeetCodePayload = {
      data,
      fetchedAt: Date.now(),
    };
    writeCachedLeetCodeStats(payload);
    return payload;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onParentAbort);
  }
}

export function getAcceptedSubmissions(items: RecentSubmissionItem[], limit = 6): RecentSubmissionItem[] {
  return items
    .filter((item) => item.statusDisplay.toLowerCase() === 'accepted')
    .slice(0, limit);
}

export interface HeatmapDay {
  dateKey: string;
  label: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function buildSubmissionHeatmap(
  calendar: Record<string, number>,
  weeks = 16,
): HeatmapDay[] {
  const dayCounts = new Map<string, number>();

  for (const [tsStr, count] of Object.entries(calendar)) {
    const ts = Number(tsStr);
    if (!Number.isFinite(ts) || count <= 0) continue;
    const date = new Date(ts * 1000);
    const key = date.toISOString().slice(0, 10);
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + count);
  }

  const totalDays = weeks * 7;
  const result: HeatmapDay[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let offset = totalDays - 1; offset >= 0; offset--) {
    const d = new Date(today.getTime() - offset * 86400000);
    const key = d.toISOString().slice(0, 10);
    const count = dayCounts.get(key) ?? 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count === 2) level = 2;
    else if (count === 1) level = 1;

    result.push({
      dateKey: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      count,
      level,
    });
  }

  return result;
}

