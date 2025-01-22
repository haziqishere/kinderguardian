import { NextResponse } from "next/server";
import { AttendanceScheduler } from "@/lib/scheduler/attendance-checker";

export async function GET() {
  try {
    await AttendanceScheduler.checkAttendance();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attendance check failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }, 
      { status: 500 }
    );
  }
} 