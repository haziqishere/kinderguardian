"use client";

import { DataTable } from "../../_components/data-table";
import { Student, columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface StudentListProps {
  students: Student[];
}

export function StudentList({ students }: StudentListProps) {
  const params = useParams();
  const [selectedClass, setSelectedClass] = useState<string>("all");

  // Get unique classes
  const classes = Array.from(new Set(students.map((student) => student.class)));

  // Filter students by class
  const filteredStudents =
    selectedClass === "all"
      ? students
      : students.filter((student) => student.class === selectedClass);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Student List</h1>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by Class:</span>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredStudents}
          searchKey="name"
          showSearch={true}
        />
      </CardContent>
    </Card>
  );
}
