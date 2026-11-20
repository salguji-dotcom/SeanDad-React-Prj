import { QueryClient } from '@tanstack/react-query';

// 서버 상태 (TanStack Query). 오류 안내는 client.js 인터셉터가 하므로 재시도하지 않습니다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});
