// hooks/useDashboardStats.ts
import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  overallUtilization: number;
  classUtilization: Array<{
    id: string;
    name: string;
    capacity: number;
    studentCount: number;
    utilizationRate: number;
  }>;
  currentDayStats: {
    present: number;
    late: number;
    absent: number;
    absentNoReason: number;
  };
}

export function useDashboardStats(kindergartenId: string) {
  return useQuery({
    queryKey: ['dashboard', 'stats', kindergartenId],
    queryFn: async () => {
      const response = await fetch(`/api/kindergarten/${kindergartenId}/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    }
  });
}


