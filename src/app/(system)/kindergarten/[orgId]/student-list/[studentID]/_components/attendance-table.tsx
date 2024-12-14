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

interface AttendanceTableProps {
  attendance: any[]; // Type this properly
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
            <TableCell>{format(record.date, "PPP")}</TableCell>
            <TableCell>
              <Badge
                variant={
                  record.status === "ON_TIME"
                    ? "positive"
                    : record.status === "LATE"
                    ? "warning"
                    : "negative"
                }
              >
                {record.status}
              </Badge>
            </TableCell>
            <TableCell>{format(record.timeRecorded, "p")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
