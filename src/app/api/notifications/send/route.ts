// src/app/api/notifications/send/route.ts
import { NextResponse } from "next/server";
import { NotificationService } from "@/actions/notification";
import { AlertType } from "@prisma/client";
import { NotificationSchema } from "@/actions/notification/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body against schema
    const { studentId, type } = NotificationSchema.parse(body);

    if (!studentId) {
      return NextResponse.json({ 
        success: false, 
        error: "Student ID is required" 
      }, { status: 400 });
    }

    let result;
    switch (type) {
      case AlertType.EMAIL:
        result = await NotificationService.sendAttendanceAlert(studentId);
        break;
      // Add more cases as NotificationService expands
      default:
        return NextResponse.json({ 
          success: false, 
          error: `Unsupported notification type: ${type}` 
        }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { 
      status: 500 
    });
  }
}