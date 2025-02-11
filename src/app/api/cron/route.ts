// src/app/api/cron/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AttendanceStatus, AlertType, ParentAction } from "@prisma/client";
import { format } from "date-fns";

// Verify cron secret to ensure only authorized calls
function verifyCronSecret(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET_KEY;
  
  if (!cronSecret) {
    throw new Error("CRON_SECRET_KEY not configured");
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    throw new Error("Unauthorized");
  }
}

export async function POST(request: Request) {
  try {
    // Verify the request is from our cron job
    verifyCronSecret(request);

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
                },
                parentAction: ParentAction.NO_RESPONSE
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

              // Send notification
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  studentId: student.id,
                  type: AlertType.EMAIL
                }),
              });

              results.push({
                student: student.fullName,
                action: "Message alert created and notification sent"
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
    console.error("Cron job error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }, 
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}