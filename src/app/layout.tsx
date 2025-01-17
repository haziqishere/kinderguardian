// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../lib/polyfills";
import "./globals.css";
import { siteConfig } from "@/app/config/site";
import Providers from "./providers";

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
