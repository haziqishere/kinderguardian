// app/(auth)/setup/_components/basic-info-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Kindergarten name is required")
    .max(100, "Name is too long"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address is too long"),
});

type FormData = z.infer<typeof formSchema>;

interface BasicInfoFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  isSubmitting?: boolean;
  error?: string;
}

export function BasicInfoForm({
  onSubmit,
  defaultValues,
  isSubmitting,
  error,
}: BasicInfoFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      address: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="mb-6 p-3 bg-destructive/15 border border-destructive/30 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kindergarten Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter kindergarten name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is how your kindergarten will be displayed to parents and
                staff
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter full address"
                  rows={3}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide the complete physical address of your
                kindergarten
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              </div>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
