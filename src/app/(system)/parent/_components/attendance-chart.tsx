// parent/_components/attendance-chart.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AttendanceChartProps {
  data: Array<{
    month: string;
    attendance: number;
  }>;
}

export const AttendanceChart = ({ data }: AttendanceChartProps) => {
  return (
    <Card className="mb-4 md:mb-8">
      <CardHeader className="p-4 md:p-6">
        <CardTitle>Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
