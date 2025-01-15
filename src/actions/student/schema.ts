import { z } from "zod";

export const StudentSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  age: z.number().min(2, "Age must be at least 2").max(12, "Age cannot exceed 12"),
  classId: z.string().min(1, "Class is required"),
  parentId: z.string().min(1, "Parent is required"),
  faceImageFront: z.string().optional(),
  faceImageLeft: z.string().optional(),
  faceImageRight: z.string().optional(),
  faceImageTiltUp: z.string().optional(),
  faceImageTiltDown: z.string().optional(),
});

export const StudentWithClassSchema = StudentSchema.extend({
  class: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type StudentSchemaType = z.infer<typeof StudentSchema>;
export type StudentWithClassSchemaType = z.infer<typeof StudentWithClassSchema>;