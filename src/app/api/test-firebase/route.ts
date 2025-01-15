// src/app/api/firebase-test/route.ts
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET() {
  try {
    // Log out environment variables first
    console.log("Environment Check:", {
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY
    });

    // Try to get app information
    const app = adminAuth.app;
    const appDetails = {
      name: app.name,
      options: {
        projectId: app.options.projectId,
        credential: !!app.options.credential
      }
    };

    return NextResponse.json({
      success: true,
      app: appDetails
    });
  } catch (error) {
    console.error("Firebase Admin Test Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}