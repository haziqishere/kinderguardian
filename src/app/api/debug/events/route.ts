// Add this temporary route to check events directly
// app/api/debug/events/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allEvents = await db.event.findMany({
      include: {
        classes: {
          include: {
            class: true
          }
        }
      }
    });

    return NextResponse.json({
      count: allEvents.length,
      events: allEvents
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}