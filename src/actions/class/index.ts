// src/actions/class/index.ts
"use server";

import { db } from "@/lib/db";
import { ClassSchema, ClassSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { z } from "zod";

// Get all classes for a kindergarten
export const getClasses = async (kindergartenId: string) => {
  try {
    const classes = await db.class.findMany({
      where: {
        kindergartenId
      },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const classesWithDetails = classes.map(class_ => ({
      id: class_.id,
      name: class_.name,
      capacity: class_.capacity,
      studentCount: class_._count.students
    }));

    return { data: classesWithDetails };
  } catch (error) {
    console.error("[GET_CLASSES]", error);
    return { error: "Failed to fetch classes" };
  }
};

// Get a single class
export const getClass = async (classId: string) => {
  try {
    const class_ = await db.class.findUnique({
      where: { id: classId },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!class_) {
      return { error: "Class not found" };
    }

    return { 
      data: {
        ...class_,
        studentCount: class_._count.students
      }
    };
  } catch (error) {
    console.error("[GET_CLASS]", error);
    return { error: "Failed to fetch class" };
  }
};

// Create a class
const createClassHandler = async (data: ClassSchemaType) => {
  try {
    const class_ = await db.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        kindergartenId: data.kindergartenId
      }
    });

    return { data: class_ };
  } catch (error) {
    console.error("[CREATE_CLASS]", error);
    return { error: "Failed to create class" };
  }
};

// Update a class
const updateClassHandler = async (data: ClassSchemaType & { id: string }) => {
  try {
    console.log("Updating class with data:", data);  // Debug log
    
    // Check if updating would exceed capacity
    const currentStudents = await db.student.count({
      where: { classId: data.id }
    });

    if (currentStudents > data.capacity) {
      return { 
        error: `Cannot reduce capacity below current student count (${currentStudents} students)` 
      };
    }

    const class_ = await db.class.update({
      where: { id: data.id },
      data: {
        name: data.name,
        capacity: data.capacity
      }
    });

    console.log("Updated class:", class_);  // Debug log
    return { data: class_ };
  } catch (error) {
    console.error("[UPDATE_CLASS]", error);
    return { error: "Failed to update class" };
  }
};

// Delete a class
export const deleteClass = async (classId: string) => {
  try {
    // Check if class has students
    const studentCount = await db.student.count({
      where: { classId }
    });

    if (studentCount > 0) {
      return { 
        error: "Cannot delete class with enrolled students" 
      };
    }

    await db.class.delete({
      where: { id: classId }
    });

    return { data: { success: true } };
  } catch (error) {
    console.error("[DELETE_CLASS]", error);
    return { error: "Failed to delete class" };
  }
};

export const createClass = createSafeAction(ClassSchema, createClassHandler);
export const updateClass = createSafeAction(
  ClassSchema.extend({ id: z.string() }), 
  updateClassHandler
);