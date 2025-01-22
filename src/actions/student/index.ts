// src/actions/student/index.ts
import { db } from "@/lib/db";
import { StudentSchema, StudentSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { uploadStudentImage } from "@/lib/s3-client";
import { z } from "zod";

// Helper to validate image data
const validateImageData = (imageData: string) => {
  if (!imageData.startsWith('data:image/')) {
    throw new Error('Invalid image format');
  }
  const base64Data = imageData.split(',')[1];
  if (!base64Data) {
    throw new Error('Invalid image data');
  }
  return true;
};

// Helper to validate all required images
const validateAllImages = (faceImages: StudentSchemaType['faceImages']) => {
  const requiredImages = ['front', 'left', 'right', 'tiltUp', 'tiltDown'] as const;
  for (const type of requiredImages) {
    if (!faceImages[type]) {
      throw new Error(`Missing required image: ${type}`);
    }
    validateImageData(faceImages[type]);
  }
  return true;
};

const handler = async (data: StudentSchemaType) => {
  // Array to store successfully uploaded image keys for cleanup in case of failure
  const uploadedImageKeys: string[] = [];

  try {
    // Validate all images first
    validateAllImages(data.faceImages);

    // First verify if class belongs to selected kindergarten
    const classData = await db.class.findUnique({
      where: { id: data.classId },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!classData) {
      return { error: "Class not found" };
    }

    // Check if class has capacity
    if (classData._count.students >= classData.capacity) {
      return { error: "Class is full" };
    }

    // Calculate age from date of birth
    const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();

    // Create student with transaction to ensure all related data is created
    const student = await db.$transaction(async (tx) => {
      // Create student first
      const newStudent = await tx.student.create({
        data: {
          fullName: data.fullName,
          age,
          classId: data.classId,
          parentId: data.parentId,
          // Initialize image fields as null
          faceImageFront: null,
          faceImageLeft: null,
          faceImageRight: null,
          faceImageTiltUp: null,
          faceImageTiltDown: null,
        }
      });

      // Now upload images with the correct studentId
      const imageKeys = {
        front: null as string | null,
        left: null as string | null,
        right: null as string | null,
        tiltUp: null as string | null,
        tiltDown: null as string | null,
      };

      try {
        // Upload images sequentially to maintain order and handle errors
        const imageTypes = ['front', 'left', 'right', 'tiltUp', 'tiltDown'] as const;
        for (const type of imageTypes) {
          const imageData = data.faceImages[type];
          if (imageData) {
            const key = await uploadStudentImage(
              data.kindergartenId,
              newStudent.id, // Now we have the actual studentId
              imageData,
              type
            );
            if (!key) {
              throw new Error(`Failed to upload ${type} image`);
            }
            imageKeys[type] = key;
            uploadedImageKeys.push(key);
          }
        }

        // Update student with image keys
        await tx.student.update({
          where: { id: newStudent.id },
          data: {
            faceImageFront: imageKeys.front,
            faceImageLeft: imageKeys.left,
            faceImageRight: imageKeys.right,
            faceImageTiltUp: imageKeys.tiltUp,
            faceImageTiltDown: imageKeys.tiltDown,
          }
        });
      } catch (uploadError) {
        // If any upload fails, we need to clean up the already uploaded images
        console.error('[IMAGE_UPLOAD_ERROR]:', uploadError);
        throw new Error('Failed to upload all required images');
      }

      // Create phone numbers
      await tx.parentPhoneNumber.createMany({
        data: data.phoneNumbers.map(number => ({
          phoneNumber: number,
          studentId: newStudent.id
        }))
      });

      return newStudent;
    });

    return { data: student };
  } catch (error) {
    console.error('[ADD_CHILD_ERROR]:', error);
    
    // Clean up uploaded images if the transaction failed
    if (uploadedImageKeys.length > 0) {
      try {
        // TODO: Implement deleteStudentImage function in s3-client
        // await Promise.all(uploadedImageKeys.map(key => deleteStudentImage(key)));
        console.log('Cleaned up uploaded images:', uploadedImageKeys);
      } catch (cleanupError) {
        console.error('[CLEANUP_ERROR]:', cleanupError);
      }
    }

    return { 
      error: error instanceof Error 
        ? error.message 
        : "Failed to create student"
    };
  }
};

// Remove duplicate handlers and only export the main handler
export const addChild = createSafeAction(StudentSchema, handler);

// Function to get students by kindergartenId
export async function getStudents(kindergartenId: string) {
  try {
    const students = await db.student.findMany({
      where: {
        class: {
          kindergartenId: kindergartenId,
        },
      },
      include: {
        class: true,
        attendance: {
          orderBy: {
            date: 'desc',
          },
          take: 30, // Last 30 days
        },
      },
    });

    // Transform the data to match the Student interface
    const formattedStudents = students.map((student) => {
      // Calculate days absent
      const daysAbsent = student.attendance.filter(
        (a) => a.status === "ABSENT"
      ).length;

      // Calculate attendance performance
      const totalDays = student.attendance.length;
      const presentDays = student.attendance.filter(
        (a) => a.status === "ON_TIME" || a.status === "LATE"
      ).length;
      const attendanceRate = totalDays > 0
        ? ((presentDays / totalDays) * 100).toFixed(1) + "%"
        : "N/A";

      return {
        id: student.id,
        name: student.fullName,
        age: student.age,
        class: student.class?.name || "Unassigned",
        daysAbsent,
        attendancePerformance: attendanceRate,
      };
    });

    return {
      data: formattedStudents,
    };
  } catch (error) {
    console.error("[GET_STUDENTS]", error);
    return {
      error: "Failed to fetch students",
    };
  }
}