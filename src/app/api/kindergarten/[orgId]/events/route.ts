// app/api/kindergarten/[orgId]/events/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserType } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const classIds = searchParams.get('classIds')?.split(',') || [];
    const userType = searchParams.get('userType') as UserType || UserType.ALL;

    const events = await db.event.findMany({
      where: {
        kindergartenId: params.orgId,
        AND: [
          {
            OR: [
              { targetAudience: { has: UserType.ALL } },
              { targetAudience: { has: userType } }
            ]
          },
          classIds.length > 0 ? {
            classes: {
              some: {
                classId: {
                  in: classIds
                }
              }
            }
          } : {}
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
    console.log("Received body:", body);
    
    const { classId, ...eventData } = body;

    const event = await db.event.create({
      data: {
        ...eventData,
        kindergartenId: params.orgId,
        classes: {
          create: classId.map((id: string) => ({
            class: {
              connect: {
                id: id
              }
            }
          }))
        }
      },
      include: {
        classes: {
          include: {
            class: true
          }
        }
      }
    });

    return NextResponse.json({ data: event });
  } catch (error) {
    console.error("[EVENTS_POST] Full error:", error);
    console.error("[EVENTS_POST] Error message:", (error as Error).message);
    return NextResponse.json(
      { error: "Failed to create event: " + (error as Error).message },
      { status: 500 }
    );
  }
}