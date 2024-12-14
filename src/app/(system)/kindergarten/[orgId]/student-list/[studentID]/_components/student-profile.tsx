// src/app/kindergarten/[orgId]/student-list/[studentId]/_components/student-profile.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceTable } from "./attendance-table";
import { AlertLogTable } from "./alert-log-table";

interface StudentProfileProps {
  student: any; // We'll type this properly later
}

export function StudentProfile({ student }: StudentProfileProps) {
  return (
    <>
      {/* Student Basic Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {student.fullName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{student.fullName}</h2>
              <div className="text-sm text-muted-foreground">
                {student.class.name}
              </div>
              <div className="text-sm">Age: {student.age} years old</div>
              <div className="flex items-center mt-4 space-x-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Days Absent:</span>{" "}
                  {student.daysAbsent}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Attendance Rate:
                  </span>{" "}
                  {calculateAttendanceRate(student.attendance)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Additional Information */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList>
          <TabsTrigger value="attendance">Attendance History</TabsTrigger>
          <TabsTrigger value="alerts">Alert Logs</TabsTrigger>
          <TabsTrigger value="photos">Face Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTable attendance={student.attendance} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertLogTable alertLogs={student.alertLogs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Face Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {student.faceImageFront && (
                  <img
                    src={student.faceImageFront}
                    alt="Front"
                    className="rounded-lg"
                  />
                )}
                {/* Add other face images similarly */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function calculateAttendanceRate(attendance: any[]) {
  if (!attendance || attendance.length === 0) return "100.0";

  const totalDays = attendance.length;
  const presentDays = attendance.filter(
    (record) => record.status === "ON_TIME" || record.status === "LATE"
  ).length;

  const rate = (presentDays / totalDays) * 100;
  return rate.toFixed(1); // Returns one decimal place
}
