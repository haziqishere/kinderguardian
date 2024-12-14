"use client";
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

type Student = {
  id: string;
  name: string;
  age: number;
  class: string;
  arrivalTime: string;
  status: "On Time" | "Late";
};

const students: Student[] = [
  {
    id: "1",
    name: "Muhammad Adam bin Idris",
    age: 5,
    class: "5 Kenyala",
    arrivalTime: "7:08am",
    status: "On Time",
  },
  // Add more sample data...
];

export const ArrivedStudentsTable = () => {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Students</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{student.name}</span>
                </div>
              </TableCell>
              <TableCell>{student.age}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.arrivalTime}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    student.status === "On Time" ? "positive" : "negative"
                  }
                >
                  {student.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
