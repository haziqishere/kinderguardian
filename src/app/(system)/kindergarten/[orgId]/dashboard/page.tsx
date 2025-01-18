// kindergarten/[orgId]/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardTabs } from "./_components/dashboard-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const { orgId } = useParams();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/kindergarten/${orgId}/dashboard`);
        const result = await response.json();
        if (result.data) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [orgId]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {dashboardData && <DashboardTabs data={dashboardData} />}
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="p-6 space-y-6">
    <Skeleton className="h-8 w-48" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
    <Skeleton className="h-[300px]" />
  </div>
);
