// app/(system)/kindergarten/[orgId]/student-list/[studentId]/page.tsx
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

  // Log params to see what we're getting
  console.log("URL Params:", params);

  // The parameter name in the URL is 'studentID' (with capital 'ID')
  const studentId = params.studentID as string;

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

  const { data, isLoading, error } = useStudent(studentId);

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

  if (error || !data) {
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
        <Card>
          <CardContent className="py-10 text-center text-destructive">
            {error?.message || "Failed to load student profile"}
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
        <StudentProfile student={data.data} />
      </div>
    </div>
  );
}
