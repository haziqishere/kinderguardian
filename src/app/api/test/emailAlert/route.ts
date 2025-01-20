// src/app/api/test/emailAlert/route.ts
import { NextResponse } from "next/server";
import { NotificationService } from "@/actions/notification";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ 
        success: false, 
        error: "Student ID is required" 
      }, { status: 400 });
    }

    console.log("Starting email test with studentId:", studentId);

    // First verify the student exists
    const result = await NotificationService.sendAttendanceAlert(studentId);

    console.log("Notification result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Detailed error:", {
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