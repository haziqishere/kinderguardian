// parent/children-list/add-child/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { BasicInfoForm } from "./_components/basic-info-form";
import { PhotoUpload } from "./_components/photo-upload";
import { ConsentForm } from "./_components/consent-form";
import { ProgressBar } from "./_components/progress-bar";
import { FormButtons } from "./_components/form-button";
import { LoadingDialog } from "./_components/loading-dialog";
import { StudentSchema, StudentSchemaType } from "@/actions/student/schema";
import { getCurrentUser } from "@/lib/firebase/auth";

const STEPS = {
  BASIC_INFO: 0,
  FRONT_PHOTO: 1,
  LEFT_PHOTO: 2,
  RIGHT_PHOTO: 3,
  TOP_PHOTO: 4,
  BOTTOM_PHOTO: 5,
  CONSENT: 6,
} as const;

type PhotoType = "front" | "left" | "right" | "tiltUp" | "tiltDown";

interface PhotoConfig {
  type: PhotoType;
  title: string;
  instruction: string;
}

const PHOTO_CONFIGS: Record<number, PhotoConfig> = {
  [STEPS.FRONT_PHOTO]: {
    type: "front",
    title: "Front View Photo",
    instruction: "Look straight at the camera with a neutral expression",
  },
  [STEPS.LEFT_PHOTO]: {
    type: "left",
    title: "Left Side Photo",
    instruction: "Turn your head 90 degrees to your left side",
  },
  [STEPS.RIGHT_PHOTO]: {
    type: "right",
    title: "Right Side Photo",
    instruction: "Turn your head 90 degrees to your right side",
  },
  [STEPS.TOP_PHOTO]: {
    type: "tiltUp",
    title: "Face Tilted Up Photo",
    instruction: "Tilt your head slightly upward while looking at camera",
  },
  [STEPS.BOTTOM_PHOTO]: {
    type: "tiltDown",
    title: "Face Tilted Down Photo",
    instruction: "Tilt your head slightly downward while looking at camera",
  },
};

type StepKeys = keyof typeof STEPS;
type StepValues = (typeof STEPS)[StepKeys];

// Helper to validate image data
const validateImageData = (
  imageData: string
): { isValid: boolean; error?: string } => {
  if (!imageData) {
    return { isValid: false, error: "No image data provided" };
  }

  if (!imageData.startsWith("data:image/")) {
    return { isValid: false, error: "Invalid image format" };
  }

  const [header, base64Data] = imageData.split(",");
  if (!header || !base64Data) {
    return { isValid: false, error: "Invalid image data" };
  }

  // Check if it's a supported image type
  const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
  const imageType = header.split(":")[1].split(";")[0];
  if (!supportedTypes.includes(imageType)) {
    return {
      isValid: false,
      error: "Unsupported image format. Please use JPEG, PNG, or WebP",
    };
  }

  // Check file size (max 5MB)
  const sizeInBytes = (base64Data.length * 3) / 4;
  if (sizeInBytes > 5 * 1024 * 1024) {
    return {
      isValid: false,
      error: "Image size too large. Maximum size is 5MB",
    };
  }

  return { isValid: true };
};

