"use client";
import { ColumnDef } from "@tanstack/react-table";
import { AlertStudent } from "@/types/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const respondedColumns: ColumnDef<AlertStudent>[] = [
  {
    accessorKey: "name",
    header: "Students",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{student.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-muted-foreground">{student.class}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "attendancePerformance",
    header: "Attendance Performance",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
];
