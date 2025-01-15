// src/actions/class/schema.ts
import { z } from "zod"

const ClassFormSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    capacity: z.coerce.number()
        .min(1, "Capacity must be at least 1")
        .max(40, "Capacity cannot exceed 40"),
    kindergartenId: z.string()
});

// Schema for creating a class
export const ClassSchema = ClassFormSchema;

// Schema for updating a class (includes id)
export const UpdateClassSchema = ClassFormSchema.extend({
    id: z.string()
});

export type ClassSchemaType = z.infer<typeof ClassSchema>;
export type UpdateClassSchemaType = z.infer<typeof UpdateClassSchema>;