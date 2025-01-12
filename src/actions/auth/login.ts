import { LoginSchema, LoginSchemaType, LoginReturnType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handler = async (data: LoginSchemaType): Promise<{ data?: LoginReturnType; error?: string }> => {
  try {
    console.log("Starting login process for email:", data.email);

    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    ).catch((error) => {
      console.error("Firebase auth error:", error.code, error.message);
      throw error;
    });

    if (!userCredential) {
      console.error("No user credential returned from Firebase");
      return { error: "Failed to authenticate" };
    }

    console.log("Firebase login successful for user:", userCredential.user.uid);

    try {
      // Check if user exists in our database through API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseId: userCredential.user.uid,
        }),
      });

      const result = await response.json();
      console.log("API response:", { status: response.status, data: result });

      if (!response.ok) {
        if (response.status === 404) {
          return { error: "Account exists in Firebase but not in our database. Please register first." };
        }
        return { error: result.error || "Failed to verify user" };
      }

      return { 
        data: { 
          userType: result.userType,
          kindergartenName: result.kindergartenName 
        } 
      };
    } catch (apiError) {
      console.error("API call error:", apiError);
      return { error: "Failed to verify user in database" };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    if (error?.code === "auth/invalid-credential") {
      return { error: "Invalid email or password" };
    }
    if (error?.code === "auth/invalid-email") {
      return { error: "Invalid email format" };
    }
    if (error?.code === "auth/user-disabled") {
      return { error: "Account has been disabled" };
    }
    if (error?.code === "auth/user-not-found") {
      return { error: "No account found with this email" };
    }
    if (error?.code === "auth/wrong-password") {
      return { error: "Incorrect password" };
    }
    return { error: "Something went wrong" };
  }
};

export const login = createSafeAction(LoginSchema, handler); 