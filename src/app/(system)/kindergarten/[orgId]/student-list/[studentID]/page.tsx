// app/(system)/kindergarten/[orgId]/student-list/[studentID]/page.tsx
"use client";

import { useStudent } from "@/hooks/useStudents";
import { StudentProfile } from "./_components/student-profile";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentID as string;
  const { data: student, isLoading } = useStudent(studentId ?? "");

  // Render missing student ID state
  if (!studentId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center text-destructive">
            Student ID is missing
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render loading state
  if (isLoading || !student) {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Student List
        </Button>
      </div>
      <div className="space-y-6">
        <StudentProfile student={student} />
      </div>
    </div>
  );
}
