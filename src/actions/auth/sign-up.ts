import { SignUpSchema, SignUpSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handler = async (data: SignUpSchemaType) => {
  try {
    // Create Firebase user first
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (data.userType === "parent") {
      const parent = await db.parent.create({
        data: {
          email: data.email,
          name: data.name,
          firebaseId: userCredential.user.uid,
        },
      });
      return { data: parent };
    } else {
      // Create admin record for kindergarten
      const admin = await db.admin.create({
        data: {
          email: data.email,
          name: data.name,
          firebaseId: userCredential.user.uid,
          role: "SUPER_ADMIN",
          kindergarten: {
            create: {
              name: "Untitled Kindergarten", // This will be updated later
              address: "To be updated", // This will be updated later
              messageAlertThreshold: new Date("1970-01-01T09:00:00"), // Default 9 AM
              callAlertThreshold: new Date("1970-01-01T10:00:00"), // Default 10 AM
            }
          }
        },
      });
      return { data: admin };
    }
  } catch (error: any) {
    if (error?.code === "auth/email-already-in-use") {
      return { error: "Email already in use" };
    }
    return { error: "Failed to create user." };
  }
};

export const signUp = createSafeAction(SignUpSchema, handler); 