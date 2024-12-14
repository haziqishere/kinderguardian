// src/app/(dashboard)/parent/layout.tsx
import  ParentDashboardLayout from "./_components/parent-dashboard-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ParentDashboardLayout>{children}</ParentDashboardLayout>;
}