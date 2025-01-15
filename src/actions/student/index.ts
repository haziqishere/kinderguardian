// src/actions/student/index.ts
import { db } from "@/lib/db";
import { StudentSchema, StudentSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { z } from "zod";

// Get all students for a kindergarten
export const getStudents = async (kindergartenId: string) => {
  try {
    const students = await db.student.findMany({
      where: {
        class: {
          kindergartenId
        }
      },
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        },
        attendance: {
          orderBy: {
            date: 'desc'
          },
          take: 30 // Last 30 days for attendance calculation
        }
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    // Calculate attendance performance
    const studentsWithPerformance = students.map(student => {
      const totalDays = student.attendance.length;
      const presentDays = student.attendance.filter(
        a => a.status === 'ON_TIME' || a.status === 'LATE'
      ).length;
      const attendancePerformance = totalDays > 0 
        ? ((presentDays / totalDays) * 100).toFixed(1) + '%'
        : 'N/A';

      if (!student.class) {
        throw new Error(`Student ${student.id} has no assigned class`);
      }

      return {
        id: student.id,
        name: student.fullName,
        age: student.age,
        class: student.class.name,
        daysAbsent: student.daysAbsent,
        attendancePerformance
      };
    });

    return { data: studentsWithPerformance };
  } catch (error) {
    console.error("[GET_STUDENTS]", error);
    return { error: "Failed to fetch students" };
  }
};

// Get a single student
export const getStudent = async (studentId: string) => {
  try {
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        attendance: {
          orderBy: {
            date: 'desc'
          },
          take: 10,
        },
        alertLogs: {
          orderBy: {
            alertTime: 'desc'
          },
          take: 5,
        },
      },
    });

    if (!student) {
      return { error: "Student not found" };
    }

    return { data: student };
  } catch (error) {
    console.error("[GET_STUDENT]", error);
    return { error: "Failed to fetch student" };
  }
};

// Create a student
const createStudentHandler = async (data: StudentSchemaType) => {
  try {
    const student = await db.student.create({
      data: {
        fullName: data.fullName,
        age: data.age,
        classId: data.classId,
        parentId: data.parentId,
        faceImageFront: data.faceImageFront,
        faceImageLeft: data.faceImageLeft,
        faceImageRight: data.faceImageRight,
        faceImageTiltUp: data.faceImageTiltUp,
        faceImageTiltDown: data.faceImageTiltDown,
      },
      include: {
        class: true
      }
    });

    return { data: student };
  } catch (error) {
    console.error("[CREATE_STUDENT]", error);
    return { error: "Failed to create student" };
  }
};

// Update a student
const updateStudentHandler = async (data: StudentSchemaType & { id: string }) => {
  try {
    const student = await db.student.update({
      where: { id: data.id },
      data: {
        fullName: data.fullName,
        age: data.age,
        classId: data.classId,
        faceImageFront: data.faceImageFront,
        faceImageLeft: data.faceImageLeft,
        faceImageRight: data.faceImageRight,
        faceImageTiltUp: data.faceImageTiltUp,
        faceImageTiltDown: data.faceImageTiltDown,
      },
      include: {
        class: true
      }
    });

    return { data: student };
  } catch (error) {
    console.error("[UPDATE_STUDENT]", error);
    return { error: "Failed to update student" };
  }
};

export const createStudent = createSafeAction(StudentSchema, createStudentHandler);
export const updateStudent = createSafeAction(
  StudentSchema.extend({ id: z.string() }), 
  updateStudentHandler
);