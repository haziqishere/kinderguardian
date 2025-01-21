import { z } from "zod";
import { EventType, UserType } from "@prisma/client";

export const EventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    location: z.string().min(1, "Location is required"),
    type: z.nativeEnum(EventType),
    targetAudience: z.array(z.nativeEnum(UserType)),
    startDate: z.coerce.date({
      required_error: "Start date is required",
    }),
    endDate: z.coerce.date({
      required_error: "End date is required",
    }),
    isAllDay: z.boolean(),
    kindergartenId: z.string(),
    classId: z.array(z.string()).min(1, "At least one class must be selected")
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