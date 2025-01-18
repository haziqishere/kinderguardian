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
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth/login";
import { toast } from "sonner";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

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
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100 text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
