"use client";

import { useState, useEffect, useCallback } from "react";
import { ClassList } from "./_components/class-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { getClasses, deleteClass } from "@/actions/class";
import { toast } from "sonner";
import { CreateClassDialog } from "./_components/create-class-dialog";

interface Class {
  id: string;
  name: string;
  capacity: number;
  studentCount: number;
}

export default function ClassesPage() {
  const params = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const result = await getClasses(params.orgId as string);
    if (result.error) {
      toast.error(result.error);
    } else {
      setClasses(result.data || []);
    }
    setLoading(false);
  }, [params.orgId]);

  // Initial fetch
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleDelete = async (id: string) => {
    const result = await deleteClass(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Class deleted successfully");
      fetchClasses(); // Refresh the list
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Class
        </Button>
      </div>

      <ClassList
        classes={classes}
        onDelete={handleDelete}
        isLoading={loading}
      />

      <CreateClassDialog
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onSuccess={() => {
          setIsCreating(false);
          fetchClasses();
        }}
      />
    </div>
  );
}
