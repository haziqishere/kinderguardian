import { z } from "zod";

export const AlertSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["INFO", "WARNING", "ERROR", "SUCCESS"]),
  kindergartenId: z.string().min(1, "Kindergarten ID is required"),
  targetUserType: z.enum(["ALL", "PARENT", "TEACHER", "ADMIN"]),
  isRead: z.boolean().default(false),
  expiresAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AlertSchemaType = z.infer<typeof AlertSchema>; 