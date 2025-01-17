// app/api/kindergarten/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kindergartens = await db.kindergarten.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        _count: {
          select: {
            classes: true,
            admins: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ data: kindergartens });
  } catch (error) {
    console.error("[GET_KINDERGARTENS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch kindergartens" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { adminId, kindergartenId } = await req.json();

    // Validate input
    if (!adminId || !kindergartenId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingAdmin = await db.admin.findUnique({
      where: { id: adminId },
      include: { kindergarten: true }
    });

    if (existingAdmin?.kindergartenId) {
      return NextResponse.json(
        { error: "Admin already associated with a kindergarten" },
        { status: 400 }
      );
    }

    const kindergarten = await db.kindergarten.findUnique({
      where: { id: kindergartenId }
    });

    if (!kindergarten) {
      return NextResponse.json(
        { error: "Kindergarten not found" },
        { status: 404 }
      );
    }

    const updatedAdmin = await db.admin.update({
      where: { id: adminId },
      data: {
        kindergartenId,
        role: "ADMIN"
      }
    });

    return NextResponse.json({ data: updatedAdmin });
  } catch (error) {
    console.error("[JOIN_KINDERGARTEN_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to join kindergarten" },
      { status: 500 }
    );
  }
}