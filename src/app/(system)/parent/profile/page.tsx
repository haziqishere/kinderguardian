"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, User, Phone, Calendar } from "lucide-react";
import { getCurrentUser } from "@/lib/firebase/auth";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNum: string;
  age: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: userProfile, isLoading } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const firebaseId = await getCurrentUser();
      const response = await fetch("/api/parent/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return await response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">
          Profile
        </h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{userProfile?.name || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium break-all">
                  {userProfile?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{userProfile?.phoneNum || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{userProfile?.age || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
