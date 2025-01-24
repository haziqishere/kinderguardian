import { NextResponse } from 'next/server'
import { AttendanceScheduler } from '@/lib/scheduler/attendance-checker'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { action } = await request.json()
    
    switch (action) {
      case 'initialize':
        console.log('Testing morning initialization...')
        await AttendanceScheduler.initializeDailyAttendance()
        break
        
      case 'check':
        console.log('Testing attendance check...')
        await AttendanceScheduler.checkAttendance()
        break
        
      case 'finalize':
        console.log('Testing end-of-day finalization...')
        await AttendanceScheduler.finalizeAttendance()
        break
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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