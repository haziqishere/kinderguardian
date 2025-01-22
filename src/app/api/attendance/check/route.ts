import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AttendanceStatus, AlertType, ParentAction } from "@prisma/client";
import { format } from "date-fns";

export async function POST() {
  try {
    // Get all kindergartens and their settings
    const kindergartens = await db.kindergarten.findMany({
      include: {
        classes: {
          include: {
            students: true
          }
        }
      }
    });

    const results = [];

    for (const kindergarten of kindergartens) {
      const { messageAlertThreshold, callAlertThreshold } = kindergarten;
      const now = new Date();
      const today = format(now, "yyyy-MM-dd");

      // Check each class in the kindergarten
      for (const class_ of kindergarten.classes) {
        for (const student of class_.students) {
          // Check if attendance exists for today
          const attendance = await db.attendance.findUnique({
            where: {
              studentId_date: {
                studentId: student.id,
                date: new Date(today)
              }
            }
          });

          // If no attendance record or status is PENDING
          if (!attendance || attendance.status === AttendanceStatus.PENDING) {
            // Check if we need to send alerts based on thresholds
            const messageThresholdTime = new Date(
              `${today}T${format(messageAlertThreshold, "HH:mm:ss")}`
            );
            const callThresholdTime = new Date(
              `${today}T${format(callAlertThreshold, "HH:mm:ss")}`
            );

            // Check if any alert was already sent today
            const existingAlert = await db.alertLog.findFirst({
              where: {
                studentId: student.id,
                alertTime: {
                  gte: new Date(today)
                }
              }
            });

            if (!existingAlert && now >= messageThresholdTime) {
              // Create alert log for message
              await db.alertLog.create({
                data: {
                  studentId: student.id,
                  alertTime: now,
                  alertType: AlertType.MESSAGED,
                  parentAction: ParentAction.NO_RESPONSE
                }
              });

              results.push({
                student: student.fullName,
                action: "Message alert created"
              });
            }

            if (!existingAlert && now >= callThresholdTime) {
              // Create alert log for call
              await db.alertLog.create({
                data: {
                  studentId: student.id,
                  alertTime: now,
                  alertType: AlertType.CALLED,
                  parentAction: ParentAction.NO_RESPONSE
                }
              });

              results.push({
                student: student.fullName,
                action: "Call alert created"
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Attendance check error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check attendance" },
      { status: 500 }
    );
  }
}