// app/api/parent/student/route.ts
import { db } from "@/lib/db";
import { uploadStudentImage } from "@/lib/s3-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
  
    // Calculate age from date of birth
    const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();

    // Create student record with transaction
    const student = await db.$transaction(async (tx) => {
      // Create the student
      const newStudent = await tx.student.create({
        data: {
          fullName: data.fullName,
          age,
          classId: data.classId,
          parentId: data.parentId,
          // Initialize image fields as null first
          faceImageFront: null,
          faceImageLeft: null,
          faceImageRight: null,
          faceImageTiltUp: null,
          faceImageTiltDown: null,
        },
        include: {
          class: {
            select: {
              kindergartenId: true
            }
          }
        }
      });

      // Get kindergartenId from class relationship
      const kindergartenId = newStudent.class?.kindergartenId;

       // Upload images using new student's ID
       const imageKeys = await Promise.all([
        data.faceImages.front && uploadStudentImage(
          kindergartenId!,
          newStudent.id, 
          data.faceImages.front, 
          'front'
        ),
        data.faceImages.left && uploadStudentImage(
          kindergartenId!,
          newStudent.id, 
          data.faceImages.left, 
          'left'
        ),
        data.faceImages.right && uploadStudentImage(
          kindergartenId!,
          newStudent.id, 
          data.faceImages.right, 
          'right'
        ),
        data.faceImages.tiltUp && uploadStudentImage(
          kindergartenId!,
          newStudent.id, 
          data.faceImages.tiltUp, 
          'tiltUp'
        ),
        data.faceImages.tiltDown && uploadStudentImage(
          kindergartenId!,
          newStudent.id, 
          data.faceImages.tiltDown, 
          'tiltDown'
        )
      ]);

      // Update student with image paths
      const updateStudent = await tx.student.update({
        where: { id: newStudent.id},
        data: {
          faceImageFront: imageKeys[0] || null,
          faceImageLeft: imageKeys[1] || null,
          faceImageRight: imageKeys[2] || null,
          faceImageTiltUp: imageKeys[3] || null,
          faceImageTiltDown: imageKeys[4] || null,
        },
      });

      // Create phone numbers
      await tx.parentPhoneNumber.createMany({
        data: data.phoneNumbers.map((number: string) => ({
          phoneNumber: number,
          studentId: newStudent.id
        }))
      });

      return updateStudent;
    });

    return NextResponse.json({ data: student });
  } catch (error) {
    console.error("[STUDENT_CREATE]", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}