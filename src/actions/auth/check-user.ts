import { auth } from "@/lib/firebase";
import { fetchSignInMethodsForEmail } from "firebase/auth";

interface CheckUserParams {
  email: string;
}

export const checkUser = async ({ email }: CheckUserParams) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      return { error: "Email already in use" };
    }
    return { data: null };
  } catch (error) {
    console.error("Check user error:", error);
    return { error: "Failed to check user" };
  }
};