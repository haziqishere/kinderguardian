"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getAttendanceStats } from "@/actions/dashboard";

interface AttendanceData {
  month: string;
  value: number;
}

interface AttendanceStats {
  date: Date;
  attendanceRate: number;
}

export const AttendanceChart = () => {
  const { orgId } = useParams();
  const [data, setData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const result = await getAttendanceStats(orgId as string);
        if (result.data) {
          // Transform the data into the format we need
          const chartData = result.data.map((stat: AttendanceStats) => ({
            month: new Date(stat.date).toLocaleString("default", {
              month: "short",
            }),
            value: Math.round(stat.attendanceRate * 100),
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStats();
  }, [orgId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
