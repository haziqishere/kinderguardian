// hooks/useStudents.ts
import { useQuery } from "@tanstack/react-query";
import { Student } from "@prisma/client";

export function useStudents(kindergartenId: string) {
  return useQuery({
    queryKey: ['students', kindergartenId],
    queryFn: async () => {
      const response = await fetch(`/api/kindergarten/${kindergartenId}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    }
  });
}

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      if (!studentId) throw new Error("Student ID is required");
      
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }
      return response.json();
    },
    enabled: !!studentId, // Only run the query if we have a studentId
  });
}