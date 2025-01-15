"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Clock, Users, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";

interface ClassUtilization {
  id: string;
  name: string;
  capacity: number;
  studentCount: number;
  utilizationRate: number;
}

interface DashboardStatsData {
  totalStudents: number;
  totalClasses: number;
  overallUtilization: number;
  upcomingEvents: {
    attendees: {
      name: string;
      id: string;
      type: string;
      createdAt: Date;
      updatedAt: Date;
      status: string;
      eventId: string;
    }[];
  }[];
  unreadAlerts: any[];
  classUtilization: {
    id: string;
    name: string;
    capacity: number;
    studentCount: number;
    utilizationRate: number;
  }[];
}

export const DashboardStats = () => {
  const { orgId } = useParams();
  const [stats, setStats] = useState<DashboardStatsData>({
    totalStudents: 0,
    totalClasses: 0,
    overallUtilization: 0,
    upcomingEvents: [],
    unreadAlerts: [],
    classUtilization: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats(orgId as string);
        if (result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [orgId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate attendance metrics
  const lateStudents = Math.round(stats.totalStudents * 0.05); // Example calculation
  const attendingPercentage = Math.round(stats.overallUtilization * 100);
  const absentNoReason = stats.unreadAlerts.length; // Using unread alerts as proxy for now

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Late Students</p>
              <p className="text-2xl font-bold">{lateStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded">
              <Users className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Attending Students
              </p>
              <p className="text-2xl font-bold">{attendingPercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Absent No Reason</p>
              <p className="text-2xl font-bold">{absentNoReason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
