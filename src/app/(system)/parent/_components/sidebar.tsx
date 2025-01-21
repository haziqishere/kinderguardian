"use client";
import { Logo } from "@/components/logo";
import {
  Home,
  GraduationCap,
  FileText,
  Users,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth/login";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.data?.success) {
        toast.success("Logged out successfully");
        router.push("/sign-in");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const routes = [
    {
      label: "MAIN",
      routes: [
        {
          label: "Dashboard",
          icon: <Home className="w-5 h-5" />,
          href: "/parent",
        },
        {
          label: "Child List",
          icon: <GraduationCap className="w-5 h-5" />,
          href: "/parent/children-list",
        },
      ],
    },
    {
      label: "USER",
      routes: [
        {
          label: "Profile",
          icon: <User className="w-5 h-5" />,
          href: "/parent/profile",
        },
        {
          label: "Settings",
          icon: <Settings className="w-5 h-5" />,
          href: "/parent/settings",
        },
      ],
    },
  ];

  const sidebarContent = (
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
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100 text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-64 bg-white p-6 space-y-8 min-h-screen">
            <div className="flex items-center space-x-4 mb-8">
              <Logo />
            </div>
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-64 bg-white p-6 space-y-8 min-h-screen border-r">
      <div className="flex items-center space-x-4 mb-8">
        <Logo />
      </div>
      {sidebarContent}
    </div>
  );
};
