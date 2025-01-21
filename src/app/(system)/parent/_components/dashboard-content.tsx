// parent/_components/dashboard-content.tsx
"use client";

import { DashboardStats } from "./dashboard-stats";
import { AttendanceChart } from "./attendance-chart";
import AlertList from "./alert-list";
import EventList from "./event-list";
import { format, subMonths, eachMonthOfInterval } from "date-fns";
import { DashboardSkeleton } from "./loading-skeleton";
import { useQuery } from "@tanstack/react-query";

interface DashboardContentProps {
  childId: string;
}

interface ChildStats {
  lateCount: number;
  attendanceRate: string;
  absentNoReason: number;
}

interface ChildDashboardData {
  data: {
    stats: ChildStats;
    attendance: Array<{
      date: string;
      status: "PENDING" | "ON_TIME" | "LATE" | "ABSENT";
      timeRecorded: string;
    }>;
    class: {
      id: string;
      name: string;
      kindergartenId: string;
    };
  };
}

export const DashboardContent = ({ childId }: DashboardContentProps) => {
  // Fetch child's dashboard data
  const { data: dashboardData, isLoading } = useQuery<ChildDashboardData>({
    queryKey: ["childDashboard", childId],
    queryFn: async () => {
      const response = await fetch(`/api/parent/children/${childId}/dashboard`);
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      return response.json();
    },
  });

  if (isLoading || !dashboardData) {
    return <DashboardSkeleton />;
  }

  // Process attendance data for chart
  const lastSixMonths = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const attendanceData = lastSixMonths.map((month) => {
    const monthStr = format(month, "MMM");
    const monthAttendance = dashboardData.data.attendance.filter(
      (a) => new Date(a.date).getMonth() === month.getMonth()
    );

    const attendanceRate =
      monthAttendance.length > 0
        ? (monthAttendance.filter((a) => ["ON_TIME", "LATE"].includes(a.status))
            .length /
            monthAttendance.length) *
          100
        : 0;

    return {
      month: monthStr,
      attendance: attendanceRate,
    };
  });

  return (
    <div className="space-y-68">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <DashboardStats childStats={dashboardData.data.stats} />
      <AttendanceChart data={attendanceData} />
      <AlertList childId={childId} />
      <EventList
        classId={dashboardData.data.class.id}
        kindergartenId={dashboardData.data.class.kindergartenId}
      />
    </div>
  );
};
