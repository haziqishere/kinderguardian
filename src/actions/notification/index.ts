// src/actions/notification/index.ts
import { db } from "@/lib/db";
import { EmailService } from "@/lib/email/send-email";
import { format } from "date-fns";
import { AlertType, ParentAction, Prisma } from "@prisma/client";
import { NotificationSchema } from "./schema";

export class NotificationService {
  static async sendAttendanceAlert(studentId: string) {
    try {
      // Basic input validation
      if (!studentId?.trim()) {
        throw new Error("Invalid student ID");
      }

      // Schema validation
      const validatedData = NotificationSchema.parse({
        studentId,
        type: AlertType.INFO
      });

      // Fetch student with related data
      const student = await db.student.findUnique({
        where: { id: validatedData.studentId },
        include: {
          parent: true,
          phoneNumbers: {
            take: 1,
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!student || !student.parent) {
        throw new Error(`Student or parent not found for ID: ${validatedData.studentId}`);
      }

      // Send email notification
      const emailResult = await EmailService.sendAlertEmail({
        to: student.parent.email,
        studentName: student.fullName,
        date: format(new Date(), 'MMMM d, yyyy'),
        time: format(new Date(), 'h:mm a')
      });

      // Get primary phone number if available
      const primaryPhone = student.phoneNumbers[0]?.phoneNumber || "";

      // First try to create a minimal AlertLog
      const baseAlertLogData = {
        alertTime: new Date(),
        alertType: validatedData.type,
        parentAction: ParentAction.NO_RESPONSE,
        studentId: student.id,
        reason: "Attendance alert notification",
        phoneNumberContacted: primaryPhone,
        emailAddress: student.parent.email
      };

      console.log("Creating alert log with base data:", baseAlertLogData);

      // Create the alert log
      const alertLog = await db.alertLog.create({
        data: baseAlertLogData
      });

      console.log("Alert log created successfully:", alertLog);

      return { 
        success: true, 
        data: alertLog,
        meta: {
          emailSent: emailResult.success,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error: unknown) {
      console.error('Send alert error:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...(error instanceof Prisma.PrismaClientKnownRequestError && {
          code: error.code,
          meta: error.meta
        })
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          success: false,
          error: `Database error: ${error.message}`,
          details: {
            code: error.code,
            meta: error.meta
          }
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}