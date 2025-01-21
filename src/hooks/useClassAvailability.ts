// hooks/useClassAvailability.ts
import { useQuery } from "@tanstack/react-query";

export function useClassAvailability(classId: string | undefined) {
  return useQuery({
    queryKey: ['class-availability', classId],
    queryFn: async () => {
      if (!classId) return null;

      const response = await fetch('/api/parent/kindergarten-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId }),
      });

      if (!response.ok) {
        throw new Error('Failed to check class availability');
      }

      return response.json();
    },
    enabled: !!classId,
  });
}