// src/app/kindergarten/[orgId]/student-list/[studentId]/_components/student-profile.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertTriangle, Camera } from "lucide-react";
import { AttendanceTable } from "./attendance-table";
import { AlertLogTable } from "./alert-log-table";
import { Student } from "@/types/student";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentProfileProps {
  student: Student;
}

export function StudentProfile({ student }: StudentProfileProps) {
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const initials = student.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/images/${student.id}`);
        if (!response.ok) throw new Error("Failed to fetch images");

        const data = await response.json();
        setImageUrls(data.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [student.id]);

  const handleImageError = (imageType: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [imageType]: true,
    }));
  };

  const PhotoCard = ({
    url,
    label,
    type,
  }: {
    url: string | null;
    label: string;
    type: string;
  }) => (
    <div className="relative aspect-square">
      <Card className="w-full h-full">
        <CardContent className="p-2 flex items-center justify-center h-full">
          {url && !imageErrors[type] ? (
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={label}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => handleImageError(type)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
              <Camera className="h-8 w-8 mb-2" />
              <span className="text-sm">{label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

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
                  {student.attendanceRate}% Attendance Rate
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
              <CardTitle>Face Recognition Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(imageUrls).map(([type, url]) => (
                  <PhotoCard
                    key={type}
                    url={url}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    type={type}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
