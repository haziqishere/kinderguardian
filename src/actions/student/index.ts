// src/actions/student/index.ts
import { db } from "@/lib/db";
import { AddChildSchema, AddChildSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { uploadStudentImage } from "@/lib/s3-client";

const handler = async (data: AddChildSchemaType) => {
    try {
        // First create student record without images
        const student = await db.student.create({
            data: {
                fullName: data.fullName,
                age: data.age,
                classId: data.classId,
                parentId: data.parentId,
                phoneNumbers: {
                    create: data.phoneNumbers.map(number => ({
                        phoneNumber: number
                    }))
                }
            }
        });

        // Then upload images using student ID
        const imageKeys = {
            front: data.faceImages?.front ? 
                await uploadStudentImage(student.id, data.faceImages.front, 'front') : undefined,
            left: data.faceImages?.left ?
                await uploadStudentImage(student.id, data.faceImages.left, 'left') : undefined,
            right: data.faceImages?.right ?
                await uploadStudentImage(student.id, data.faceImages.right, 'right') : undefined,
            tiltUp: data.faceImages?.tiltUp ?
                await uploadStudentImage(student.id, data.faceImages.tiltUp, 'tiltUp') : undefined,
            tiltDown: data.faceImages?.tiltDown ?
                await uploadStudentImage(student.id, data.faceImages.tiltDown, 'tiltDown') : undefined,
        };

        // Update student record with image keys
        const updatedStudent = await db.student.update({
            where: { id: student.id },
            data: {
                faceImageFront: imageKeys.front,
                faceImageLeft: imageKeys.left,
                faceImageRight: imageKeys.right,
                faceImageTiltUp: imageKeys.tiltUp,
                faceImageTiltDown: imageKeys.tiltDown,
            }
        });

        return { data: updatedStudent };
    } catch (error) {
        console.error('Error creating student:', error);
        return { error: "Failed to create student." };
    }
};

export const createStudent = createSafeAction(AddChildSchema, handler);