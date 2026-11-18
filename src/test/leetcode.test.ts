import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  buildSubmissionHeatmap,
  fetchLeetCodeStats,
  getAcceptedSubmissions,
  parseLeetCodeResponse,
} from '@/lib/api/leetcode';

const VALID_PAYLOAD = {
  totalSolved: 552,
  totalSubmissions: [
    { difficulty: 'All', count: 555, submissions: 760 },
    { difficulty: 'Easy', count: 206, submissions: 282 },
  ],
  totalQuestions: 4120,
  easySolved: 205,
  totalEasy: 980,
  mediumSolved: 259,
  totalMedium: 2150,
  hardSolved: 88,
  totalHard: 990,
  ranking: 175000,
  contributionPoint: 4065,
  reputation: 0,
  submissionCalendar: {
    [String(Math.floor(Date.now() / 1000))]: 3,
  },
  recentSubmissions: [
    {
      title: 'Two Sum',
      titleSlug: 'two-sum',
      timestamp: '1776005077',
      statusDisplay: 'Accepted',
      lang: 'java',
    },
    {
      title: 'Median of Two Sorted Arrays',
      titleSlug: 'median-of-two-sorted-arrays',
      timestamp: '1775919363',
      statusDisplay: 'Wrong Answer',
      lang: 'java',
    },
  ],
};

describe('LeetCode API parsing & helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses valid API payload and keeps totalSolved distinct from totalSubmissions', () => {
    const parsed = parseLeetCodeResponse(VALID_PAYLOAD);
    expect(parsed.totalSolved).toBe(552);
    expect(parsed.totalSubmissions[0].submissions).toBe(760);
    expect(parsed.easySolved).toBe(205);
    expect(parsed.mediumSolved).toBe(259);
    expect(parsed.hardSolved).toBe(88);
  });

  it('throws on malformed or error payloads', () => {
    expect(() => parseLeetCodeResponse({ errors: [{ message: 'Not found' }] })).toThrow();
    expect(() => parseLeetCodeResponse(null)).toThrow();
  });

  it('filters recent submissions to only Accepted items', () => {
    const parsed = parseLeetCodeResponse(VALID_PAYLOAD);
    const accepted = getAcceptedSubmissions(parsed.recentSubmissions);
    expect(accepted).toHaveLength(1);
    expect(accepted[0].title).toBe('Two Sum');
  });

  it('builds a 16-week heatmap array matching day counts', () => {
    const days = buildSubmissionHeatmap(VALID_PAYLOAD.submissionCalendar, 16);
    expect(days).toHaveLength(16 * 7);
    const totalCount = days.reduce((acc, d) => acc + d.count, 0);
    expect(totalCount).toBe(3);
  });

  it('throws cleanly when fetch returns non-OK HTTP status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    await expect(fetchLeetCodeStats(undefined, 'https://example.test/lc')).rejects.toThrow(
      '503',
    );
  });
});

