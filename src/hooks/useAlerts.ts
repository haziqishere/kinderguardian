// hooks/useAlerts.ts
import { useQuery } from "@tanstack/react-query";
import { AlertsData } from "@/types/alert";

export function useAlerts(kindergartenId: string) {
  return useQuery<AlertsData>({  
    queryKey: ['alerts', kindergartenId],
    queryFn: async () => {
      const response = await fetch(`/api/kindergarten/${kindergartenId}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      return data.data;
    }
  });
}