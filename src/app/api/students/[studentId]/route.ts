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
        id: params.studentId
      },
      include: {
        class: true,
        attendance: {
          orderBy: {
            date: 'desc'
          },
          take: 10,
        },
        alertLogs: {
          orderBy: {
            alertTime: 'desc'
          },
          take: 5,
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: student });
  } catch (error) {
    console.error("[STUDENT_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}