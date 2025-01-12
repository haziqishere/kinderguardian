import { SignUpSchema, SignUpSchemaType, SignUpReturnType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handler = async (data: SignUpSchemaType): Promise<{ data?: SignUpReturnType; error?: string }> => {
  let firebaseUser = null;
  
  try {
    console.log("Starting sign-up process for email:", data.email);
    
    // Create Firebase user first
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    ).catch((error) => {
      console.error("Firebase auth error:", error.code, error.message);
      throw error;
    });

    if (!userCredential) {
      return { error: "Failed to create Firebase user" };
    }

    firebaseUser = userCredential.user;
    console.log("Firebase user created with ID:", firebaseUser.uid);

    // Get the base URL
    const baseUrl = window.location.origin;
    console.log("Making API call to:", `${baseUrl}/api/auth/register`);

    // Register user in our database through API
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseId: firebaseUser.uid,
        email: data.email,
        name: data.name,
        userType: data.userType,
      }),
    });

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse API response:", e);
      await firebaseUser.delete();
      return { error: "Invalid server response" };
    }

    console.log("Register API response:", response.status, responseData);

    if (!response.ok) {
      // If registration fails, delete the Firebase user
      console.error("Failed to create database record:", responseData.error);
      await firebaseUser.delete();
      return { error: responseData.error || "Failed to create account" };
    }

    return {
      data: {
        userType: data.userType,
        kindergartenName: responseData.kindergarten?.name,
        email: data.email,
        name: data.name,
      },
    };
  } catch (error: any) {
    console.error("Sign-up error:", error);
    
    // Clean up Firebase user if it was created but database creation failed
    if (firebaseUser) {
      try {
        await firebaseUser.delete();
        console.log("Cleaned up Firebase user after error");
      } catch (deleteError) {
        console.error("Failed to clean up Firebase user:", deleteError);
      }
    }

    if (error?.code === "auth/email-already-in-use") {
      return { error: "Email already in use" };
    }
    if (error?.code === "auth/invalid-email") {
      return { error: "Invalid email address" };
    }
    if (error?.code === "auth/weak-password") {
      return { error: "Password is too weak" };
    }
    if (error?.code === "auth/network-request-failed") {
      return { error: "Network error. Please check your connection." };
    }
    return { error: error.message || "Failed to create account" };
  }
};

export const signUp = createSafeAction(SignUpSchema, handler); 