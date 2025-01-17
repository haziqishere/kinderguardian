import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user?.uid);
      },
      reject
    );
  });
}; 