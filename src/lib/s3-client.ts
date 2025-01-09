import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadStudentImage(
  studentId: string,
  base64Image: string,
  angle: 'front' | 'left' | 'right' | 'tiltUp' | 'tiltDown'
): Promise<string> {
  const key = `students/${studentId}/${angle}.jpg`;
  
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
      },
    });

    await upload.done();
    return key;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image');
  }
}

export async function getSignedImageUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });

    // URL expires in 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate image URL');
  }
}

export async function getUploadUrl(
  studentId: string,
  angle: 'front' | 'left' | 'right' | 'tiltUp' | 'tiltDown'
): Promise<string> {
  const key = `students/${studentId}/${angle}.jpg`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: 'image/jpeg',
    });

    // URL expires in 10 minutes
    return await getSignedUrl(s3Client, command, { expiresIn: 600 });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}