// parent/_components/dashboard-content.tsx
"use client";
import { useState } from "react";
import { DashboardStats } from "./dashboard-stats";
import { AttendanceChart } from "./attendance-chart";
import AlertList from "./alert-list";
import EventList from "./event-list";
import { ChildSwitcher } from "./child-switcher";

// Sample data - replace with actual data fetching
const sampleChildren = [
  {
    id: "1",
    name: "Haris Azhari bin Zaharudin",
    class: "5 Kenyala",
    stats: {
      lateCount: 4,
      attendanceRate: "93%",
      absentNoReason: 1,
    },
    attendanceData: [
      { month: "Jan", attendance: 80 },
      { month: "Feb", attendance: 85 },
      { month: "Mar", attendance: 75 },
      { month: "Apr", attendance: 90 },
      { month: "May", attendance: 88 },
      { month: "Jun", attendance: 92 },
      { month: "Jul", attendance: 85 },
    ],
  },
  {
    id: "2",
    name: "Sarah Azhari",
    class: "4 Mentari",
    stats: {
      lateCount: 2,
      attendanceRate: "95%",
      absentNoReason: 0,
    },
    attendanceData: [
      { month: "Jan", attendance: 95 },
      { month: "Feb", attendance: 92 },
      { month: "Mar", attendance: 94 },
      { month: "Apr", attendance: 96 },
      { month: "May", attendance: 93 },
      { month: "Jun", attendance: 95 },
      { month: "Jul", attendance: 94 },
    ],
  },
];

export const DashboardContent = () => {
  const [selectedChildId, setSelectedChildId] = useState(sampleChildren[0].id);
  const selectedChild = sampleChildren.find(
    (child) => child.id === selectedChildId
  )!;

  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <ChildSwitcher
        children={sampleChildren}
        selectedChild={selectedChild}
        onChildChange={setSelectedChildId}
      />
      <DashboardStats childStats={selectedChild.stats} />
      <AttendanceChart data={selectedChild.attendanceData} />
      <AlertList childId={selectedChild.id} />
      <EventList classId={selectedChild.class} />
    </div>
  );
};
