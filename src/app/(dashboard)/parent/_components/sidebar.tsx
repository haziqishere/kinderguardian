"use client";
import { Logo } from "@/components/logo";
import {
  Home,
  GraduationCap,
  FileText,
  Users,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white p-6 space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <Logo />
      </div>

      <div className="space-y-6">
        {/* MAIN Navigation */}
        <div className="space-y-2">
          <div className="text-sm text-gray-500">MAIN</div>
          <nav className="space-y-2">
            <Link
              href="/parent"
              className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/parent/children-list"
              className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Child List</span>
            </Link>
            {/* Add other navigation items */}
          </nav>
        </div>

        {/* USER Navigation */}
        <div className="space-y-2">
          <div className="text-sm text-gray-500">USER</div>
          <nav className="space-y-2">
            <Link
              href="/parent/profile"
              className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            {/* Add other user navigation items */}
          </nav>
        </div>
      </div>
    </div>
  );
};
