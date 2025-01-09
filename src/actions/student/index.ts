// src/actions/student/index.ts
import { db } from "@/lib/db";
import { AddChildSchema, AddChildSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { uploadStudentImage } from "@/lib/s3-client";

const handler = async (data: AddChildSchemaType) => {
    try {
        // First upload all images to S3
        const imageKeys = {
            front: data.faceImages?.front ? 
                await uploadStudentImage(data.parentId, data.faceImages.front, 'front') : undefined,
            left: data.faceImages?.left ?
                await uploadStudentImage(data.parentId, data.faceImages.left, 'left') : undefined,
            right: data.faceImages?.right ?
                await uploadStudentImage(data.parentId, data.faceImages.right, 'right') : undefined,
            tiltUp: data.faceImages?.tiltUp ?
                await uploadStudentImage(data.parentId, data.faceImages.tiltUp, 'tiltUp') : undefined,
            tiltDown: data.faceImages?.tiltDown ?
                await uploadStudentImage(data.parentId, data.faceImages.tiltDown, 'tiltDown') : undefined,
        };

        // Create student record with S3 keys
        const student = await db.student.create({
            data: {
                fullName: data.fullName,
                age: data.age,
                classId: data.classId,
                parentId: data.parentId,
                faceImageFront: imageKeys.front,
                faceImageLeft: imageKeys.left,
                faceImageRight: imageKeys.right,
                faceImageTiltUp: imageKeys.tiltUp,
                faceImageTiltDown: imageKeys.tiltDown,
                phoneNumbers: {
                    create: data.phoneNumbers.map(number => ({
                        phoneNumber: number
                    }))
                }
            }
        });

        return { data: student };
    } catch (error) {
        console.error('Error creating student:', error);
        return { error: "Failed to create student." };
    }
};

export const createStudent = createSafeAction(AddChildSchema, handler);