// app/(auth)/setup/_components/alert-settings-form.tsx
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
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock } from "lucide-react";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const formSchema = z
  .object({
    messageAlertThreshold: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    callAlertThreshold: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  })
  .refine(
    (data) => {
      const message = data.messageAlertThreshold.split(":").map(Number);
      const call = data.callAlertThreshold.split(":").map(Number);
      return message[0] * 60 + message[1] < call[0] * 60 + call[1];
    },
    {
      message: "Call alert time must be after message alert time",
      path: ["callAlertThreshold"],
    }
  );

type FormData = z.infer<typeof formSchema>;

interface AlertSettingsFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  isSubmitting?: boolean;
}

export function AlertSettingsForm({
  onSubmit,
  defaultValues,
  isSubmitting,
}: AlertSettingsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      messageAlertThreshold: "09:00",
      callAlertThreshold: "10:00",
    },
  });

  const handleSubmit = (data: FormData) => {
    console.log("Submitting alert settings form:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex gap-2 p-4 bg-muted/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>
                  Set times when parents should be notified if their child
                  hasn't arrived at kindergarten.
                </p>
                <p className="mt-2">
                  Make sure these times are after your operating hours start
                  time.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="messageAlertThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Alert Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                      <Input type="time" disabled={isSubmitting} {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Parents will receive a WhatsApp message if their child
                    hasn't arrived by this time
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="callAlertThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Alert Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                      <Input type="time" disabled={isSubmitting} {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    If no response to the message alert, parents will receive a
                    phone call at this time
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

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
            {isSubmitting ? "Completing Setup..." : "Complete Setup"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
