import { auth } from "./firebase";

export async function getCurrentUser() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user found");
  }
  return user.uid;
}