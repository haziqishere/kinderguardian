"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white p-4 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function MPIflow({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);
  const rdsRef = useRef<HTMLDivElement>(null);
  const snowflakeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border p-10 md:shadow-xl",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-lg">
        <div className="flex flex-col justify-center">
          <Circle ref={userRef}>
            <Icons.user />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={cameraRef}>
            <Image src="/camera.svg" alt="Camera" width={32} height={32} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={systemRef}>
            <Image
              src="/app-asset/wolf-transparent.svg"
              alt="Wolf Logo"
              width={32}
              height={32}
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <Circle ref={s3Ref} className="size-20">
            <Image src="/s3.svg" alt="AWS S3" width={40} height={40} />
          </Circle>
          <Circle ref={rdsRef} className="size-20">
            <Image src="/RDS.svg" alt="AWS RDS" width={40} height={40} />
          </Circle>
          <Circle ref={snowflakeRef} className="size-20">
            <Image
              src="/snowflake.svg"
              alt="Snowflake"
              width={40}
              height={40}
            />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={userRef}
        toRef={cameraRef}
        duration={1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={cameraRef}
        toRef={systemRef}
        duration={1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={systemRef}
        toRef={s3Ref}
        duration={1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={systemRef}
        toRef={rdsRef}
        duration={1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={systemRef}
        toRef={snowflakeRef}
        duration={1}
      />
    </div>
  );
}

const Icons = {
  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
