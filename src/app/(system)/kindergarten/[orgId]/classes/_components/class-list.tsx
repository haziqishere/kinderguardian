"use client";
import { useState } from "react";
import { ClassCard } from "./class-card";
import { Search } from "lucide-react";
import { AddClassDialog } from "./add-class-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Class } from "../types";

// Dummy data
const initialClasses: Class[] = [
  { id: "1", name: "5 Kenyala", capacity: 25, studentCount: 20 },
  { id: "2", name: "5 Kenari", capacity: 25, studentCount: 22 },
  { id: "3", name: "4 Mentari", capacity: 25, studentCount: 18 },
  { id: "4", name: "4 Mutiara", capacity: 25, studentCount: 23 },
];

export function ClassList({ onEdit }: { onEdit: (class_: Class) => void }) {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const handleDelete = async (id: string) => {
    // Add delete action later
    setClasses((prevClasses) => prevClasses.filter((c) => c.id !== id));
  };

  const handleAdd = (newClass: any) => {
    setClasses((prevClasses) => [...prevClasses, newClass]);
  };

  const handleUpdate = (updatedClass: any) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
  };

  const filteredClasses = classes
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "capacity":
          return b.capacity - a.capacity;
        case "utilization":
          return b.studentCount / b.capacity - a.studentCount / a.capacity;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              className="pl-8 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="bg-white rounded-sm">
            <Select defaultValue="name" onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="capacity">Capacity</SelectItem>
                <SelectItem value="utilization">Utilization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AddClassDialog onAdd={handleAdd} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((class_) => (
          <ClassCard
            key={class_.id}
            class_={class_}
            onDelete={handleDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
