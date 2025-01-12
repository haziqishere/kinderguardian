"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/actions/auth/schema";
import { signUp } from "@/actions/auth/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"parent" | "kindergarten">("parent");

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      userType: "parent" as const,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Check if user already exists
      const checkResponse = await fetch("/api/auth/user-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (checkResponse.ok) {
        toast.error("User already exists. Please sign in instead.");
        router.push("/sign-in");
        return;
      }

      // Proceed with registration
      const result = await signUp({
        ...data,
        userType,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Registration successful!");
      router.push("/sign-in");
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
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Choose your account type and sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="parent"
            className="w-full"
            onValueChange={(value) => {
              setUserType(value as "parent" | "kindergarten");
              form.reset();
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parent">Parent</TabsTrigger>
              <TabsTrigger value="kindergarten">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="parent">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Input {...form.register("name")} placeholder="Full Name" />
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
                  Sign Up as Parent
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="kindergarten">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Input {...form.register("name")} placeholder="Admin Name" />
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
                  Sign Up as Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => router.push("/sign-in")}
              >
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
