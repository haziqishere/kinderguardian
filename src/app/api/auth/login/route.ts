import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("Login API endpoint called");
  
  try {
    const body = await req.json();
    console.log("Received request body:", body);
    
    const { firebaseId } = body;

    if (!firebaseId) {
      console.error("Missing firebaseId in request");
      return new NextResponse(
        JSON.stringify({ error: "Firebase ID is required" }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log("Looking up user with firebaseId:", firebaseId);

    // Check if user exists in our database
    const parent = await db.parent.findUnique({
      where: { firebaseId },
    });

    if (parent) {
      console.log("Found parent user:", parent.id);
      return new NextResponse(
        JSON.stringify({ userType: "parent" }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const admin = await db.admin.findUnique({
      where: { firebaseId },
      include: {
        kindergarten: {
          select: { name: true }
        }
      }
    });

    if (admin) {
      console.log("Found admin user:", admin.id);
      return new NextResponse(
        JSON.stringify({
          userType: "kindergarten",
          kindergartenName: admin.kindergarten?.name
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log("No user found with firebaseId:", firebaseId);
    return new NextResponse(
      JSON.stringify({ error: "User not found in database" }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        details: (error as Error).message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 