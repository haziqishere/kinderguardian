import { NextResponse } from "next/server";

const S3_BUCKET_URL = "https://kinderguardian-student-images-dev.s3.ap-southeast-5.amazonaws.com";

export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId;
    
    // Generate URLs for all image types
    const imageUrls = {
      front: `${S3_BUCKET_URL}/students/${studentId}/front.jpg`,
      left: `${S3_BUCKET_URL}/students/${studentId}/left.jpg`,
      right: `${S3_BUCKET_URL}/students/${studentId}/right.jpg`,
      tiltUp: `${S3_BUCKET_URL}/students/${studentId}/tiltUp.jpg`,
      tiltDown: `${S3_BUCKET_URL}/students/${studentId}/tiltDown.jpg`,
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