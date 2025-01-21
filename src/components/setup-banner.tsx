// components/setup-banner.tsx
"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SetupBannerProps {
  kindergartenId?: string | null;
}

export function SetupBanner({ kindergartenId }: SetupBannerProps) {
  const router = useRouter();

  if (kindergartenId) return null;

  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Complete Your Setup</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          You need to complete your kindergarten setup to access all features.
        </span>
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push("/setup")}
        >
          Complete Setup
        </Button>
      </AlertDescription>
    </Alert>
  );
}
