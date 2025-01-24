import { NextResponse } from 'next/server'
import { AttendanceScheduler } from '@/lib/scheduler/attendance-checker'

export async function POST(request: Request) {
  try {
    console.log('Starting daily attendance initialization...')
    await AttendanceScheduler.initializeDailyAttendance()
    console.log('Daily attendance initialization completed')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Attendance initialization failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 