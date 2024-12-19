"use client";
import { useState } from "react";
import { ClassList } from "./_components/class-list";
import { EditClassDialog } from "./_components/edit-class-dialog";
import { Class } from "./types";

export default function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (class_: Class) => {
    setSelectedClass(class_);
    setEditDialogOpen(true);
  };

  const handleUpdate = (updatedClass: Class) => {
    // Update the class list with the updated class
    // This function should be passed to ClassList and EditClassDialog
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Classes</h1>
      </div>
      <ClassList onEdit={handleEdit} />
      {selectedClass && (
        <EditClassDialog
          class_={selectedClass}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
