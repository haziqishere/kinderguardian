import { z } from "zod";

export type UserType = "parent" | "kindergarten";

// Sign Up
export const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.enum(["parent", "kindergarten"] as const)
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

// Login
export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

// Common Types


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