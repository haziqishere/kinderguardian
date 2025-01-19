"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";

interface ChildrenCountResponse {
  data: {
    totalChildren: number;
  };
}

export const TotalChildren = () => {
  const { data: childrenCount, isLoading } = useQuery<ChildrenCountResponse>({
    queryKey: ["childrenCount"],
    queryFn: async () => {
      const response = await fetch("/api/parent/children/count");
      if (!response.ok) throw new Error("Failed to fetch children count");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Children</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Children</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {childrenCount?.data.totalChildren || 0}
        </div>
      </CardContent>
    </Card>
  );
};
