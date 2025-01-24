import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { AttendanceStatus } from '@prisma/client'
import { parse, format } from 'date-fns'

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get student's kindergarten operating hours and thresholds
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            kindergarten: {
              include: {
                operatingHours: true
              }
            }
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    const currentTime = new Date()
    const messageThreshold = student.class?.kindergarten?.messageAlertThreshold
    // Check if messageThreshold is defined before determining the status
    const status = messageThreshold && currentTime > messageThreshold 
      ? AttendanceStatus.LATE 
      : AttendanceStatus.ON_TIME
    const attendance = await db.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date: today
        }
      },
      create: {
        studentId,
        date: today,
        status,
        timeRecorded: currentTime
      },
      update: {
        status,
        timeRecorded: currentTime
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        attendance,
        status
      }
    })
  } catch (error) {
    console.error('Mark present failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 