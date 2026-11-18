import { useState, type ReactNode } from 'react';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppQueryClient } from './queryClient';

export function QueryProvider({
  children,
  client,
}: {
  children: ReactNode;
  client?: QueryClient;
}) {
  const [queryClient] = useState(() => client ?? createAppQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
