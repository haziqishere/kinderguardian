import { z } from "zod";
import { EventType, UserType } from "@prisma/client";

export const EventSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().min(1, "Location is required"),
    type: z.nativeEnum(EventType),
    kindergartenId: z.string().min(1, "Kindergarten ID is required"),
    targetAudience: z.nativeEnum(UserType).array(),
    isAllDay: z.boolean(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const EventWithAttendeesSchema = EventSchema.extend({
    attendees: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.nativeEnum(UserType),
        status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
    })),
});

export type EventSchemaType = z.infer<typeof EventSchema>;
export type EventWithAttendeesSchemaType = z.infer<typeof EventWithAttendeesSchema>;