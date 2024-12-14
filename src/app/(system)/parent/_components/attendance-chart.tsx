"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const AttendanceChart = () => {
  const attendanceData = [
    { month: 'Jan', attendance: 80 },
    { month: 'Feb', attendance: 85 },
    { month: 'Mar', attendance: 75 },
    { month: 'Apr', attendance: 90 },
    { month: 'May', attendance: 88 },
    { month: 'Jun', attendance: 92 },
    { month: 'Jul', attendance: 85 },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
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