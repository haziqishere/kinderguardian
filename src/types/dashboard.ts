// types/dashboard.ts
import { AlertLog, AttendanceStatus } from "@prisma/client";

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  lateToday: number;
  absentNoReason: number;
}

export interface ClassUtilization {
  id: string;
  name: string;
  capacity: number;
  studentCount: number;
  utilizationRate: number;
}

export interface AttendanceChartData {
  month: string;
  rate: number;
}

export interface ArrivedStudent {
  id: string;
  name: string;
  class: string;
  arrivalTime: Date;
  status: AttendanceStatus;
}

export interface DashboardData {
  stats: DashboardStats;
  classUtilization: ClassUtilization[];
  attendanceChart: AttendanceChartData[];
  arrivedStudents: ArrivedStudent[];
  events: Event[];
  alerts: AlertLog[];
}