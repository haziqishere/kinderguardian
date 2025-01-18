import { useQuery } from "@tanstack/react-query";

// hooks/useArrivedStudents.ts
export function useArrivedStudents(kindergartenId: string) {
    return useQuery({
      queryKey: ['dashboard', 'arrived', kindergartenId],
      queryFn: async () => {
        const response = await fetch(`/api/kindergarten/${kindergartenId}/dashboard/arrived`);
        if (!response.ok) throw new Error('Failed to fetch arrived students');
        return response.json();
      },
      refetchInterval: 30000 // Refetch every 30 seconds
    });
  }