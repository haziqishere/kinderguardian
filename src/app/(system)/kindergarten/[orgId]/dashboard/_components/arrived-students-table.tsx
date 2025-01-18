// kindergarten/[orgId]/dashboard/_components/arrived-students-table.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { AttendanceStatus } from "@prisma/client";

// Update the interface to match the API response
interface ArrivedStudent {
  id: string;
  name: string;
  class: string;
  arrivalTime: Date;
  status: AttendanceStatus;
}

interface ArrivedStudentsTableProps {
  students: ArrivedStudent[];
}

export const ArrivedStudentsTable = ({
  students,
}: ArrivedStudentsTableProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.class.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.ON_TIME:
        return "positive";
      case AttendanceStatus.LATE:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusDisplay = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.ON_TIME:
        return "On Time";
      case AttendanceStatus.LATE:
        return "Late";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={AttendanceStatus.ON_TIME}>On Time</SelectItem>
            <SelectItem value={AttendanceStatus.LATE}>Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  {format(new Date(student.arrivalTime), "h:mm a")}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(student.status)}>
                    {getStatusDisplay(student.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
