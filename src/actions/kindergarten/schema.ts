// /actions/kindergarten/schema.ts
import { z } from "zod";
import { DayOfWeek } from "@prisma/client";

// Keep your existing schemas
const OperatingHourSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.string(),
  endTime: z.string(),
});

export const KindergartenSettingsSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Kindergarten name is required"),
  address: z.string().min(1, "Address is required"),
  messageAlertThreshold: z.string(),
  callAlertThreshold: z.string(),
  operatingHours: z.array(OperatingHourSchema),
});

// Add new schemas for setup process
export const KindergartenCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  messageAlertThreshold: z.string(),
  callAlertThreshold: z.string(),
  operatingHours: z.array(OperatingHourSchema)
});

export const KindergartenJoinSchema = z.object({
  kindergartenId: z.string(),
  adminId: z.string()
});

export const SetupSchema = KindergartenCreateSchema.extend({
  adminId: z.string()
});

// Export all types
export type KindergartenSettingsSchemaType = z.infer<typeof KindergartenSettingsSchema>;
export type KindergartenCreateSchemaType = z.infer<typeof KindergartenCreateSchema>;
export type KindergartenJoinSchemaType = z.infer<typeof KindergartenJoinSchema>;