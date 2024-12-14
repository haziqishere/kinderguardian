"use client";
import { ColumnDef } from "@tanstack/react-table";
import { AlertStudent } from "./types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const awaitingColumns: ColumnDef<AlertStudent>[] = [
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
    id: "callParent",
    cell: ({ row }) => {
      return (
        <Button variant="secondary" size="sm">
          <Phone className="mr-2 h-4 w-4" />
          Call Parent
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
