// app/api/students/[studentId]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const student = await db.student.findUnique({
      where: {
        id: params.studentId,
      },
      include: {
        class: true,
        attendance: {
          orderBy: {
            date: 'desc',
          },
          take: 30, // Last 30 days
        },
        alertLogs: {
          orderBy: {
            alertTime: 'desc',
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Calculate attendance stats
    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter(
      (a) => a.status === "ON_TIME" || a.status === "LATE"
    ).length;
    const daysAbsent = student.attendance.filter(
      (a) => a.status === "ABSENT"
    ).length;

    const formattedStudent = {
      ...student,
      daysAbsent,
      attendanceRate: totalDays > 0
        ? ((presentDays / totalDays) * 100).toFixed(1)
        : "N/A",
    };

    return NextResponse.json({ data: formattedStudent });
  } catch (error) {
    console.error("[STUDENT_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}