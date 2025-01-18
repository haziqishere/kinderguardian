// kindergarten/[orgId]/dashboard/_components/attendance-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AttendanceChartProps {
  data: {
    month: string;
    rate: number;
  }[];
}

export const AttendanceChart = ({ data }: AttendanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trends (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)}%`,
                  "Attendance Rate",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                name="Attendance Rate"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
