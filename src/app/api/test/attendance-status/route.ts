import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attendanceStats = await db.attendance.groupBy({
      by: ['status'],
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      _count: true
    })

    const alertLogs = await db.alertLog.findMany({
      where: {
        alertTime: {
          gte: today
        }
      },
      include: {
        student: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        alertTime: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        attendanceStats,
        alertLogs
      }
    })
  } catch (error) {
    console.error('Status check failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 