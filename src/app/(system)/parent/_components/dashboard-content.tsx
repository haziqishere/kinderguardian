// parent/_components/dashboard-content.tsx
"use client";
import { useState, useEffect } from "react";
import { DashboardStats } from "./dashboard-stats";
import { AttendanceChart } from "./attendance-chart";
import AlertList from "./alert-list";
import EventList from "./event-list";
import { ChildSwitcher, Child } from "./child-switcher";
import { dummyChildren } from "../_lib/dummy_data";
import { format, subMonths, eachMonthOfInterval } from "date-fns";
import { DashboardSkeleton } from "./loading-skeleton";

export const DashboardContent = () => {
  const [loading, setLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childrenData, setChildrenData] = useState(dummyChildren);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setChildrenData(dummyChildren);
        setSelectedChildId(dummyChildren[0].id);
      } catch (error) {
        console.error("Failed to load children data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !selectedChildId) {
    return <DashboardSkeleton />;
  }

  const selectedChild = childrenData.find(
    (child) => child.id === selectedChildId
  )!;

  // Map dummy data to Child interface for ChildSwitcher
  const childrenForSwitcher: Child[] = childrenData.map((child) => ({
    id: child.id,
    name: child.name,
    class: child.class,
    imageUrl: undefined,
  }));

  const selectedChildForSwitcher: Child = {
    id: selectedChild.id,
    name: selectedChild.name,
    class: selectedChild.class,
    imageUrl: undefined,
  };

  // Process attendance data for chart
  const lastSixMonths = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const attendanceData = lastSixMonths.map((month) => {
    const monthStr = format(month, "MMM");
    const monthAttendance = selectedChild.attendance.filter(
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
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <ChildSwitcher
        children={childrenForSwitcher}
        selectedChild={selectedChildForSwitcher}
        onChildChange={setSelectedChildId}
        isLoading={loading}
      />
      <DashboardStats childStats={selectedChild.stats} />
      <AttendanceChart data={attendanceData} />
      <AlertList childId={selectedChild.id} />
      <EventList classId={selectedChild.class.id} />
    </div>
  );
};
