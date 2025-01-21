// src/actions/class/schema.ts
import { z } from "zod"

export const ClassSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Class name is required"),
    capacity: z.number().min(1, "Capacity must be at least 1").max(40, "Maximum capacity is 40"),
    kindergartenId: z.string().min(1, "Kindergarten ID is required"),
});

export const UpdateClassSchema = ClassSchema.extend({
    id: z.string(),
});

export type ClassSchemaType = z.infer<typeof ClassSchema>;
export type UpdateClassSchemaType = z.infer<typeof UpdateClassSchema>;