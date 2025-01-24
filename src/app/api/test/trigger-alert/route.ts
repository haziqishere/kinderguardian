import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { AlertType } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Test sending alert
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          type: AlertType.EMAIL
        })
      }
    )

    const result = await response.json()

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Alert test failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 