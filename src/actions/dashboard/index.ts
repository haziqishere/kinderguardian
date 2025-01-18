"use server";
import { db } from "@/lib/db";
import { Activity } from "@/app/(system)/kindergarten/[orgId]/types";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

// Get dashboard statistics
export const getDashboardStats = async (kindergartenId: string) => {
  try {
    const [
      totalStudents,
      totalClasses,
      upcomingEvents,
      unreadAlerts,
      classUtilization
    ] = await Promise.all([
      // Get total students
      db.student.count({
        where: {
          class: {
            kindergartenId
          }
        }
      }),
      // Get total classes
      db.class.count({
        where: { kindergartenId }
      }),
      // Get upcoming events
      db.event.findMany({
        where: {
          kindergartenId,
          startDate: {
            gte: new Date()
          }
        },
        take: 5,
        include: {
          attendees: true
        }
      }),
      // Get unread alerts
      db.alert.findMany({
        where: {
          kindergartenId,
          isRead: false
        },
        take: 5
      }),
      // Get class utilization
      db.class.findMany({
        where: { kindergartenId },
        include: {
          students: true,
        }
      })
    ]);

    // Calculate overall utilization
    const totalCapacity = classUtilization.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
    const totalEnrolled = classUtilization.reduce((acc, curr) => acc + curr.students.length, 0);
    const overallUtilization = totalCapacity > 0 ? totalEnrolled / totalCapacity : 0;

    return {
      data: {
        totalStudents,
        totalClasses,
        upcomingEvents,
        unreadAlerts,
        classUtilization: classUtilization.map(c => ({
          id: c.id,
          name: c.name,
          capacity: c.capacity || 0,
          studentCount: c.students.length,
          utilizationRate: c.capacity ? (c.students.length / c.capacity) * 100 : 0
        })),
        overallUtilization
      }
    };
  } catch (error) {
    console.error("[GET_DASHBOARD_STATS]", error);
    return { error: "Failed to fetch dashboard stats" };
  }
};

// Get attendance statistics for the past 6 months
export const getAttendanceStats = async (kindergartenId: string) => {
  try {
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 6);

    // Get all attendance records for the past 6 months
    const attendanceRecords = await db.attendance.findMany({
      where: {
        student: {
          class: {
            kindergartenId
          }
        },
        date: {
          gte: startOfMonth(sixMonthsAgo),
          lte: endOfMonth(today)
        }
      }
    });

    // Group by month and calculate attendance rate
    const monthlyStats = Array.from({ length: 6 }, (_, i) => {
      const monthDate = subMonths(today, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthRecords = attendanceRecords.filter(record => 
        record.date >= monthStart && record.date <= monthEnd
      );

      const totalRecords = monthRecords.length;
      const presentRecords = monthRecords.filter(record => 
        record.status === "ON_TIME" || record.status === "LATE"
      ).length;

      return {
        date: monthStart,
        attendanceRate: totalRecords > 0 ? presentRecords / totalRecords : 0
      };
    }).reverse(); // Most recent last

    return { data: monthlyStats };
  } catch (error) {
    console.error("[GET_ATTENDANCE_STATS]", error);
    return { error: "Failed to fetch attendance stats" };
  }
};

// Get recent activities
export const getRecentActivities = async (kindergartenId: string) => {
  try {
    const [recentEvents, recentAlerts] = await Promise.all([
      // Get recent events
      db.event.findMany({
        where: {
          kindergartenId,
          endDate: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Last 7 days
          }
        },
        orderBy: {
          startDate: 'desc'
        },
        take: 5
      }),
      // Get recent alerts
      db.alert.findMany({
        where: {
          kindergartenId,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Last 7 days
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    ]);

    // Combine and sort activities by date
    const activities: Activity[] = [
      ...recentEvents.map(event => ({
        type: 'EVENT' as const,
        title: event.title,
        description: event.description,
        date: event.startDate,
        data: event
      })),
      ...recentAlerts.map(alert => ({
        type: 'ALERT' as const,
        title: alert.title,
        description: alert.message,
        date: alert.createdAt,
        data: alert
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return { data: activities };
  } catch (error) {
    console.error("[GET_RECENT_ACTIVITIES]", error);
    return { error: "Failed to fetch recent activities" };
  }
}; 