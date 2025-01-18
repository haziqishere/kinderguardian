// kindergarten/[orgId]/dashboard/_components/class-utilization.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ClassUtilizationProps {
  data: {
    id: string;
    name: string;
    capacity: number;
    studentCount: number;
    utilizationRate: number;
  }[];
}

export const ClassUtilization = ({ data }: ClassUtilizationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Utilization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((class_) => (
          <div key={class_.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{class_.name}</p>
                <p className="text-sm text-muted-foreground">
                  {class_.studentCount} / {class_.capacity} students
                </p>
              </div>
              <span className="text-sm font-medium">
                {Math.round(class_.utilizationRate)}%
              </span>
            </div>
            <Progress
              value={class_.utilizationRate}
              className={cn(
                "h-2",
                class_.utilizationRate > 90
                  ? "bg-red-500"
                  : class_.utilizationRate > 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
