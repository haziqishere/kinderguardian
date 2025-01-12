import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firebaseId } = body;

    if (!firebaseId) {
      return new NextResponse("Firebase ID is required", { status: 400 });
    }

    // Check if user is a parent
    const parent = await db.parent.findUnique({
      where: { firebaseId },
    });

    if (parent) {
      return NextResponse.json({ userType: "parent" });
    }

    // Check if user is an admin
    const admin = await db.admin.findUnique({
      where: { firebaseId },
      include: {
        kindergarten: {
          select: { name: true }
        }
      }
    });

    if (admin && admin.kindergarten) {
      return NextResponse.json({
        userType: "kindergarten",
        kindergartenName: admin.kindergarten.name,
      });
    } else if (admin) {
      return NextResponse.json({
        userType: "kindergarten",
        kindergartenName: null,
      });
    }

    return new NextResponse("User not found", { status: 404 });
  } catch (error) {
    console.error("[USER_TYPE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 