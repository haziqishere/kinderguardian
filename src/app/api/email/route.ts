import { NextResponse } from "next/server";
import { EmailService } from "@/lib/email/send-email";
import { TemplateVariables } from "@/actions/notification/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, templateName, variables } = body as {
      to: string;
      templateName: "attendanceAlert" | "lateArrival";
      variables: TemplateVariables;
    };

    if (!to || !templateName || !variables) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await EmailService.sendEmail({
      to,
      templateName,
      variables
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

// GET method for testing the endpoint
export async function GET() {
  return NextResponse.json(
    { message: "Email endpoint is working" },
    { status: 200 }
  );
}
