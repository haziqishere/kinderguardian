// lib/types/alert.ts
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