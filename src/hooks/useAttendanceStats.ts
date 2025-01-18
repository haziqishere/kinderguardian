import { useQuery } from "@tanstack/react-query";

// hooks/useAttendanceStats.ts
export function useAttendanceStats(kindergartenId: string) {
    return useQuery({
      queryKey: ['dashboard', 'attendance', kindergartenId],
      queryFn: async () => {
        const response = await fetch(`/api/kindergarten/${kindergartenId}/dashboard/attendance`);
        if (!response.ok) throw new Error('Failed to fetch attendance stats');
        return response.json();
      }
    });
  }
  