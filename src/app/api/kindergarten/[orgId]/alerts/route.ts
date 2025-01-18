// app/api/kindergarten/[orgId]/alerts/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserType } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const alerts = await db.alertLog.findMany({
      where: {
        student: {
          class: {
            kindergartenId: params.orgId
          }
        }
      },
      include: {
        student: {
          include: {
            class: true,
            attendance: {
              orderBy: {
                date: 'desc'
              },
              take: 30
            }
          }
        }
      },
      orderBy: {
        alertTime: 'desc'
      }
    });

    // Process alerts into responded and awaiting
    const processedAlerts = alerts.map(alert => {
      const student = alert.student;
      const totalDays = student.attendance.length;
      const presentDays = student.attendance.filter(
        a => a.status === 'ON_TIME' || a.status === 'LATE'
      ).length;
      const attendancePerformance = totalDays > 0 
        ? `${((presentDays / totalDays) * 100).toFixed(1)}%`
        : 'N/A';

      return {
        id: alert.id,
        name: student.fullName,
        class: student.class?.name || 'Unassigned',
        attendancePerformance,
        parentAction: alert.parentAction,
        alertStatus: alert.alertType,
        reason: alert.reason || undefined
      };
    });

    // Split into responded and awaiting
    const responded = processedAlerts.filter(
      alert => alert.parentAction === 'RESPONDED'
    );
    const awaiting = processedAlerts.filter(
      alert => alert.parentAction === 'NO_RESPONSE'
    );

    return NextResponse.json({ 
      data: {
        responded,
        awaiting
      }
    });
  } catch (error) {
    console.error("[ALERTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}