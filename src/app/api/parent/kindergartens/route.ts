// app/api/parent/kindergartens/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kindergartens = await db.kindergarten.findMany({
      select: {
        id: true,
        name: true,
        classes: {
          select: {
            id: true,
            name: true,
            capacity: true,
            students: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    // Transform the data to include availability info
    const formattedKindergartens = kindergartens.map(k => ({
      id: k.id,
      name: k.name,
      classes: k.classes.map(c => ({
        id: c.id,
        name: c.name,
        capacity: c.capacity,
        _count: {
          students: c.students.length
        },
        available: c.capacity > c.students.length
      })).filter(c => c.available) // Only return classes with available spots
    })).filter(k => k.classes.length > 0); // Only return kindergartens with available classes

    return NextResponse.json({ data: formattedKindergartens });
  } catch (error) {
    console.error("[KINDERGARTENS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch kindergartens" },
      { status: 500 }
    );
  }
}