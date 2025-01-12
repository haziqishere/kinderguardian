import { db } from "@/lib/db";
import { LoginSchema, LoginSchemaType, RegisterSchema, RegisterSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const loginHandler = async (data: LoginSchemaType) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const response = await fetch("/api/auth/user-type", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseId: userCredential.user.uid,
      }),
    });

    const { userType, kindergartenName } = await response.json();
    return { data: { userType, kindergartenName } };
  } catch (error) {
    return { error: "Invalid credentials." };
  }
};

const registerHandler = async (data: RegisterSchemaType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (data.userType === "parent") {
      const parent = await db.parent.create({
        data: {
          firebaseId: userCredential.user.uid,
          email: data.email,
          name: data.name,
        },
      });
      return { data: { userType: "parent", user: parent } };
    } else {
      const kindergarten = await db.kindergarten.create({
        data: {
          name: data.kindergartenName!,
          address: data.address!,
          messageAlertThreshold: new Date("1970-01-01T09:00:00"),
          callAlertThreshold: new Date("1970-01-01T10:00:00"),
          admins: {
            create: {
              firebaseId: userCredential.user.uid,
              email: data.email,
              name: data.name,
              role: "SUPER_ADMIN",
            },
          },
        },
        include: {
          admins: true,
        },
      });
      return { data: { userType: "kindergarten", user: kindergarten.admins[0] } };
    }
  } catch (error) {
    return { error: "Registration failed." };
  }
};

export const login = createSafeAction(LoginSchema, loginHandler);
export const register = createSafeAction(RegisterSchema, registerHandler); 