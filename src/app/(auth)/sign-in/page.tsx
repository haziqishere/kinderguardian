"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/actions/auth/schema";
import { login } from "@/actions/auth/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      const result = await login(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Signed in successfully!");

      // Redirect based on user type
      if (result.data?.userType === "parent") {
        router.push("/parent/children-list");
      } else if (
        result.data?.userType === "kindergarten" &&
        result.data?.kindergartenName
      ) {
        router.push(`/kindergarten/${result.data.kindergartenName}/dashboard`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...form.register("email")}
              placeholder="Email"
              type="email"
            />
            <Input
              {...form.register("password")}
              placeholder="Password"
              type="password"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Sign In
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => router.push("/sign-up")}
              >
                Don&apos;t have an account? Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
