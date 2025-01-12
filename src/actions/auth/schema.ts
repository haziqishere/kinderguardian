import { z } from "zod";

// Sign Up
export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  userType: z.enum(["parent", "kindergarten"]),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

// Login
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

// Common Types
export type UserType = "parent" | "kindergarten";

export type SignUpReturnType = {
  userType: UserType;
  kindergartenName?: string;
  email: string;
  name: string;
};

export type LoginReturnType = {
  userType: UserType;
  kindergartenName?: string;
}; 