import { db } from "@/lib/db";
import { AddChildSchema, AddChildSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: AddChildSchemaType) => {
    try {
        const student = await db.student.create({
            data: {
                fullName: data.fullName,
                age: data.age,
                classId: data.classId,
                parentId: data.parentId,
                faceImageFront: data.faceImages.front,
                faceImageLeft: data.faceImages.left,
                faceImageRight: data.faceImages.right,
                faceImageTiltUp: data.faceImages.tiltUp,
                faceImageTiltDown: data.faceImages.tiltDown,
                phoneNumbers: {
                    create: data.phoneNumbers.map(number => ({
                        phoneNumber: number
                    }))
                }
            }
        });

        return { data: student };
    } catch (error) {
        return { error: "Failed to create student." };
    }
};

export const createStudent = createSafeAction(AddChildSchema, handler);