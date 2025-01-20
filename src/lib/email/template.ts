// src/lib/email/templates.ts
export const emailTemplates = {
    attendanceAlert: ({
      studentName,
      date,
      time
    }: {
      studentName: string;
      date: string;
      time: string;
    }) => ({
      subject: `Attendance Alert: ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Attendance Alert</h2>
          <p>Dear Parent,</p>
          <p>We noticed that ${studentName} has not arrived at kindergarten as of ${time} on ${date}.</p>
          <p>Please log in to the KinderGuardian portal to resolve this alert or contact us directly.</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0;">Time of Alert: ${time}</p>
            <p style="margin: 5px 0 0 0;">Date: ${date}</p>
          </div>
        </div>
      `
    })
  };