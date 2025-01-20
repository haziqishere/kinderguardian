"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "@/actions/auth/schema";
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
import { sendResetPasswordEmail } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsResetting(true);
      await sendResetPasswordEmail(resetEmail);
      toast.success("Password reset email sent! Check your inbox");
      setShowResetDialog(false);
      setResetEmail("");
    } catch (error) {
      toast.error("Failed to send reset email");
    } finally {
      setIsResetting(false);
    }
  };

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setIsLoading(true);
      const result = await login(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Signed in successfully!");

      // Handle redirection based on user type and setup status
      if (result.data?.userType === "parent") {
        router.push("/parent");
      } else if (result.data?.userType === "kindergarten") {
        if (result.data.needsSetup) {
          router.push("/setup");
        } else {
          router.push(
            `/kindergarten/${result.data.data.kindergartenId}/dashboard`
          );
        }
      }
    } catch (error) {
      toast.error("Failed to sign in");
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

            <div className="flex flex-col items-center gap-3 justify-between text-sm">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => router.push("/sign-up")}
              >
                Don&apos;t have an account? Sign up
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setShowResetDialog(true)}
              >
                Forgot password?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <Input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResetDialog(false);
                  setResetEmail("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={isResetting || !resetEmail}
              >
                {isResetting ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
