import { NextResponse } from 'next/server'
import { AttendanceScheduler } from '@/lib/scheduler/attendance-checker'

export async function POST(request: Request) {
  try {
    console.log('Starting attendance check...')
    await AttendanceScheduler.checkAttendance()
    console.log('Attendance check completed successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Attendance check failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 