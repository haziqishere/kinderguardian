// src/actions/alert/resolve.ts
import { db } from "@/lib/db";
import { z } from "zod";
import { createSafeAction } from "@/lib/create-safe-action";
import { AttendanceStatus, ParentAction } from "@prisma/client";

const ResolveAlertSchema = z.object({
  alertId: z.string(),
  status: z.enum([AttendanceStatus.LATE, AttendanceStatus.ABSENT]),
  reason: z.string().min(1, "Reason is required")
});

const handler = async (data: z.infer<typeof ResolveAlertSchema>) => {
  try {
    const alertLog = await db.alertLog.update({
      where: { id: data.alertId },
      data: {
        parentAction: ParentAction.RESPONDED,
        reason: data.reason,
      },
      include: {
        student: true
      }
    });

    await db.attendance.create({
      data: {
        studentId: alertLog.studentId,
        date: new Date(),
        status: data.status,
        timeRecorded: new Date(),
      }
    });

    return { success: true };
  } catch (_error) {
    return { error: "Failed to resolve alert" };
  }
};

export const resolveAlert = createSafeAction(ResolveAlertSchema, handler);