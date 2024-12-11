// src/app/(dashboard)/parent/_components/dashboard-content.tsx
"use client";

import { DashboardStats } from "./dashboard-stats";
import { AttendanceChart } from "./attendance-chart";
import  AlertList  from "./alert-list";
import  EventList  from "./event-list";

export const DashboardContent = () => {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <DashboardStats />
      <AttendanceChart />
      <AlertList />
      <EventList />
    </div>
  );
};