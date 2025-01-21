// parent/_components/alert-list.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AlertItem from "./alert-item";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Alert {
  id: string;
  alertTime: string;
  alertType: string;
  parentAction: string;
  reason: string | null;
  student: {
    id: string;
    fullName: string;
  };
}

interface AlertListProps {
  childId: string;
}

export default function AlertList({ childId }: AlertListProps) {
  const { data: alerts, isLoading } = useQuery<{ data: Alert[] }>({
    queryKey: ["alerts", childId],
    queryFn: async () => {
      const response = await fetch(`/api/parent/children/${childId}/alerts`);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
  });

  // Filter for unresolved alerts only
  const unresolvedAlerts = alerts?.data?.filter(
    (alert) => alert.parentAction === "NO_RESPONSE"
  );

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Alert List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!unresolvedAlerts || unresolvedAlerts.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Alert List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No pending alerts
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 md:mb-4">
      <CardHeader className="p-4 md:p-6">
        <CardTitle>Alert List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unresolvedAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              id={alert.id}
              name={alert.student.fullName}
              alertType={alert.alertType}
              alertTime={alert.alertTime}
              parentAction={alert.parentAction}
              reason={alert.reason}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
