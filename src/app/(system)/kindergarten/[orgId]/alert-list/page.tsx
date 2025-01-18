// app/kindergarten/[orgId]/alert-list/page.tsx
"use client";

import { AlertList } from "../_components/alert-list";
import { useAlerts } from "@/hooks/useAlerts";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AlertListPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { data, isLoading, error } = useAlerts(params.orgId);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="text-muted-foreground mt-2">Loading alerts...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center text-destructive">
            Failed to load alerts
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AlertList
        respondedData={data?.responded || []}
        awaitingData={data?.awaiting || []}
      />
    </div>
  );
}
