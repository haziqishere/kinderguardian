// kindergarten/[orgId]/dashboard/_components/dashboard-tabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "./dashboard-stats";
import { AttendanceChart } from "./attendance-chart";
import { ArrivedStudentsTable } from "./arrived-students-table";
import { ClassUtilization } from "./class-utilization";
import { AttendanceStatus } from "@prisma/client";

interface DashboardTabsProps {
  data: {
    stats: {
      totalStudents: number;
      presentToday: number;
      lateToday: number;
      absentNoReason: number;
    };
    classUtilization: {
      id: string;
      name: string;
      capacity: number;
      studentCount: number;
      utilizationRate: number;
    }[];
    attendanceChart: {
      month: string;
      rate: number;
    }[];
    arrivedStudents: {
      id: string;
      name: string;
      class: string;
      arrivalTime: Date;
      status: AttendanceStatus;
    }[];
    events: any[];
    alerts: any[];
  };
}

export function DashboardTabs({ data }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="classes">Classes</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid gap-6">
          <DashboardStats stats={data.stats} />
          <div className="bg-white p-6 rounded-lg border">
            <ArrivedStudentsTable students={data.arrivedStudents} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="attendance">
        <AttendanceChart data={data.attendanceChart} />
      </TabsContent>

      <TabsContent value="classes">
        <ClassUtilization data={data.classUtilization} />
      </TabsContent>
    </Tabs>
  );
}
