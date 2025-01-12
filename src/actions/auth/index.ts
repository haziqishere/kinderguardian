import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { z } from "zod";

const CheckUserSchema = z.object({
  email: z.string().email(),
});

type CheckUserSchemaType = z.infer<typeof CheckUserSchema>;

const checkUserHandler = async (data: CheckUserSchemaType) => {
  try {
    const parent = await db.parent.findUnique({
      where: { email: data.email },
    });

    const admin = await db.admin.findUnique({
      where: { email: data.email },
    });

    if (parent || admin) {
      return { error: "User already exists" };
    }

    return { data: null };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const checkUser = createSafeAction(CheckUserSchema, checkUserHandler);
export * from './sign-up';
export * from './login';
export * from './schema'; 