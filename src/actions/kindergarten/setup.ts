// actions/kindergarten/setup.ts
"use server"

import { db } from "@/lib/db";
import { z } from "zod";
import { createSafeAction } from "@/lib/create-safe-action";
import { DayOfWeek, Prisma } from "@prisma/client";

const SetupSchema = z.object({
    adminId: z.string().min(1, "Admin ID is required"),
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    operatingHours: z.array(z.object({
      dayOfWeek: z.nativeEnum(DayOfWeek),
      isOpen: z.boolean(),  // Add this
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    })).min(1, "At least one operating day is required"),
    messageAlertThreshold: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    callAlertThreshold: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  });

// actions/kindergarten/setup.ts
const handler = async (data: z.infer<typeof SetupSchema>) => {
    console.log("Setup handler called with data:", data);
    
    try {
      // Check if the kindergarten already exists
      const existingKindergarten = await db.kindergarten.findFirst({
        where: {
          name: data.name
        }
      });

      if (existingKindergarten) {
        // Check if this admin is already associated with it
        const admin = await db.admin.findUnique({
            where: { id: data.adminId},
            include: { kindergarten: true} 
        });

        if (admin?.kindergartenId === existingKindergarten.id) {
            return { data: existingKindergarten}
        }

        return { error: "Kindergarten already exists"} 
    }
        
      console.log("Starting schema validation");
      // Explicitly validate with schema
      const validatedData = SetupSchema.parse(data);
      console.log("Schema validation passed:", validatedData);
  
      console.log("Starting kindergarten creation");
      const kindergarten = await db.kindergarten.create({
        data: {
          name: validatedData.name,
          address: validatedData.address,
          messageAlertThreshold: new Date(`1970-01-01T${validatedData.messageAlertThreshold}`),
          callAlertThreshold: new Date(`1970-01-01T${validatedData.callAlertThreshold}`),
          operatingHours: {
            create: validatedData.operatingHours
              .filter(oh => oh.isOpen)
              .map(oh => ({
                dayOfWeek: oh.dayOfWeek,
                startTime: new Date(`1970-01-01T${oh.startTime}`),
                endTime: new Date(`1970-01-01T${oh.endTime}`)
              }))
          }
        }
      });
      console.log("Kindergarten created:", kindergarten);
  
      console.log("Updating admin");
      const updatedAdmin = await db.admin.update({
        where: { id: validatedData.adminId },
        data: {
          kindergartenId: kindergarten.id,
          role: "SUPER_ADMIN"
        }
      });
      console.log("Admin updated:", updatedAdmin);
  
      return { data: kindergarten };
    } catch (error) {
      console.error("Setup handler error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return { fieldErrors: error.flatten().fieldErrors };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { error: "A kindergarten with this name already exists" };
      }
      return { error: error instanceof Error ? error.message : "Failed to complete setup" };
    }
  };

export const completeSetup = createSafeAction(SetupSchema, handler);