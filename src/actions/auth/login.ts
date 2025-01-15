// src/actions/auth/login.ts
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { LoginSchemaType } from "./schema";

export const login = async (data: LoginSchemaType) => {
  try {
    console.log("Starting login process for email:", data.email);

    // Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const firebaseId = userCredential.user.uid;
    const idToken = await userCredential.user.getIdToken();
    console.log("Firebase login successful for user:", firebaseId);

    // Create session first
    const sessionResponse = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!sessionResponse.ok) {
      throw new Error("Failed to create session");
    }

    // Then validate user type
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firebaseId }),
    });

    console.log("API Response Status:", response.status);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Failed to login");
    }

    return { data: responseData };

  } catch (error: any) {
    console.error("Login error:", error);
    return { 
      error: error?.message || "Failed to login"
    };
  }
};

export const logout = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    
    // Clear session cookie
    await fetch("/api/auth/session", {
      method: "DELETE",
    });

    return { data: { success: true } };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { error: "Failed to logout" };
  }
};
