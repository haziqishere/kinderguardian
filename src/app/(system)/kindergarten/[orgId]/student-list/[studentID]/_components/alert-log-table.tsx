// src/app/kindergarten/[orgId]/student-list/[studentId]/_components/alert-log-table.tsx
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

interface AlertLogTableProps {
  alertLogs: Student["alertLogs"];
}

export function AlertLogTable({ alertLogs }: AlertLogTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Alert Type</TableHead>
          <TableHead>Parent Action</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alertLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{format(new Date(log.alertTime), "PPP")}</TableCell>
            <TableCell>
              <Badge
                variant={log.alertType === "CALLED" ? "destructive" : "warning"}
              >
                {log.alertType}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  log.parentAction === "RESPONDED" ? "positive" : "destructive"
                }
              >
                {log.parentAction}
              </Badge>
            </TableCell>
            <TableCell>{log.reason || "N/A"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
