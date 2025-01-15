import { z } from "zod";
import { DayOfWeek } from "@prisma/client";

export const OperatingHoursSchema = z.object({
  dayOfWeek: z.enum([
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY
  ]),
  startTime: z.string(),
  endTime: z.string(),
});

export const KindergartenSettingsSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Kindergarten name is required"),
  address: z.string().min(1, "Address is required"),
  messageAlertThreshold: z.string(),
  callAlertThreshold: z.string(),
  operatingHours: z.array(OperatingHoursSchema)
});

export type OperatingHoursSchemaType = z.infer<typeof OperatingHoursSchema>;
export type KindergartenSettingsSchemaType = z.infer<typeof KindergartenSettingsSchema>; 