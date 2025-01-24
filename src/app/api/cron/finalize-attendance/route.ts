import { NextResponse } from 'next/server'
import { AttendanceScheduler } from '@/lib/scheduler/attendance-checker'

export async function POST(request: Request) {
  try {
    console.log('Starting attendance finalization...')
    await AttendanceScheduler.finalizeAttendance()
    console.log('Attendance finalization completed')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Attendance finalization failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 