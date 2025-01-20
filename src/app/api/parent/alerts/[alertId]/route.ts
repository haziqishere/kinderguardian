// src/app/api/parent/alerts/[alertId]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { AttendanceStatus, ParentAction } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { alertId: string } }
) {
  try {
    const { status, reason } = await req.json();
    const alertId = params.alertId;

    // Only status is required
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Get the alert log first
    const alertLog = await db.alertLog.findUnique({
      where: { id: alertId },
      include: { student: true }
    });

    if (!alertLog) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    // Transaction to update both alert and create attendance
    const [updatedAlert, attendance] = await db.$transaction([
      // Update alert log - reason is optional
      db.alertLog.update({
        where: { id: alertId },
        data: {
          parentAction: ParentAction.RESPONDED,
          reason: reason || null  // Allow null if no reason provided
        }
      }),
      
      // Create attendance record
      db.attendance.create({
        data: {
          studentId: alertLog.studentId,
          date: new Date(),
          status: status as AttendanceStatus,
          timeRecorded: new Date()
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        alert: updatedAlert,
        attendance: attendance
      }
    });

  } catch (error) {
    console.error("[ALERT_RESPONSE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to process alert response" },
      { status: 500 }
    );
  }
}