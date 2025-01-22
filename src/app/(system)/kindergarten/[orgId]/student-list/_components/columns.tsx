"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
  daysAbsent: number;
  attendancePerformance: string;
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "daysAbsent",
    header: "Days Absent",
  },
  {
    accessorKey: "attendancePerformance",
    header: "Attendance",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const params = useParams();
      const student = row.original;

      return (
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/kindergarten/${params.orgId}/student-list/${student.id}`}
          >
            <Eye className="w-4 h-4" />
          </Link>
        </Button>
      );
    },
  },
];
