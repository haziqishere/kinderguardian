import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
if (!BUCKET_NAME) {
  console.error('AWS_BUCKET_NAME environment variable is not set');
}

export async function uploadStudentImage(
  kindergartenId: string,
  studentId: string,
  base64Image: string,
  angle: 'front' | 'left' | 'right' | 'tiltUp' | 'tiltDown'
): Promise<string> {
  const key = `${kindergartenId}/${studentId}/${angle}.jpg`;
  
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

// Helper function to delete all student images
export async function deleteStudentImage(
  kindergartenId: string,
  studentId: string,
  imageKey: string
) {
  try {
    if (!BUCKET_NAME) {
      throw new Error('S3_BUCKET_NAME is not configured');
    }

    // Get just the filename from the full path
    const filename = imageKey.split('/').pop();
    if (!filename) {
      throw new Error('Invalid image key format');
    }

    // Construct the correct key with kindergartenId/studentId/filename
    const key = `${kindergartenId}/${studentId}/${filename}`;
    
    console.log('[S3_DELETE] Attempting to delete from bucket:', BUCKET_NAME);
    console.log('[S3_DELETE] Key:', key);
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log('[S3_DELETE] Successfully deleted:', key);
    return true;
  } catch (error) {
    console.error('[S3_DELETE] Error deleting image:', error);
    console.error('[S3_DELETE] Failed key:', imageKey);
    return false;
  }
}

export async function deleteAllStudentImages(
  kindergartenId: string,
  studentId: string,
  imageKeys: string[]
) {
  try {
    console.log('[S3_DELETE_ALL] Starting deletion of images for student:', studentId);
    console.log('[S3_DELETE_ALL] Image keys:', imageKeys);
    
    const deletePromises = imageKeys
      .filter(key => key) // Filter out null/empty keys
      .map(key => deleteStudentImage(kindergartenId, studentId, key));
    
    const results = await Promise.all(deletePromises);
    console.log('[S3_DELETE_ALL] Deletion results:', results);
    
    return results.every(result => result === true);
  } catch (error) {
    console.error('[S3_DELETE_ALL] Error deleting all images:', error);
    return false;
  }
}