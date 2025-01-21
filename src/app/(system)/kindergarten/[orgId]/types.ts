import { Alert, Event } from "@prisma/client";

export interface ClassUtilization {
  id: string;
  name: string;
  capacity: number;
  studentCount: number;
  utilizationRate: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  upcomingEvents: Event[];
  unreadAlerts: Alert[];
  classUtilization: ClassUtilization[];
  overallUtilization: number;
}

export interface Activity {
  type: 'EVENT' | 'ALERT';
  title: string;
  description: string;
  date: Date;
  data: Event | Alert;
} 