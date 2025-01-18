// app/(auth)/setup/_components/operating-hours-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DayOfWeek } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const operatingHourSchema = z
  .object({
    dayOfWeek: z.nativeEnum(DayOfWeek),
    isOpen: z.boolean(),
    startTime: z.string().regex(timeRegex, "Invalid time format"),
    endTime: z.string().regex(timeRegex, "Invalid time format"),
  })
  .refine(
    (data) => {
      if (!data.isOpen) return true;
      const start = data.startTime.split(":").map(Number);
      const end = data.endTime.split(":").map(Number);
      return start[0] * 60 + start[1] < end[0] * 60 + end[1];
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

const formSchema = z.object({
  operatingHours: z.array(operatingHourSchema),
});

type FormData = z.infer<typeof formSchema>;

const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
] as const;

interface OperatingHoursFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  isSubmitting?: boolean;
}

export function OperatingHoursForm({
  onSubmit,
  defaultValues,
  isSubmitting,
}: OperatingHoursFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      operatingHours: DAYS.map((day) => ({
        dayOfWeek: day.value,
        isOpen: ["SATURDAY", "SUNDAY"].includes(day.value) ? false : true,
        startTime: "08:00",
        endTime: "17:00",
      })),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {DAYS.map((day, index) => (
          <Card key={day.value} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{day.label}</h3>
                <FormField
                  control={form.control}
                  name={`operatingHours.${index}.isOpen`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Open</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch(`operatingHours.${index}.isOpen`) && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`operatingHours.${index}.startTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`operatingHours.${index}.endTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
