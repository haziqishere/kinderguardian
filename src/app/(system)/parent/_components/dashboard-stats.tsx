// parent/_components/dashboard-stats.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Bell, MessageSquareWarning } from "lucide-react";

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
    <div className="grid grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Children</div>
              <div className="text-2xl font-bold">1</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Late This Month</div>
              <div className="text-2xl font-bold">{childStats.lateCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Monthly Attendance</div>
              <div className="text-2xl font-bold">
                {childStats.attendanceRate}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 rounded">
              <MessageSquareWarning className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Absent No Reason</div>
              <div className="text-2xl font-bold">
                {childStats.absentNoReason}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
