// app/api/kindergarten/[orgId]/dashboard/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Event, AttendanceStatus } from "@prisma/client";

interface MonthlyAttendance {
    [key: string]: {
        total: number;
        present: number;
    }
}

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 6);

    const [
      students,
      classes,
      todayAttendance,
      historicalAttendance,
      events,
      alerts
    ] = await Promise.all([
      // Students query remains the same
      db.student.findMany({
        where: {
          class: { kindergartenId: params.orgId }
        },
        include: {
          class: true,
          attendance: {
            where: {
              date: {
                gte: startOfDay(today),
                lte: endOfDay(today)
              }
            }
          }
        }
      }),
      
      // Classes query remains the same
      db.class.findMany({
        where: { kindergartenId: params.orgId },
        include: { 
          _count: {
            select: { students: true }
          }
        }
      }),

      // Today's attendance query remains the same
      db.attendance.findMany({
        where: {
          student: {
            class: { kindergartenId: params.orgId }
          },
          date: {
            gte: startOfDay(today),
            lte: endOfDay(today)
          }
        },
        include: {
          student: {
            include: {
              class: true
            }
          }
        }
      }),

      // Historical attendance query remains the same
      db.attendance.groupBy({
        by: ['date', 'status'],
        where: {
          student: {
            class: { kindergartenId: params.orgId }
          },
          date: {
            gte: sixMonthsAgo,
            lte: today
          }
        },
        _count: true
      }),

      // Updated events query to use correct field names
      db.event.findMany({
        where: {
          kindergartenId: params.orgId,
          startDate: { // Changed from dateTime to startDate
            gte: today
          }
        },
        take: 5,
        orderBy: {
          startDate: 'asc' // Changed from dateTime to startDate
        }
      }),

      // Alerts query remains the same
      db.alertLog.findMany({
        where: {
          student: {
            class: { kindergartenId: params.orgId }
          },
          parentAction: 'NO_RESPONSE'
        },
        take: 5,
        orderBy: {
          alertTime: 'desc'
        }
      })
    ]);

    // Calculate dashboard metrics
    const totalStudents = students.length;
    const totalClasses = classes.length;
    const presentToday = todayAttendance.filter(a => 
      a.status === AttendanceStatus.ON_TIME || a.status === AttendanceStatus.LATE
    ).length;
    const lateToday = todayAttendance.filter(a => 
      a.status === AttendanceStatus.LATE
    ).length;

    const classUtilization = classes.map(c => ({
      id: c.id,
      name: c.name,
      capacity: c.capacity,
      studentCount: c._count.students,
      utilizationRate: (c._count.students / c.capacity) * 100
    }));

    // Process historical attendance for chart with type safety
    const attendanceHistory = historicalAttendance.reduce((acc: MonthlyAttendance, curr) => {
      const month = new Date(curr.date).toLocaleDateString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { total: 0, present: 0 };
      }
      acc[month].total += curr._count;
      if (curr.status === AttendanceStatus.ON_TIME || curr.status === AttendanceStatus.LATE) {
        acc[month].present += curr._count;
      }
      return acc;
    }, {});

    const attendanceChart = Object.entries(attendanceHistory).map(([month, data]) => ({
      month,
      rate: (data.present / data.total) * 100
    }));

    return NextResponse.json({
      data: {
        stats: {
          totalStudents,
          totalClasses,
          presentToday,
          lateToday,
          absentNoReason: alerts.length
        },
        classUtilization,
        attendanceChart,
        arrivedStudents: todayAttendance.map(record => ({
          id: record.student.id,
          name: record.student.fullName,
          class: record.student.class?.name || 'Unassigned',
          arrivalTime: record.timeRecorded,
          status: record.status
        })),
        events,
        alerts
      }
    });
  } catch (error) {
    console.error("[DASHBOARD_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}