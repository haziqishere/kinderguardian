"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { createStudent } from "@/actions/student";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AddChildSchemaType,
  basicInfoSchema,
  AddChildSchema,
} from "@/actions/student/schema";

import { Card, CardContent } from "@/components/ui/card";

import { BasicInfoForm } from "./_components/basic-info-form";
import { PhotoUpload } from "./_components/photo-upload";
import { ConsentForm } from "./_components/consent-form";
import { ProgressBar } from "./_components/progress-bar";
import { FormButtons } from "./_components/form-button";

const STEPS = {
  BASIC_INFO: 0,
  FRONT_PHOTO: 1,
  LEFT_PHOTO: 2,
  RIGHT_PHOTO: 3,
  TOP_PHOTO: 4,
  BOTTOM_PHOTO: 5,
  CONSENT: 6,
} as const;

const PHOTO_CONFIGS = {
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
} as const;

type StepKeys = keyof typeof STEPS;
type StepValues = (typeof STEPS)[StepKeys];

export default function AddChildPage() {
  const router = useRouter();
  const [step, setStep] = useState<StepValues>(STEPS.BASIC_INFO);
  const [photos, setPhotos] = useState({
    front: "",
    left: "",
    right: "",
    tiltUp: "",
    tiltDown: "",
  });

  const form = useForm<AddChildSchemaType>({
    resolver: zodResolver(
      step === STEPS.CONSENT ? AddChildSchema : basicInfoSchema
    ),
    defaultValues: {
      fullName: "",
      age: 0,
      classId: "",
      phoneNumbers: [""],
      consent: false,
      dataPermission: false,
    },
  });

  const { execute } = useAction(createStudent, {
    onSuccess: () => {
      toast.success("Child added successfully!");
      router.push("/parent/children-list");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    if (
      step === STEPS.CONSENT &&
      Object.values(photos).some((photo) => photo)
    ) {
      const currentValues = form.getValues();
      form.reset({
        ...currentValues,
        ...photos,
      });
    }
  }, [step]);

  const nextStep = async () => {
    try {
      if (step === STEPS.BASIC_INFO) {
        const isValid = await form.trigger([
          "fullName",
          "age",
          "classId",
          "phoneNumbers",
        ]);
        if (!isValid) return;
      }
      setStep((prev) => (prev + 1) as StepValues);
    } catch (error) {
      toast.error("Please check all required fields");
    }
  };

  const prevStep = () => {
    setStep((prev) => (prev - 1) as StepValues);
  };

  const onSubmit = async (data: AddChildSchemaType) => {
    const formData = {
      ...data,
      ...photos,
    };
    execute(formData);
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
        return (
          <PhotoUpload
            type={Object.keys(photos)[step - 1] as keyof typeof photos}
            value={photos[Object.keys(photos)[step - 1] as keyof typeof photos]}
            title={config.title}
            onChange={(value) =>
              setPhotos((prev) => ({
                ...prev,
                [config.type]: value,
              }))
            }
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
    </div>
  );
}
