// src/lib/email/send-email.ts
import nodemailer from "nodemailer";
import { emailTemplates, TemplateVariables } from "@/actions/notification/schema";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD  // Use App Password for Gmail
  }
});

export class EmailService {
  static async sendAlertEmail({
    to,
    studentName,
    date,
    time
  }: {
    to: string;
    studentName: string;
    date: string;
    time: string;
  }) {
 // Prepare template variables
 const variables: TemplateVariables = {
    studentName,
    date,
    time
  };

  // Get template and replace variables
  const template = emailTemplates.attendanceAlert;
  const subject = template.subject.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
  const body = template.body.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');

  const mailOptions = {
    from: `"KinderGuardian" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; margin-bottom: 20px;">Attendance Alert</h2>
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          ${body.split('\n').map(line => 
            `<p style="margin: 10px 0; line-height: 1.5;">${line}</p>`
          ).join('')}
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Time of Alert: ${time}<br>
            Date: ${date}
          </p>
        </div>
      </div>
    `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: unknown) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    static async sendEmail({
        to,
        templateName,
        variables
      }: {
        to: string;
        templateName: keyof typeof emailTemplates;
        variables: TemplateVariables;
      }) {
        try {
          const template = emailTemplates[templateName];
          const subject = template.subject.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
          const body = template.body.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
    
          const mailOptions = {
            from: `"KinderGuardian" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                ${body.split('\n').map(line => 
                  `<p style="margin: 10px 0; line-height: 1.5;">${line}</p>`
                ).join('')}
              </div>
            `
          };
    
          const info = await transporter.sendMail(mailOptions);
          return { success: true, messageId: info.messageId };
        } catch (error) {
          console.error('Email send error:', error);
          return { success: false, error };
        }
      }
    }