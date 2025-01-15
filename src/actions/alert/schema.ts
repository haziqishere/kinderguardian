import { z } from "zod";
import { AlertType, UserType } from "@prisma/client";

export const AlertSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.nativeEnum(AlertType),
  kindergartenId: z.string().min(1, "Kindergarten ID is required"),
  targetUserType: z.nativeEnum(UserType),
  isRead: z.boolean(),
  expiresAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AlertSchemaType = z.infer<typeof AlertSchema>; 