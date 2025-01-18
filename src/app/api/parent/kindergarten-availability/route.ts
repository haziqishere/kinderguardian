// app/api/parent/kindergarten-availability/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { classId } = await request.json();

    const classData = await db.class.findUnique({
      where: { id: classId },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!classData) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    const isAvailable = classData._count.students < classData.capacity;

    return NextResponse.json({
      data: {
        isAvailable,
        currentCount: classData._count.students,
        capacity: classData.capacity
      }
    });

  } catch (error) {
    console.error("[CLASS_AVAILABILITY_CHECK]", error);
    return NextResponse.json(
      { error: "Failed to check class availability" },
      { status: 500 }
    );
  }
}