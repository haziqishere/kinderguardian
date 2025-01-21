// app/api/kindergarten/[orgId]/events/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserType } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log("API: Fetching events for kindergarten:", params.orgId);

    const events = await db.event.findMany({
      where: {
        kindergartenId: params.orgId,
        // Remove the targetAudience filter for now
        // OR modify it to include empty arrays
        OR: [
          {
            targetAudience: {
              has: UserType.ALL
            }
          },
          {
            targetAudience: {
              has: UserType.ADMIN
            }
          },
          {
            targetAudience: {
              isEmpty: true
            }
          }
        ]
      },
      include: {
        classes: {
          include: {
            class: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    console.log("API: Found events:", events);

    return NextResponse.json({ data: events });
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const body = await req.json();
    
    const event = await db.event.create({
      data: {
        ...body,
        kindergartenId: params.orgId,
      },
    });

    return NextResponse.json({ data: event });
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}