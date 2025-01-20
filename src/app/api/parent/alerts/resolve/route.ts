// src/app/api/alerts/resolve/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { AttendanceStatus, ParentAction } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { alertId, status, reason } = await req.json();

    // Update alert log
    const alertLog = await db.alertLog.update({
      where: { id: alertId },
      data: {
        parentAction: ParentAction.RESPONDED,
        reason: reason,
      },
      include: {
        student: true
      }
    });

    // Create attendance record
    await db.attendance.create({
      data: {
        studentId: alertLog.studentId,
        date: new Date(),
        status: status as AttendanceStatus,
        timeRecorded: new Date(),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESOLVE_ALERT]", error);
    return NextResponse.json(
      { error: "Failed to resolve alert" },
      { status: 500 }
    );
  }
}