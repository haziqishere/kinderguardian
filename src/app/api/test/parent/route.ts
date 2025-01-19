// app/api/test/parent/route.ts
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

interface FirebaseJwtPayload {
  user_id: string;
}

export async function GET() {
  try {
    const sessionCookie = cookies().get("session")?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "No session cookie" });
    }

    const decoded = jwtDecode(sessionCookie) as FirebaseJwtPayload;
    const parent = await db.parent.findUnique({
      where: { 
        firebaseId: decoded.user_id 
      },
      select: {
        id: true,
        email: true,
        firebaseId: true
      }
    });

    return NextResponse.json({ 
      parentId: parent?.id,
      email: parent?.email,
      firebaseId: parent?.firebaseId
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to get parent" });
  }
}