"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertTriangle, Camera } from "lucide-react";
import Image from "next/image";

interface Student {
  id: string;
  fullName: string;
  age: number;
  class: {
    id: string;
    name: string;
  } | null;
  daysAbsent: number;
  attendance: Array<{
    date: string;
    status: "PENDING" | "ON_TIME" | "LATE" | "ABSENT";
    timeRecorded: string;
  }>;
  alertLogs: Array<{
    id: string;
    alertTime: string;
    alertType: string;
    parentAction: string;
    reason: string | null;
  }>;
  faceImageFront?: string;
  faceImageLeft?: string;
  faceImageRight?: string;
  faceImageTiltUp?: string;
  faceImageTiltDown?: string;
}

interface StudentProfileProps {
  student: Student;
}

const calculateAttendanceRate = (attendance: Student["attendance"]) => {
  if (!attendance.length) return "N/A";
  const presentDays = attendance.filter(
    (a) => a.status === "ON_TIME" || a.status === "LATE"
  ).length;
  return ((presentDays / attendance.length) * 100).toFixed(1);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ON_TIME":
      return "bg-green-100 text-green-800";
    case "LATE":
      return "bg-yellow-100 text-yellow-800";
    case "ABSENT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function StudentProfile({ student }: StudentProfileProps) {
  const initials = student.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Student Basic Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{student.fullName}</h2>
              <div className="text-muted-foreground">
                Class: {student.class?.name || "Unassigned"}
              </div>
              <div className="text-muted-foreground">
                Age: {student.age} years old
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Badge
                  variant={student.daysAbsent > 5 ? "destructive" : "secondary"}
                >
                  {student.daysAbsent} Days Absent
                </Badge>
                <Badge variant="outline">
                  {calculateAttendanceRate(student.attendance)}% Attendance Rate
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Additional Information */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {student.attendance.map((record) => (
                  <div
                    key={record.date}
                    className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{formatDate(record.date)}</p>
                      <p className="text-sm text-muted-foreground">
                        Recorded at {formatTime(record.timeRecorded)}
                      </p>
                    </div>
                    <Badge
                      className={`mt-2 md:mt-0 ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {student.alertLogs.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col border-b pb-4 last:border-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {formatDate(alert.alertTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(alert.alertTime)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          alert.parentAction === "RESPONDED"
                            ? "default"
                            : "destructive"
                        }
                        className="mt-2 md:mt-0"
                      >
                        {alert.parentAction.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {alert.reason || "No reason provided"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Face Recognition Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { url: student.faceImageFront, label: "Front View" },
                  { url: student.faceImageLeft, label: "Left View" },
                  { url: student.faceImageRight, label: "Right View" },
                  { url: student.faceImageTiltUp, label: "Tilt Up" },
                  { url: student.faceImageTiltDown, label: "Tilt Down" },
                ].map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Card className="w-full h-full">
                      <CardContent className="p-2 flex items-center justify-center h-full">
                        {image.url ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={image.url}
                              alt={image.label}
                              fill
                              className="object-cover rounded-md"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                            <Camera className="h-8 w-8 mb-2" />
                            <span className="text-sm">{image.label}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
