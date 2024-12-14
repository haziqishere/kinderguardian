"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useParams } from "next/navigation";

export type Student = {
  id: string;
  name: string;
  age: number;
  class: string;
  daysAbsent: number;
  attendancePerformance: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Students",
    cell: ({ row }) => {
      const router = useRouter();
      const params = useParams();
      const student = row.original;
      return (
        <div
          onClick={() =>
            router.push(
              `/kindergarten/${params.orgId}/student-list/${student.id}`
            )
          }
          className="flex items-center gap-2"
        >
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
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "daysAbsent",
    header: () => <div className="text-center">Days Absent</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("daysAbsent")}</div>;
    },
  },
  {
    accessorKey: "attendancePerformance",
    header: () => <div className="text-center">Attendance Performance</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("attendancePerformance")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const params = useParams();
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/kindergarten/${params.orgId}/student-list/${student.id}`
                )
              }
            >
              View Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
