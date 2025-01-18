import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpSchemaType } from "@/actions/auth/schema";

export function useSignUpForm() {
  return useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      userType: "parent",
    },
  });
} 