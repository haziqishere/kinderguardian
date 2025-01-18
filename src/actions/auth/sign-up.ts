import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { SignUpSchemaType } from "./schema";

export const signUp = async (data: SignUpSchemaType) => {
  try {
    console.log("Starting sign up process for:", data.email);

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const firebaseId = userCredential.user.uid;
    console.log("Firebase user created:", firebaseId);

    // Create user in database through API
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseId,
        email: data.email,
        name: data.name,
        userType: data.userType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create user");
    }

    const responseData = await response.json();
    return { data: responseData };

  } catch (error: any) {
    console.error("Sign up error:", error);
    return { 
      error: error?.message || "Failed to create account" 
    };
  }
};