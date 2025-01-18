// hooks/useAlerts.ts
import { useQuery } from "@tanstack/react-query";
import { AlertType, ParentAction } from "@prisma/client";

export interface AlertStudent {
  id: string;
  name: string;
  class: string;
  attendancePerformance: string;
  parentAction: ParentAction;
  alertStatus: AlertType;
  reason?: string;
}

export interface AlertsData {
  responded: AlertStudent[];
  awaiting: AlertStudent[];
}

export function useAlerts(kindergartenId: string) {
  return useQuery({  // Remove the generic type parameter
    queryKey: ['alerts', kindergartenId],
    queryFn: async () => {
      const response = await fetch(`/api/kindergarten/${kindergartenId}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      return data.data;
    }
  });
}