// parent/_components/dashboard-stats.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, UserX } from "lucide-react";
import { TotalChildren } from "./total-children";

interface ChildStats {
  lateCount: number;
  attendanceRate: string;
  absentNoReason: number;
}

interface DashboardStatsProps {
  childStats: ChildStats;
}

export const DashboardStats = ({ childStats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
      <TotalChildren />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late Count</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{childStats.lateCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Absent (No Reason)
          </CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{childStats.absentNoReason}</div>
        </CardContent>
      </Card>
    </div>
  );
};
