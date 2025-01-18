"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, UsersRound } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container max-w-5xl h-full py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to KinderGuardian
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose how you would like to get started
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                New Kindergarten
              </CardTitle>
              <CardDescription>
                Create and set up a new kindergarten from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-sm text-muted-foreground">
                Perfect for setting up a new kindergarten with your own
                configurations and preferences.
              </p>
              <Button
                onClick={() => router.push("/setup/new")}
                className="w-full"
              >
                Create New
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersRound className="h-5 w-5" />
                Join Existing
              </CardTitle>
              <CardDescription>
                Join an existing kindergarten as an administrator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-sm text-muted-foreground">
                For administrators joining an established kindergarten. You'll
                need the kindergarten's access code.
              </p>
              <Button
                onClick={() => router.push("/setup/join")}
                variant="outline"
                className="w-full"
              >
                Join Existing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
