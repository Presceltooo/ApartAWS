import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
export default queryClient;