export default function AddChildPage() {
  const router = useRouter();
  const [step, setStep] = useState<StepValues>(STEPS.BASIC_INFO);
  const [isLoadingParent, setIsLoadingParent] = useState(true);
  const [photos, setPhotos] = useState<Record<PhotoType, string>>({
    front: "",
    left: "",
    right: "",
    tiltUp: "",
    tiltDown: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentSchemaType>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: new Date(),
      kindergartenId: "",
      classId: "",
      parentId: "",
      phoneNumbers: [""],
      faceImages: {
        front: "",
        left: "",
        right: "",
        tiltUp: "",
        tiltDown: "",
      },
      consent: false,
      dataPermission: false,
    },
  });

  //Fetch parent id from auth
  useEffect(() => {
    const fetchParentId = async () => {
      try {
        const firebaseId = await getCurrentUser();

        // Fetch parent ID from database
        const response = await fetch("/api/parent/get-id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firebaseId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch parent ID");
        }

        const data = await response.json();
        form.setValue("parentId", data.parentId);
        setIsLoadingParent(false);
      } catch (error) {
        console.error("Error fetching parent ID", error);
        toast.error("Error loading parent information");
        router.push("/parent/children-list"); //Redirect on error
      }
    };
    fetchParentId();
  }),
    [form, router];

  //Don't render form until parent ID is loaded
  if (isLoadingParent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingDialog open={true} />
        </div>
      </div>
    );
  }

  const validatePhoto = (photoData: string, type: PhotoType) => {
    const validation = validateImageData(photoData);
    if (!validation.isValid) {
      toast.error(`${type} photo: ${validation.error}`);
      return false;
    }
    return true;
  };

  const nextStep = async () => {
    try {
      if (step === STEPS.BASIC_INFO) {
        const isValid = await form.trigger([
          "fullName",
          "dateOfBirth",
          "classId",
          "phoneNumbers",
        ]);
        if (!isValid) {
          console.log("Form validation failed:", form.formState.errors);
          return;
        }
      }

      // Validate current photo before proceeding
      if (step >= STEPS.FRONT_PHOTO && step <= STEPS.BOTTOM_PHOTO) {
        const config = PHOTO_CONFIGS[step];
        if (!config) return;

        const currentPhoto = photos[config.type];
        if (!currentPhoto) {
          toast.error("Please upload a photo before proceeding");
          return;
        }

        if (!validatePhoto(currentPhoto, config.type)) {
          return;
        }
      }

      // Before moving to consent, ensure all photos are uploaded and valid
      if (step === STEPS.BOTTOM_PHOTO) {
        const hasAllPhotos = Object.entries(photos).every(([type, photo]) => {
          if (!photo) {
            toast.error(`Missing ${type} photo`);
            return false;
          }
          return validatePhoto(photo, type as PhotoType);
        });

        if (!hasAllPhotos) {
          return;
        }

        // Set the photos in form data before moving to consent
        form.setValue("faceImages", photos);
      }

      setStep((prev) => (prev + 1) as StepValues);
    } catch (error) {
      console.error("Step validation error:", error);
      toast.error("Please check all required fields");
    }
  };

  const prevStep = () => {
    setStep((prev) => (prev - 1) as StepValues);
  };

  const onSubmit = async (data: StudentSchemaType) => {
    try {
      // Final validation of all photos
      const hasAllValidPhotos = Object.entries(data.faceImages).every(
        ([type, photo]) => {
          if (!photo) {
            toast.error(`Missing ${type} photo`);
            return false;
          }
          return validatePhoto(photo, type as PhotoType);
        }
      );

      if (!hasAllValidPhotos) {
        return;
      }

      setIsSubmitting(true);
      toast.loading("Creating student record...");

      const result = await fetch("/api/parent/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          dateOfBirth: data.dateOfBirth.toISOString(),
        }),
      });

      const response = await result.json();

      if (!result.ok) {
        throw new Error(response.error || "Failed to add child");
      }

      toast.dismiss();
      toast.success("Child added successfully!");
      router.push("/parent/children-list");
    } catch (error) {
      toast.dismiss();
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add child"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case STEPS.BASIC_INFO:
        return <BasicInfoForm form={form} />;
      case STEPS.FRONT_PHOTO:
      case STEPS.LEFT_PHOTO:
      case STEPS.RIGHT_PHOTO:
      case STEPS.TOP_PHOTO:
      case STEPS.BOTTOM_PHOTO:
        const config = PHOTO_CONFIGS[step];
        if (!config) return null;

        return (
          <PhotoUpload
            type={config.type}
            title={config.title}
            value={photos[config.type]}
            onChange={(value) => {
              if (value && !validatePhoto(value, config.type)) {
                return;
              }
              setPhotos((prev) => ({
                ...prev,
                [config.type]: value,
              }));
            }}
          />
        );
      case STEPS.CONSENT:
        return <ConsentForm form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add Children Form</h2>
      <ProgressBar currentStep={step} totalSteps={Object.keys(STEPS).length} />
      <Card>
        <CardContent>
          <div className="pt-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {renderCurrentStep()}
                <FormButtons
                  currentStep={step}
                  totalSteps={Object.keys(STEPS).length}
                  onPrevious={prevStep}
                  onNext={nextStep}
                  isLastStep={step === STEPS.CONSENT}
                />
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      <LoadingDialog open={isSubmitting} />
    </div>
  );
}
