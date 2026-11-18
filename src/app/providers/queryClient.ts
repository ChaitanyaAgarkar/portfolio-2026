import { QueryClient } from '@tanstack/react-query';

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

