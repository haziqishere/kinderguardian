// app/api/kindergarten/[orgId]/classes/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const classes = await db.class.findMany({
      where: { 
        kindergartenId: params.orgId 
      },
      select: {
        id: true,
        name: true,
        capacity: true,
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

    return NextResponse.json({ data: classes });
  } catch (error) {
    console.error("[CLASSES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}