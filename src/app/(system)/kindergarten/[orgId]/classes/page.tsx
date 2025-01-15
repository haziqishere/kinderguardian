"use client";
import { useState } from "react";
import { ClassList } from "./_components/class-list";
import { Class } from "./types";

// Dummy data
const initialClasses: Class[] = [
  { id: "1", name: "5 Kenyala", capacity: 25, studentCount: 20 },
  { id: "2", name: "5 Kenari", capacity: 25, studentCount: 22 },
  { id: "3", name: "4 Mentari", capacity: 25, studentCount: 18 },
  { id: "4", name: "4 Mutiara", capacity: 25, studentCount: 23 },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(initialClasses);

  const handleUpdate = (updatedClass: Class) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
  };

  const handleDelete = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Classes</h1>
      </div>
      <ClassList
        classes={classes}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
