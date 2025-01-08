import {z} from "zod";

// Sub-schemas for each step
export const basicInfoSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    age: z.number().min(1).max(6, "Age must be between 0 and 12"),
    classId: z.string().min(1, "Class is required"),
    parentId: z.string().min(1, "Parent information is required"),
    phoneNumbers: z.array(
        z.string().regex(/^01\d{8,9}$/, "Invalid Malaysian phone number format")
    ).min(1, "At least one phone number is required"),
});

export const faceImageSchema = z.object({
    faceImages: z.object({
        front: z.string().optional(),
        left: z.string().optional(),
        right: z.string().optional(),
        tiltUp: z.string().optional(),
        tiltDown: z.string().optional()
    })
})

export const consentSchema = z.object({
    consent: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
    dataPermission: z.boolean().refine((val) => val === true, {
        message: "You must give permission to use the data"
    }),
});

// Combined schema for the entire form
export const AddChildSchema = basicInfoSchema.merge(faceImageSchema).merge(consentSchema);


export type AddChildSchemaType = z.infer<typeof AddChildSchema>;
export type BasicInfoSchemaType = z.infer<typeof basicInfoSchema>;
export type FaceImageSchemaType = z.infer<typeof faceImageSchema>;
export type ConsentSchemaTYpe = z.infer<typeof consentSchema>;