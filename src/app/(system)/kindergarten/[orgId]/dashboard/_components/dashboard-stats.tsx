// kindergarten/[orgId]/dashboard/_components/dashboard-stats.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, getColorClasses } from "@/lib/utils";
import { GraduationCap, Clock, Users, AlertTriangle } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "blue" | "yellow" | "green" | "red";
}

interface DashboardStatsProps {
  stats: {
    totalStudents: number;
    presentToday: number;
    lateToday: number;
    absentNoReason: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const attendingPercentage = Math.round(
    (stats.presentToday / stats.totalStudents) * 100
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
        label="Total Students"
        value={stats.totalStudents}
        color="blue"
      />
      <StatCard
        icon={<Clock className="w-6 h-6 text-yellow-600" />}
        label="Late Today"
        value={stats.lateToday}
        color="yellow"
      />
      <StatCard
        icon={<Users className="w-6 h-6 text-green-700" />}
        label="Attending Today"
        value={`${attendingPercentage}%`}
        color="green"
      />
      <StatCard
        icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
        label="Absent No Reason"
        value={stats.absentNoReason}
        color="red"
      />
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <Card className="bg-white">
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        <div className={cn("p-2 rounded", getColorClasses(color))}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
