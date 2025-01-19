export interface Student {
  id: string;
  fullName: string;
  age: number;
  daysAbsent: number;
  attendanceRate: string;
  class: {
    id: string;
    name: string;
  };
  attendance: Array<{
    id: string;
    date: string;
    status: "PENDING" | "ON_TIME" | "LATE" | "ABSENT";
    timeRecorded: string;
  }>;
  alertLogs: Array<{
    id: string;
    alertTime: string;
    alertType: string;
    parentAction: string;
    reason: string | null;
  }>;
} 