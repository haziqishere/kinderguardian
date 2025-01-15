// src/actions/class/index.ts
import { db } from "@/lib/db";
import { 
    ClassSchema, 
    ClassSchemaType, 
    UpdateClassSchema, 
    UpdateClassSchemaType 
} from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { z } from "zod";

// Create a class handler
const createHandler = async (data: ClassSchemaType) => {
    try {
        const class_ = await db.class.create({
            data: {
                name: data.name,
                capacity: data.capacity,
                kindergartenId: data.kindergartenId
            }
        });

        return { data: class_ };
    } catch (error) {
        return { error: "Failed to create class." };
    }
};

// Update class handler
const updateHandler = async (data: UpdateClassSchemaType) => {
    try {
        const updated = await db.class.update({
            where: { id: data.id },
            data: {
                name: data.name,
                capacity: data.capacity,
                kindergartenId: data.kindergartenId
            }
        });

        return { data: updated };
    } catch (error) {
        return { error: "Failed to update class." };
    }
};

export const createClass = createSafeAction(ClassSchema, createHandler);
export const updateClass = createSafeAction(UpdateClassSchema, updateHandler);