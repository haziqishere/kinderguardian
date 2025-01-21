// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../lib/polyfills";
import "./globals.css";
import { siteConfig } from "@/app/config/site";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { SessionTimeoutDialog } from "@/components/session-timeout-dialog";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/app-asset/wolf-transparent.svg",
      href: "/app-asset/wolf-transparent.svg",
      type: "image/svg+xml",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          inter.className,
          "min-h-full text-sm md:text-base antialiased"
        )}
      >
        <Providers>
          <div className="min-h-full flex flex-col">
            <main className="flex-1 flex flex-col">
              <Toaster position="top-center" />
              {children}
            </main>
          </div>
        </Providers>
        <SessionTimeoutDialog />
      </body>
    </html>
  );
}
