"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassSchema, ClassSchemaType } from "@/actions/class/schema";
import { createClass } from "@/actions/class";
import { toast } from "sonner";
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

interface CreateClassDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateClassDialog({
  open,
  onClose,
  onSuccess,
}: CreateClassDialogProps) {
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<ClassSchemaType>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      name: "",
      capacity: 25,
      kindergartenId: params.orgId as string,
    },
  });

  const onSubmit = async (data: ClassSchemaType) => {
    try {
      setLoading(true);
      const result = await createClass(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Class created successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
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
                    <Input placeholder="e.g. 5 Kenyala" {...field} />
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
                      min={1}
                      max={40}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Class"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
