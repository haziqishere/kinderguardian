// src/app/kindergarten/_components/sidebar.tsx
"use client";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  Bell,
  Users,
  CalendarDays,
  FileText,
  User,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const params = useParams();
  const pathname = usePathname();
  const orgId = params.orgId;

  const routes = [
    {
      label: "MAIN",
      routes: [
        {
          label: "Dashboard",
          icon: <LayoutDashboard className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/dashboard`,
        },
        {
          label: "Alert List",
          icon: <Bell className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/alert-list`,
        },
        {
          label: "Student List",
          icon: <Users className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/student-list`,
        },
        {
          label: "Events",
          icon: <CalendarDays className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/events`,
        },
        {
          label: "Reports",
          icon: <FileText className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/reports`,
        },
        {
          label: "Classes", // Add this new route
          icon: <GraduationCap className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/classes`,
        },
      ],
    },
    {
      label: "USER",
      routes: [
        {
          label: "Profile",
          icon: <User className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/profile`,
        },
        {
          label: "Settings",
          icon: <Settings className="w-5 h-5" />,
          href: `/kindergarten/${orgId}/settings`,
        },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white p-6 space-y-8 min-h-screen border-r">
      <div className="flex items-center space-x-4 mb-8">
        <Logo />
      </div>

      <div className="space-y-6">
        {routes.map((section) => (
          <div key={section.label} className="space-y-2">
            <div className="text-sm text-gray-500">{section.label}</div>
            <nav className="space-y-2">
              {section.routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center space-x-3 w-full p-2 rounded transition-colors",
                    pathname === route.href
                      ? "bg-gray-100 text-blue-600"
                      : "hover:bg-gray-100"
                  )}
                >
                  {route.icon}
                  <span>{route.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        ))}

        {/* Logout Button */}
        <div className="pt-6">
          <button className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100 text-red-500">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
