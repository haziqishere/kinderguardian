// app/parent/children-list/add-child/_components/photo-upload.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Camera, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhotoUploadProps {
  type: string;
  title: string;
  value?: string;
  onChange: (value: string) => void;
}

const getPositionInstructions = (type: string) => {
  switch (type) {
    case "front":
      return "Look straight at the camera with a neutral expression";
    case "left":
      return "Turn your head 90 degrees to your left side";
    case "right":
      return "Turn your head 90 degrees to your right side";
    case "tiltUp":
      return "Tilt your head slightly upward while looking at camera";
    case "tiltDown":
      return "Tilt your head slightly downward while looking at camera";
    default:
      return "Position face within the outline and ensure good lighting";
  }
};

const Arrow = ({
  direction,
}: {
  direction: "left" | "right" | "up" | "down";
}) => {
  const getTransform = () => {
    switch (direction) {
      case "left":
        return "translate(24, 12) rotate(180)";
      case "right":
        return "translate(0, 12) rotate(0)";
      case "up":
        return "translate(12, 24) rotate(-90)";
      case "down":
        return "translate(12, 0) rotate(90)";
    }
  };

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform={getTransform()}>
        <line x1="0" y1="0" x2="14" y2="0" />
        <polyline points="7,-7 14,0 7,7" />
      </g>
    </svg>
  );
};

export const PhotoUpload = ({
  type,
  title,
  value,
  onChange,
}: PhotoUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const capturePhoto = () => {
    try {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          onChange(imageSrc);
          setIsCameraOpen(false);
          toast.success("Photo captured successfully");
        }
      }
    } catch (error) {
      console.error("Error capturing photo: ", error);
      toast.error("Failed to capture photo");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setIsLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error uploading photo");
      setIsLoading(false);
    }
  };

  const clearPhoto = () => {
    onChange("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-blue-500">{title}</h3>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-sm aspect-[3/4] bg-muted rounded-lg overflow-hidden">
          {value ? (
            <div className="relative w-full h-full">
              <Image
                src={value}
                alt={`${type} view`}
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearPhoto}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No photo taken</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-sm space-y-4">
          <FormItem>
            <FormLabel>Take or Upload Photo</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id={`photo-${type}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`photo-${type}`)?.click()
                    }
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Ensure good lighting</li>
                <li>Face should be clearly visible</li>
                <li>{getPositionInstructions(type)}</li>
                <li>Keep neutral expression</li>
              </ul>
            </FormDescription>
          </FormItem>
        </div>
      </div>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <span>Take photo - </span>
              <span className="text-blue-500">{title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />

            {/*TODO: Redesign Face Guidelines Overlay*/}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-white/50">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {/* Consistent circle guide for all angles */}
                  <div className="w-48 h-48 border-2 border-white/50 rounded-full" />

                  {/* Directional Arrows */}
                  {type === "left" && (
                    <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
                      <Arrow direction="left" />
                    </div>
                  )}
                  {type === "right" && (
                    <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                      <Arrow direction="right" />
                    </div>
                  )}
                  {type === "tiltUp" && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                      <Arrow direction="up" />
                    </div>
                  )}
                  {type === "tiltDown" && (
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                      <Arrow direction="down" />
                    </div>
                  )}

                  {/* Text Direction Guide */}
                  <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    {type === "left" && "Look Left"}
                    {type === "right" && "Look Right"}
                    {type === "tiltUp" && "Tilt Up"}
                    {type === "tiltDown" && "Tilt Down"}
                  </div>
                </div>
              </div>

              {/* Instructions Banner */}
              <div className="absolute top-4 left-4 right-4 text-white text-sm text-center bg-black/50 p-2 rounded">
                {getPositionInstructions(type)}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsCameraOpen(false)}
              className="bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={capturePhoto}
              className="bg-white text-black hover:bg-white/90"
            >
              Take Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
