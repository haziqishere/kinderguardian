import { NextResponse } from "next/server";
import { NotificationService } from "@/actions/notification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const result = await NotificationService.sendAttendanceAlert(studentId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Email error:", {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack
    });

    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : "Unknown error" 
    }, { 
      status: 500 
    });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "Email notification service is running" });
}
