import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { firebaseId } = await req.json();

    // Check if user is a parent
    const parent = await db.parent.findUnique({
      where: { firebaseId },
    });

    if (parent) {
      return NextResponse.json({
        userType: "parent",
      });
    }

    // Check if user is an admin
    const admin = await db.admin.findUnique({
      where: { firebaseId },
      include: {
        kindergarten: true,
      },
    });

    if (admin) {
      return NextResponse.json({
        userType: "kindergarten",
        kindergartenName: admin.kindergarten.name,
      });
    }

    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  } catch (error) {
    console.error("User type check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 