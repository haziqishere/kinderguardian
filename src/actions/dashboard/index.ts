import { db } from "@/lib/db";

// Get dashboard statistics
export const getDashboardStats = async (kindergartenId: string) => {
  try {
    const [
      totalStudents,
      totalClasses,
      upcomingEvents,
      unreadAlerts
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
        where: {
          kindergartenId
        }
      }),
      // Get upcoming events (next 5)
      db.event.findMany({
        where: {
          kindergartenId,
          startDate: {
            gte: new Date()
          }
        },
        orderBy: {
          startDate: 'asc'
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
          isRead: false,
          OR: [
            { expiresAt: { gt: new Date() } },
            { expiresAt: null }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    ]);

    // Get class utilization
    const classes = await db.class.findMany({
      where: {
        kindergartenId
      },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    const classUtilization = classes.map(class_ => ({
      id: class_.id,
      name: class_.name,
      capacity: class_.capacity,
      studentCount: class_._count.students,
      utilizationRate: (class_._count.students / class_.capacity) * 100
    }));

    return {
      data: {
        totalStudents,
        totalClasses,
        upcomingEvents,
        unreadAlerts,
        classUtilization,
        // Calculate overall utilization
        overallUtilization: classes.length > 0
          ? (totalStudents / classes.reduce((acc, curr) => acc + curr.capacity, 0)) * 100
          : 0
      }
    };
  } catch (error) {
    console.error("[GET_DASHBOARD_STATS]", error);
    return { error: "Failed to fetch dashboard statistics" };
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
    const activities = [
      ...recentEvents.map(event => ({
        type: 'EVENT',
        title: event.title,
        description: event.description,
        date: event.startDate,
        data: event
      })),
      ...recentAlerts.map(alert => ({
        type: 'ALERT',
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