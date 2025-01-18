"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BasicInfoForm } from "../_components/basic-info-form";
import { OperatingHoursForm } from "../_components/operating-hours-form";
import { AlertSettingsForm } from "../_components/alert-settings-form";
import { ArrowLeft } from "lucide-react";

import { completeSetup } from "@/actions/kindergarten/setup";
import { getCurrentUser } from "@/lib/firebase/auth";

const STEPS = [
  { id: "basic", title: "Basic Info", description: "Kindergarten details" },
  { id: "hours", title: "Operating Hours", description: "Set your schedule" },
  {
    id: "alerts",
    title: "Alert Settings",
    description: "Configure notifications",
  },
];

type FormData = {
  basic:
    | {
        name: string;
        address: string;
      }
    | undefined;
  hours?: {
    operatingHours: {
      dayOfWeek:
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY"
        | "SUNDAY";
      isOpen: boolean;
      startTime: string;
      endTime: string;
    }[];
  };
  alerts:
    | {
        messageAlertThreshold: string;
        callAlertThreshold: string;
      }
    | undefined;
};

export default function NewSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    basic: undefined,
    hours: undefined,
    alerts: undefined,
  });
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | undefined>();

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleSetupComplete = async (completeFormData: FormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log("Starting setup completion with adminId:", adminId);

      if (!adminId) {
        toast.error("Admin ID not found. Please sign in again.");
        return;
      }

      if (
        !completeFormData.basic ||
        !completeFormData.hours ||
        !completeFormData.alerts
      ) {
        toast.error("Please complete all setup steps before proceeding.");
        return;
      }

      const operatingHours = completeFormData.hours.operatingHours
        .filter((oh) => oh.isOpen)
        .map((oh) => ({
          dayOfWeek: oh.dayOfWeek,
          isOpen: true,
          startTime: oh.startTime,
          endTime: oh.endTime,
        }));

      if (operatingHours.length === 0) {
        toast.error("Please select at least one operating day.");
        return;
      }

      const setupData = {
        name: completeFormData.basic.name,
        address: completeFormData.basic.address,
        operatingHours,
        messageAlertThreshold: completeFormData.alerts.messageAlertThreshold,
        callAlertThreshold: completeFormData.alerts.callAlertThreshold,
        adminId,
      };

      const result = await completeSetup(setupData);

      if (result.error) {
        if (result.error.includes("already exists")) {
          setFormError(
            "A kindergarten with this name already exists. Please choose a different name."
          );
          toast.error(
            "A kindergarten with this name already exists. Please choose a different name.",
            {
              duration: 5000,
            }
          );
          // Go back to the first step to change the name
          setCurrentStep(0);
          return;
        }
        toast.error(result.error);
        return;
      }

      if (!result.data) {
        toast.error("Setup failed. Please try again.");
        return;
      }

      toast.success(
        "Setup completed successfully! Redirecting to dashboard..."
      );
      router.push(`/kindergarten/${result.data.id}/dashboard`);
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepComplete = (stepId: string, data: any) => {
    setFormError(undefined); //Clear any previous errors
    setFormData((prev) => {
      const updated = {
        ...prev,
        [stepId]: data,
      };

      // If this is the last step, trigger setup completion with the complete form data
      if (stepId === "alerts") {
        // Use setTimeout to avoid state updates during render
        setTimeout(() => {
          handleSetupComplete(updated);
        }, 0);
      }

      return updated;
    });

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await fetch("/api/auth/user-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseId: await getCurrentUser(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin ID");
        }

        const data = await response.json();
        if (data.userId) {
          setAdminId(data.userId);
        }
      } catch (error) {
        console.error("Error fetching admin ID", error);
        toast.error("Failed to fetch admin ID");
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminId();
  }, [router]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-20 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Loading...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we prepare your setup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State Check
  if (!adminId) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-20 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-destructive">
                Setup Error
              </h3>
              <p className="text-sm text-muted-foreground">
                Unable to start setup process. Please try signing in again.
              </p>
              <Button onClick={() => router.push("/sign-in")}>
                Return to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="w-full max-w-3xl py-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="mb-4 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {STEPS[currentStep].title}
            </h1>
            <p className="text-muted-foreground">
              {STEPS[currentStep].description}
            </p>
          </div>

          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            {STEPS.map((step, index) => (
              <span
                key={step.id}
                className={currentStep >= index ? "text-primary" : ""}
              >
                Step {index + 1}
              </span>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs value={STEPS[currentStep].id}>
              <TabsContent value="basic" className="m-0">
                <BasicInfoForm
                  onSubmit={(data) => handleStepComplete("basic", data)}
                  defaultValues={formData.basic}
                  isSubmitting={isSubmitting}
                  error={formError}
                />
              </TabsContent>
              <TabsContent value="hours" className="m-0">
                <OperatingHoursForm
                  onSubmit={(data) => handleStepComplete("hours", data)}
                  defaultValues={formData.hours}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="alerts" className="m-0">
                <AlertSettingsForm
                  onSubmit={(data) => handleStepComplete("alerts", data)}
                  defaultValues={formData.alerts}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
