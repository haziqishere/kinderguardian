"use client";

import { useStudent } from "@/hooks/useStudents";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StudentProfile } from "./_components/student-profile";

export default function StudentPage() {
  const params = useParams();
  const router = useRouter();
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
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Children List
        </Button>
      </div>
      <div className="space-y-6">
        <StudentProfile student={data.data} />
      </div>
    </div>
  );
}
