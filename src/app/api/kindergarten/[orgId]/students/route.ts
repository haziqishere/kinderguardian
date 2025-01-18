// app/api/kindergarten/[orgId]/students/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const students = await db.student.findMany({
      where: {
        class: {
          kindergartenId: params.orgId
        }
      },
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        },
        attendance: {
          orderBy: {
            date: 'desc'
          },
          take: 30
        }
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    // Process students data
    const processedStudents = students.map(student => {
      const totalDays = student.attendance.length;
      const presentDays = student.attendance.filter(
        a => a.status === 'ON_TIME' || a.status === 'LATE'
      ).length;
      const attendancePerformance = totalDays > 0 
        ? `${((presentDays / totalDays) * 100).toFixed(1)}%`
        : 'N/A';

      return {
        id: student.id,
        name: student.fullName,
        age: student.age,
        class: student.class?.name || 'Unassigned',
        daysAbsent: student.daysAbsent,
        attendancePerformance
      };
    });

    return NextResponse.json({ data: processedStudents });
  } catch (error) {
    console.error("[STUDENTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}