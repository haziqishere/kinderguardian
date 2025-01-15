"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDashboardStats, getRecentActivities } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Users, School, Bell } from "lucide-react";
import { format } from "date-fns";
import { DashboardStats, Activity } from "./types";

export default function DashboardPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsResult, activitiesResult] = await Promise.all([
        getDashboardStats(params.orgId as string),
        getRecentActivities(params.orgId as string),
      ]);

      if (statsResult.data) setStats(statsResult.data);
      if (activitiesResult.data) setActivities(activitiesResult.data);
      setLoading(false);
    };

    fetchData();
  }, [params.orgId]);

  if (loading || !stats) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.totalClasses} classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Utilization
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.overallUtilization)}%
            </div>
            <Progress value={stats.overallUtilization} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.upcomingEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">In the next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.unreadAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Class Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Class Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.classUtilization.map((class_) => (
                <div key={class_.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{class_.name}</span>
                    <span className="text-muted-foreground">
                      {class_.studentCount}/{class_.capacity} students
                    </span>
                  </div>
                  <Progress value={class_.utilizationRate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <Alert
                  key={index}
                  variant={
                    activity.type === "ALERT" ? "destructive" : "default"
                  }
                >
                  <AlertTitle className="flex items-center justify-between">
                    {activity.title}
                    <span className="text-sm font-normal text-muted-foreground">
                      {format(new Date(activity.date), "MMM d, h:mm a")}
                    </span>
                  </AlertTitle>
                  <AlertDescription className="mt-1 text-sm">
                    {activity.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
