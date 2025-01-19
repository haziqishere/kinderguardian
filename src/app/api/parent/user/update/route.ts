// api/parent/update/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { studentId, updates } = await request.json();

  try {
    // Start a transaction to update student and phone numbers
    const updatedStudent = await db.$transaction(async (tx) => {
      // Update student basic info
      const student = await tx.student.update({
        where: { id: studentId },
        data: {
          fullName: updates.name,
          age: updates.age,
          classId: updates.classId
        }
      });

      // Handle phone numbers update
      if (updates.phoneNumbers) {
        // Delete existing phone numbers
        await tx.parentPhoneNumber.deleteMany({
          where: { studentId }
        });

        // Create new phone numbers
        await tx.parentPhoneNumber.createMany({
          data: updates.phoneNumbers.map((number: string) => ({
            phoneNumber: number,
            studentId
          })),
        });
      }

      return student;
    });

    return NextResponse.json({ data: updatedStudent });
  } catch (error) {
    console.error('[UPDATE_STUDENT]', error);
    return NextResponse.json({ error: 'Failed to update student information' }, { status: 500 });
  }
}