"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";

interface Class {
  id: string;
  name: string;
  capacity: number;
  studentCount: number;
}

interface ClassListProps {
  classes: Class[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function ClassList({ classes, onDelete, isLoading }: ClassListProps) {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
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

      {filteredClasses.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No classes found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((class_) => (
            <Card key={class_.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{class_.name}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/kindergarten/${params.orgId}/classes/${class_.id}/edit`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(class_.id)}
                      disabled={class_.studentCount > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      {class_.studentCount} / {class_.capacity} students
                    </span>
                  </div>
                  <Progress
                    value={(class_.studentCount / class_.capacity) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    {Math.round((class_.studentCount / class_.capacity) * 100)}%
                    Full
                  </span>
                  <span>
                    {class_.capacity - class_.studentCount} spots remaining
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
