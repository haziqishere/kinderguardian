"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertList } from "../_components/alert-list";
import { getAlerts } from "@/actions/alert";
import { Alert, AlertType } from "@prisma/client";

type AlertStatus = "Messaged" | "Called";

interface AlertStudent {
  id: string;
  name: string;
  class: string;
  attendancePerformance: string;
  parentAction: "Responded" | "No Response";
  alertStatus: AlertStatus;
  reason?: string;
}

export default function AlertListPage() {
  const { orgId } = useParams();
  const [respondedData, setRespondedData] = useState<AlertStudent[]>([]);
  const [awaitingData, setAwaitingData] = useState<AlertStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const result = await getAlerts(orgId as string, "ADMIN");
        if (result.data) {
          // For now, we'll use the alert title as the student name and message as reason
          const responded = result.data
            .filter((alert) => alert.isRead)
            .map((alert) => ({
              id: alert.id,
              name: alert.title,
              class: "N/A", // We'll need to add this to the alert model
              attendancePerformance: "99.5%", // TODO: Calculate from attendance data
              parentAction: "Responded" as const,
              alertStatus: "Messaged" as AlertStatus,
              reason: alert.message,
            }));

          const awaiting = result.data
            .filter((alert) => !alert.isRead)
            .map((alert) => ({
              id: alert.id,
              name: alert.title,
              class: "N/A", // We'll need to add this to the alert model
              attendancePerformance: "99.5%", // TODO: Calculate from attendance data
              parentAction: "No Response" as const,
              alertStatus: "Called" as AlertStatus,
            }));

          setRespondedData(responded);
          setAwaitingData(awaiting);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [orgId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AlertList respondedData={respondedData} awaitingData={awaitingData} />
  );
}
