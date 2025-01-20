// src/actions/notification/schema.ts
import { z } from "zod";
import { AlertType, ParentAction } from "@prisma/client";

// Schema for sending notifications
export const NotificationSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  type: z.nativeEnum(AlertType),
  message: z.string().optional(),
  emailTemplate: z.object({
    subject: z.string(),
    body: z.string()
  }).optional()
});

// Schema for notification response
export const NotificationResponseSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  alertType: z.nativeEnum(AlertType),
  parentAction: z.nativeEnum(ParentAction),
  emailSent: z.boolean(),
  emailAddress: z.string().optional(),
  notificationId: z.string().optional(),
  alertTime: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Types derived from schemas
export type NotificationSchemaType = z.infer<typeof NotificationSchema>;
export type NotificationResponseType = z.infer<typeof NotificationResponseSchema>;

// Predefined email templates
export const emailTemplates = {
  attendanceAlert: {
    name: 'attendance_alert',
    subject: 'Attendance Alert: {{studentName}}',
    body: `Dear Parent,

We noticed that {{studentName}} has not arrived at kindergarten as of {{time}} on {{date}}.

Please log in to the KinderGuardian portal to update the attendance status or contact us directly.

Best regards,
KinderGuardian Team`
  },
  // Add more templates as needed
  lateArrival: {
    name: 'late_arrival',
    subject: 'Late Arrival: {{studentName}}',
    body: `Dear Parent,

This is to inform you that {{studentName}} arrived at {{time}} today, which is after our regular start time.

Please ensure timely arrival to maintain consistent learning routines.

Best regards,
KinderGuardian Team`
  }
};

// Utility type for template variables
export type TemplateVariables = {
  studentName: string;
  time: string;
  date: string;
  [key: string]: string;
};