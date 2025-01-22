import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-primary px-6 py-3 text-white hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
