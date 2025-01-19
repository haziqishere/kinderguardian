// app/api/images/[studentId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSignedImageUrl } from "@/lib/s3-client";

export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId;

    // First, get the student to get the kindergartenId
    const student = await db.student.findUnique({
      where: { id: studentId },
      select: {
        faceImageFront: true,
        faceImageLeft: true,
        faceImageRight: true,
        faceImageTiltUp: true,
        faceImageTiltDown: true,
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Generate signed URLs for all existing images
    const signedUrls = await Promise.all([
      student.faceImageFront && getSignedImageUrl(student.faceImageFront),
      student.faceImageLeft && getSignedImageUrl(student.faceImageLeft),
      student.faceImageRight && getSignedImageUrl(student.faceImageRight),
      student.faceImageTiltUp && getSignedImageUrl(student.faceImageTiltUp),
      student.faceImageTiltDown && getSignedImageUrl(student.faceImageTiltDown),
    ].filter(Boolean));

    // Map the URLs to their corresponding types
    const imageUrls = {
      front: signedUrls[0] || null,
      left: signedUrls[1] || null,
      right: signedUrls[2] || null,
      tiltUp: signedUrls[3] || null,
      tiltDown: signedUrls[4] || null,
    };

    return NextResponse.json({ data: imageUrls });
  } catch (error) {
    console.error("[IMAGES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch image URLs" },
      { status: 500 }
    );
  }
}