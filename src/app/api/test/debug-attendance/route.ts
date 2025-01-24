import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { format } from 'date-fns'

export async function GET() {
  try {
    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)

    // Get all kindergartens with their thresholds
    const kindergartens = await db.kindergarten.findMany({
      select: {
        id: true,
        name: true,
        messageAlertThreshold: true,
        classes: {
          include: {
            students: {
              include: {
                attendance: {
                  where: {
                    date: {
                      equals: today
                    }
                  }
                },
                alertLogs: {
                  where: {
                    alertTime: {
                      gte: today
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    const debug = kindergartens.map(k => ({
      kindergarten: k.name,
      messageThreshold: format(k.messageAlertThreshold, 'HH:mm:ss'),
      currentTime: format(now, 'HH:mm:ss'),
      students: k.classes.flatMap(c => 
        c.students.map(s => ({
          name: s.fullName,
          attendance: s.attendance[0]?.status || 'NO_RECORD',
          lastAlert: s.alertLogs[0] ? format(s.alertLogs[0].alertTime, 'HH:mm:ss') : 'NONE'
        }))
      )
    }))

    return NextResponse.json({
      success: true,
      currentTime: format(now, 'HH:mm:ss'),
      data: debug
    })
  } catch (error) {
    console.error('Debug failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 