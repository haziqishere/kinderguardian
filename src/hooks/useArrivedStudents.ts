// src/hooks/useAlerts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertLog } from "@prisma/client";

interface UseAlertsProps {
  studentId: string;
}

export function useAlerts({ studentId }: UseAlertsProps) {
  return useQuery<AlertLog[]>({
    queryKey: ['alerts', studentId],
    queryFn: async () => {
      const response = await fetch(`/api/parent/children/${studentId}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      alertId, 
      status, 
      reason 
    }: { 
      alertId: string; 
      status: 'LATE' | 'ABSENT'; 
      reason: string;
    }) => {
      const response = await fetch(`/api/parent/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve alert');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}