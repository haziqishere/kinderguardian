// src/app/kindergarten/[orgId]/student-list/[studentId]/_components/attendance-table.tsx
"use client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types/student";

interface AttendanceTableProps {
  attendance: Student["attendance"];
}

export function AttendanceTable({ attendance }: AttendanceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time Recorded</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendance.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
            <TableCell>
              <Badge
                variant={
                  record.status === "ON_TIME"
                    ? "positive"
                    : record.status === "LATE"
                    ? "warning"
                    : "destructive"
                }
              >
                {record.status.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(record.timeRecorded), "p")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
