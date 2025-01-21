// app/api/kindergarten/[orgId]/dashboard/stats/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { calculateUtilizationRate } from "@/lib/utils/dashboard-calculations";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const [students, classes, todayAttendance] = await Promise.all([
      db.student.findMany({
        where: {
          class: { 
            kindergartenId: params.orgId,
          },
          classId: {
            not: null
          }
        }
      }),
      db.class.findMany({
        where: { kindergartenId: params.orgId },
        include: { students: true }
      }),
      db.attendance.findMany({
        where: {
          date: new Date(),
          student: {
            class: { kindergartenId: params.orgId }
          }
        }
      })
    ]);

    // Calculate stats
    const totalStudents = students.length;
    const totalClasses = classes.length;

    const classUtilization = classes.map(c => ({
      id: c.id,
      name: c.name,
      capacity: c.capacity,
      studentCount: c.students.length,
      utilizationRate: calculateUtilizationRate(c.students.length, c.capacity)
    }));

    const currentDayStats = {
      present: todayAttendance.filter(a => a.status === 'ON_TIME').length,
      late: todayAttendance.filter(a => a.status === 'LATE').length,
      absent: totalStudents - todayAttendance.length,
      absentNoReason: 0 // Calculate based on your business logic
    };

    return NextResponse.json({
      data: {
        totalStudents,
        totalClasses,
        classUtilization,
        currentDayStats
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}