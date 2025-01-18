// app/(system)/kindergarten/[orgId]/student-list/[studentId]/page.tsx
"use client";

import { useStudent } from "@/hooks/useStudents";
import { StudentProfile } from "./_components/student-profile";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function StudentPage() {
  const params = useParams();
  const { data, isLoading, error } = useStudent(params.studentId as string);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="text-muted-foreground mt-2">
              Loading student profile...
            </p>
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
            Failed to load student profile
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <StudentProfile student={data.data} />
    </div>
  );
}
