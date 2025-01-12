import { LoginSchema, LoginSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handler = async (data: LoginSchemaType) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Check user type and get additional info
    const response = await fetch("/api/auth/user-type", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseId: userCredential.user.uid,
      }),
    });

    if (!response.ok) {
      return { error: "Failed to get user information" };
    }

    const { userType } = await response.json();
    return { data: { userType } };
  } catch (error: any) {
    if (error?.code === "auth/invalid-credential") {
      return { error: "Invalid email or password" };
    }
    return { error: "Failed to sign in" };
  }
};

export const login = createSafeAction(LoginSchema, handler); 