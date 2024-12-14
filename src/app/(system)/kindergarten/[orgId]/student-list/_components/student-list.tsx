"use client";

import { DataTable } from "../../_components/data-table";
import { Student, columns } from "./column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StudentListProps {
  students: Student[];
}

export function StudentList({ students }: StudentListProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-xl font-semibold">Student List</h1>
        <DataTable
          columns={columns}
          data={students}
          searchKey="name"
          showSearch={true}
        />
      </CardContent>
    </Card>
  );
}
