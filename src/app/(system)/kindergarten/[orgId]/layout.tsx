import { Sidebar } from "./_components/sidebar";

export default function KindergartenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
