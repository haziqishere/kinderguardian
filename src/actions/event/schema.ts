import {z} from "zod";

export const EventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    dateTime: z.coerce.date({
        required_error: "Date is required",
    }),
    description: z.string(),
    location: z.string().min(1, "Location is required"),
    cost: z.coerce.number().min(0),
    teacherInChargeName: z.string().optional(),
    teacherInChargePhone: z.string().optional(),
    requiredItems: z.string().optional(),
    classIds: z.array(z.string()).min(1, "At least one class must be selected")
});

export type EventSchemaType = z.infer<typeof EventSchema>;