// src/app/kindergarten/[orgId]/classes/_components/edit-class-dialog.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UpdateClassSchemaType,
  UpdateClassSchema,
} from "@/actions/class/schema";
import { updateClass } from "@/actions/class";
import { Class } from "../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditClassDialogProps {
  class_: Class;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updatedClass: Class) => void;
}

export function EditClassDialog({
  class_,
  open,
  onOpenChange,
  onUpdate,
}: EditClassDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateClassSchemaType>({
    resolver: zodResolver(UpdateClassSchema),
    defaultValues: {
      id: class_.id,
      name: class_.name,
      capacity: class_.capacity,
    },
  });

  const handleClose = () => {
    form.reset();
    setLoading(false);
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateClassSchemaType) => {
    try {
      setLoading(true);
      const response = await updateClass(data);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Class updated successfully");
      handleClose();
      if (onUpdate) {
        onUpdate({
          ...response.data,
          studentCount: class_.studentCount,
        } as Class);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg z-50">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5 Kenyala" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
