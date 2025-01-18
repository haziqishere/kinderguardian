// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";

export function useDashboard(kindergartenId: string) {
  return useQuery({
    queryKey: ['dashboard', kindergartenId],
    queryFn: async () => {
      const response = await fetch(`/api/kindergarten/${kindergartenId}/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
    refetchInterval: 30000 // Refetch every 30 seconds to keep data fresh
  });
}