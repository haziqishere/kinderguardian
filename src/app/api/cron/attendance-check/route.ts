import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { AttendanceScheduler } from '@/lib/scheduler/attendance-checker'

export async function POST(request: Request) {
  const headersList = headers()
  const authHeader = headersList.get('Authorization')
  
  // Verify the cron secret
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    console.log('Unauthorized attempt to access attendance check')
    return new NextResponse('Unauthorized', { status: 401 })
  }

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