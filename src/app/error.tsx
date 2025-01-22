"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="mt-4 text-lg">We apologize for the inconvenience.</p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-6 py-3 text-white hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md bg-secondary px-6 py-3 text-white hover:bg-secondary/90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
