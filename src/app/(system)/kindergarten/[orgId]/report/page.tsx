"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, Search } from "lucide-react";

interface DummyClass {
  id: string;
  name: string;
}

interface DummyStudent {
  id: string;
  name: string;
  class: string;
  age: number;
  attendance: string;
  lateCount: number;
  absentCount: number;
  parentName: string;
  parentPhone: string;
}

const DUMMY_CLASSES: DummyClass[] = [
  { id: "1", name: "4 Kenyalang" },
  { id: "2", name: "4 Kenari" },
  { id: "3", name: "4 Mutiara" },
];

const DUMMY_STUDENTS: DummyStudent[] = [
  {
    id: "1",
    name: "Ahmad bin Abdullah",
    class: "4 Kenyalang",
    age: 4,
    attendance: "95%",
    lateCount: 2,
    absentCount: 1,
    parentName: "Abdullah bin Ahmad",
    parentPhone: "0123456789",
  },
  {
    id: "2",
    name: "Sarah binti Kamal",
    class: "4 Kenyalang",
    age: 4,
    attendance: "98%",
    lateCount: 1,
    absentCount: 0,
    parentName: "Kamal bin Ibrahim",
    parentPhone: "0123456788",
  },
  {
    id: "3",
    name: "Amir bin Hassan",
    class: "4 Kenari",
    age: 4,
    attendance: "92%",
    lateCount: 3,
    absentCount: 2,
    parentName: "Hassan bin Ali",
    parentPhone: "0123456787",
  },
];

export default function ReportPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        🔨Report Feature
      </h1>
      <p className="text-muted-foreground text-lg">
        We're working hard to bring you detailed student reports.
      </p>
      <p className="text-muted-foreground">Check back soon!</p>
    </div>
  );
}
/* export default function ReportPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = DUMMY_STUDENTS.filter((student) => {
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Reports</h1>
        <Button onClick={handlePrint} className="print:hidden">
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </div>

      <div className="flex gap-4 print:hidden">
        <div className="w-[200px]">
          <Select
            value={selectedClass || undefined}
            onValueChange={setSelectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              {DUMMY_CLASSES.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student or parent name"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Late Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Absent Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.age} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.attendance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.lateCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.absentCount}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{student.parentName}</div>
                        <div className="text-sm text-gray-500">
                          {student.parentPhone}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none;
          }
          #print-content,
          #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
 */
