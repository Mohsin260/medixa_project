import {
  MutationCache,
  QueryCache,
  QueryClient,
  type DefaultOptions,
} from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    } satisfies DefaultOptions,
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
  });
}
