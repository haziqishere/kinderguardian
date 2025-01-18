import { z } from "zod";

const phoneNumberSchema = z.string().regex(/^01\d{8,9}$/, "Invalid Malaysian phone number format");

// Sub-schemas for each step
export const basicInfoSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    age: z.coerce.number().min(1, "Age must be atleast 1").max(6, "Age must not exceed 6"),
    classId: z.string().min(1, "Class is required"),
    parentId: z.string().min(1, "Parent information is required"),
    phoneNumbers: z.array(phoneNumberSchema).min(1, "At least one phone number is required"),
});

export const faceImageSchema = z.object({
    faceImages: z.object({
        front: z.string().optional(),
        left: z.string().optional(),
        right: z.string().optional(),
        tiltUp: z.string().optional(),
        tiltDown: z.string().optional()
    }).optional()
});

export const StudentWithClassSchema = StudentSchema.extend({
  class: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type StudentSchemaType = z.infer<typeof StudentSchema>;
export type StudentWithClassSchemaType = z.infer<typeof StudentWithClassSchema>;