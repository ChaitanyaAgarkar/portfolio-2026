import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLeetCodeStats,
  LEETCODE_REFERENCE_SNAPSHOT,
  readCachedLeetCodeStats,
  type CachedLeetCodePayload,
} from '@/lib/api/leetcode';
import type { LeetCodeStatsData } from '@/types/leetcode';

export interface UseLeetCodeStatsReturn {
  stats: LeetCodeStatsData;
  source: 'live' | 'cached' | 'snapshot';
  lastUpdated: number | null;
  isInitialLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export function useLeetCodeStats(): UseLeetCodeStatsReturn {
  const [cachedFallback, setCachedFallback] = useState<CachedLeetCodePayload | null>(null);

  useEffect(() => {
    setCachedFallback(readCachedLeetCodeStats());
  }, []);

  const query = useQuery({
    queryKey: ['leetcode-stats', 'chaitanyaagarkar'],
    queryFn: ({ signal }) => fetchLeetCodeStats(signal),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  if (query.data) {
    return {
      stats: query.data.data,
      source: 'live',
      lastUpdated: query.data.fetchedAt,
      isInitialLoading: false,
      isRefetching: query.isFetching,
      isError: false,
      errorMessage: null,
      refetch: () => {
        void query.refetch();
      },
    };
  }

  if (cachedFallback) {
    return {
      stats: cachedFallback.data,
      source: 'cached',
      lastUpdated: cachedFallback.fetchedAt,
      isInitialLoading: query.isLoading,
      isRefetching: query.isFetching,
      isError: query.isError,
      errorMessage: query.error instanceof Error ? query.error.message : null,
      refetch: () => {
        void query.refetch();
      },
    };
  }

  return {
    stats: LEETCODE_REFERENCE_SNAPSHOT,
    source: 'snapshot',
    lastUpdated: null,
    isInitialLoading: query.isLoading,
    isRefetching: query.isFetching,
    isError: query.isError,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    refetch: () => {
      void query.refetch();
    },
  };
}
