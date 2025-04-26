import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de cache
      refetchOnWindowFocus: true, // revalida ao focar aba
      refetchInterval: 25000, // revalida a cada 25 segundos
    },
  },
});
