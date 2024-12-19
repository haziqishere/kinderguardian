"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EditClassDialog } from "./edit-class-dialog";
import { useState } from "react";
import { toast } from "sonner";

import { Class } from "../types";

interface ClassCardProps {
  class_: Class;
  onUpdate?: (updatedClass: Class) => void;
  onDelete: (id: string) => void;
  onEdit: (class_: Class) => void; // Add this line
}

export function ClassCard({
  class_,
  onUpdate,
  onDelete,
  onEdit,
}: ClassCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleUpdate = (updatedClass: Class) => {
    if (onUpdate) {
      onUpdate(updatedClass);
    }
  };
  const handleDelete = () => {
    // Add confirmation dialog
    if (window.confirm("Are you sure you want to delete this class?")) {
      onDelete(class_.id);
      toast.success("Class deleted successfully");
    }
  };
  const handleEditClose = (open: boolean) => {
    setShowEditDialog(open);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{class_.name}</h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  class_.studentCount >= class_.capacity
                    ? "destructive"
                    : "secondary"
                }
              >
                {class_.studentCount}/{class_.capacity} Students
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(class_)}>
                    Edit Class
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                  >
                    Delete Class
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Capacity Usage</div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${(class_.studentCount / class_.capacity) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm">
              View Students
            </Button>
          </div>
        </div>
      </CardContent>
      <EditClassDialog
        class_={class_}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdate={onUpdate}
      />
    </Card>
  );
}
