import { z } from 'zod';

export const DifficultySubmissionSchema = z.object({
  difficulty: z.string(),
  count: z.number(),
  submissions: z.number(),
});

export const RecentSubmissionSchema = z.object({
  title: z.string(),
  titleSlug: z.string(),
  timestamp: z.union([z.string(), z.number()]).transform((val) => String(val)),
  statusDisplay: z.string(),
  lang: z.string(),
});

export const LeetCodeApiResponseSchema = z.object({
  totalSolved: z.number().nonnegative(),
  totalSubmissions: z.array(DifficultySubmissionSchema).optional().default([]),
  totalQuestions: z.number().positive(),
  easySolved: z.number().nonnegative(),
  totalEasy: z.number().positive(),
  mediumSolved: z.number().nonnegative(),
  totalMedium: z.number().positive(),
  hardSolved: z.number().nonnegative(),
  totalHard: z.number().positive(),
  ranking: z.number().nonnegative(),
  contributionPoint: z.number().nonnegative().optional().default(0),
  reputation: z.number().optional().default(0),
  submissionCalendar: z.record(z.string(), z.number()).optional().default({}),
  recentSubmissions: z.array(RecentSubmissionSchema).optional().default([]),
  matchedUserStats: z
    .object({
      acSubmissionNum: z.array(DifficultySubmissionSchema).optional().default([]),
      totalSubmissionNum: z.array(DifficultySubmissionSchema).optional().default([]),
    })
    .optional(),
});

export type LeetCodeStatsData = z.infer<typeof LeetCodeApiResponseSchema>;
export type RecentSubmissionItem = z.infer<typeof RecentSubmissionSchema>;

export interface LeetCodeQueryResult {
  data: LeetCodeStatsData;
  source: 'live' | 'fallback';
  fetchedAt: number;
  errorMessage?: string;
}

