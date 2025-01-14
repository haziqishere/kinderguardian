// src/actions/auth/login.ts
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoginSchemaType } from "./schema";
import { useRouter } from "next/navigation";

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
    console.log("Firebase login successful for user:", firebaseId);

    // API call
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firebaseId }),
      cache: 'no-store'
    });

    console.log("API Response Status:", response.status);
    
    const responseData = await response.json();

    if (response.status === 403) {
      // User needs to complete registration
      return { 
        error: "Please complete your registration",
        redirect: "/complete-registration"
      };
    }

    if (!response.ok) {
      throw new Error(responseData.error || "Failed to validate login");
    }

    return { data: responseData };

  } catch (error: any) {
    console.error("Login error:", error);
    return { 
      error: error?.message || "Failed to login" 
    };
  }
};