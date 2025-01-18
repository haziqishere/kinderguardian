// /actions/settings/schema.ts
import { z } from "zod";
import { DayOfWeek } from "@prisma/client";

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

export type KindergartenSettingsSchemaType = z.infer<typeof KindergartenSettingsSchema>;