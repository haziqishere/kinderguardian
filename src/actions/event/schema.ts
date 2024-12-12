import {z} from "zod";

export const EventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    dateTime: z.date(),
    description: z.string(),
    location: z.string().min(1, "Location is required"),
    cost: z.number().min(0),
    requiredItems: z.string().optional(),
    teacherInChargePhone: z.string().optional(),
    classIds: z.array(z.string()).min(1, "At least one class must be selected")
});

export type EventSchemaType = z.infer<typeof EventSchema>;