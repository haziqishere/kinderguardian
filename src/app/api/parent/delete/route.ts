// app/api/parent/delete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteAllStudentImages } from '@/lib/s3-client';

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json();
    console.log('[DELETE_STUDENT] Starting deletion for studentId:', studentId);

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get student data first to get the image keys and kindergarten ID
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          select: {
            kindergartenId: true
          }
        }
      }
    });

    console.log('[DELETE_STUDENT] Found student data:', student);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Collect all image keys
    const imageKeys = [
      student.faceImageFront,
      student.faceImageLeft,
      student.faceImageRight,
      student.faceImageTiltUp,
      student.faceImageTiltDown
    ].filter(Boolean) as string[];

    console.log('[DELETE_STUDENT] Image keys to delete:', imageKeys);

    // Check if student.class is defined before accessing kindergartenId
    const kindergartenId = student.class?.kindergartenId;

    if (!kindergartenId) {
      console.error('[DELETE_STUDENT] KindergartenId is not available');
      return NextResponse.json({ error: 'KindergartenId is required' }, { status: 400 });
    }

    // Delete student and related data in a transaction
    await db.$transaction(async (tx) => {
      console.log('[DELETE_STUDENT] Starting database transaction');
      
      // Delete phone numbers first (handle foreign key constraint)
      await tx.parentPhoneNumber.deleteMany({
        where: { studentId }
      });

      // Delete the student
      await tx.student.delete({
        where: { id: studentId }
      });
      
      console.log('[DELETE_STUDENT] Database transaction completed');
    });

    // Delete images from S3 after successful DB transaction
    if (imageKeys.length > 0) {
      console.log('[DELETE_STUDENT] Attempting to delete images from S3');
      
      const deleted = await deleteAllStudentImages(
        kindergartenId,
        studentId,
        imageKeys
      );

      console.log('[DELETE_STUDENT] S3 deletion result:', deleted);

      if (!deleted) {
        console.error('[DELETE_STUDENT] Failed to delete some or all images from S3');
      }
    } else {
      console.log('[DELETE_STUDENT] No images to delete from S3');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE_STUDENT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}