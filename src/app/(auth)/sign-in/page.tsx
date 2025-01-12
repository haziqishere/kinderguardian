"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoginSchema } from "@/actions/auth/schema";
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

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"parent" | "kindergarten">("parent");

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Get user type and details from your database
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

      // Redirect based on user type
      if (userType === "parent") {
        router.push("/parent");
      } else {
        router.push(`/kindergarten/${kindergartenName}/dashboard`);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Choose your account type and sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="parent"
            className="w-full"
            onValueChange={(value) =>
              setUserType(value as "parent" | "kindergarten")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parent">Parent</TabsTrigger>
              <TabsTrigger value="kindergarten">Kindergarten</TabsTrigger>
            </TabsList>
            <TabsContent value="parent">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                  Sign In as Parent
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="kindergarten">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                  Sign In as Kindergarten
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
