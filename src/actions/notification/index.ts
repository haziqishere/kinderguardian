// src/actions/notification/index.ts
import { db } from "@/lib/db";
import { EmailService } from "@/lib/email/send-email";
import { format } from "date-fns";
import { AlertType, ParentAction } from "@prisma/client";
import { NotificationSchema, emailTemplates, TemplateVariables } from "./schema";

export class NotificationService {
  static async sendAttendanceAlert(studentId: string) {
    try {
      console.log("Fetching student data...");
      
      const student = await db.student.findUnique({
        where: { id: studentId },
        include: {
          parent: true,
          class: true
        }
      });

      if (!student) {
        throw new Error(`Student not found with ID: ${studentId}`);
      }

      if (!student.parent) {
        throw new Error(`No parent found for student: ${studentId}`);
      }

      console.log("Student data found:", {
        studentName: student.fullName,
        parentEmail: student.parent.email
      });

      // Send email
      const emailResult = await EmailService.sendAlertEmail({
        to: student.parent.email,
        studentName: student.fullName,
        date: format(new Date(), 'MMMM d, yyyy'),
        time: format(new Date(), 'h:mm a')
      });

      console.log("Email sending result:", emailResult);

      // Create alert log with all required fields and correct types
      const alertLog = await db.alertLog.create({
        data: {
          studentId: student.id,
          alertType: AlertType.EMAIL,
          parentAction: ParentAction.NO_RESPONSE,
          alertTime: new Date(),
          reason: "Attendance alert notification",
          phoneNumberContacted: null,
          notificationId: emailResult.messageId || null,
          emailSent: emailResult.success,
          emailAddress: student.parent.email
        }
      });

      console.log("Alert log created:", alertLog);

      return { success: true, data: alertLog };
    } catch (error) {
      console.error('Send alert error:', error);
      return { success: false, error };
    }
  }
}