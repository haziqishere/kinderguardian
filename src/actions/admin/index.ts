// actions/admin/index.ts
"use server"

import { db } from "@/lib/db";
import { z } from "zod";
import { createSafeAction } from "@/lib/create-safe-action";

const LeaveKindergartenSchema = z.object({
  adminId: z.string()
});

const leaveKindergartenHandler = async (data: z.infer<typeof LeaveKindergartenSchema>) => {
  try {
    // Check if admin exists
    const admin = await db.admin.findUnique({
      where: { id: data.adminId }
    });

    if (!admin) {
      return { error: "Admin not found" };
    }

    // Remove kindergarten association
    const updatedAdmin = await db.admin.update({
      where: { id: data.adminId },
      data: {
        kindergartenId: null,
        role: "ADMIN" // Reset role to default
      }
    });

    return { data: updatedAdmin };
  } catch (_error) {
    return { success: false, message: "Failed to process request" };
  }
};

export const leaveKindergarten = createSafeAction(
  LeaveKindergartenSchema,
  leaveKindergartenHandler
);