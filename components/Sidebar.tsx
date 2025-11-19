"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  Building2,
  Shield,
  UserCog,
  Bot,
  Briefcase,
  ClipboardList,
  Send,
} from "lucide-react";

// Super Admin menu items (Full System Control)
const superAdminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Admins",
    icon: UserCog,
    href: "/dashboard/admins",
  },
  {
    title: "Contractors",
    icon: Users,
    href: "/dashboard/contractors",
  },
  {
    title: "Clients",
    icon: Building,
    href: "/dashboard/clients",
  },
  {
    title: "Third Parties",
    icon: Building2,
    href: "/dashboard/third-parties",
  },
  {
    title: "Templates",
    icon: FileText,
    href: "/dashboard/templates",
  },
  {
    title: "Work Orders",
    icon: Briefcase,
    href: "/dashboard/work-orders",
  },
  {
    title: "Timesheets",
    icon: Clock,
    href: "/dashboard/timesheets",
  },
  {
    title: "Projects",
    icon: FileText,
    href: "/dashboard/projects",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/dashboard/reports",
  },
  {
    title: "AI Monitoring",
    icon: Bot,
    href: "/dashboard/ai-monitoring",
  },
  {
    title: "System Settings",
    icon: Shield,
    href: "/dashboard/system-settings",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

// Admin menu items (Aventus Admin)
const adminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Contractors",
    icon: Users,
    href: "/dashboard/contractors",
  },
  {
    title: "Clients",
    icon: Building,
    href: "/dashboard/clients",
  },
  {
    title: "Third Parties",
    icon: Building2,
    href: "/dashboard/third-parties",
  },
  {
    title: "Templates",
    icon: FileText,
    href: "/dashboard/templates",
  },
  {
    title: "Work Orders",
    icon: Briefcase,
    href: "/dashboard/work-orders",
  },
  {
    title: "Timesheets",
    icon: Clock,
    href: "/dashboard/timesheets",
  },
  {
    title: "Projects",
    icon: FileText,
    href: "/dashboard/projects",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/dashboard/reports",
  },
  {
    title: "AI Monitoring",
    icon: Bot,
    href: "/dashboard/ai-monitoring",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

// Client menu items - For client companies (timesheet approvers)
const clientMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "My Contractors",
    icon: Users,
    href: "/dashboard/contractors",
  },
  {
    title: "Pending Timesheets",
    icon: Clock,
    href: "/dashboard/pending-timesheets",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

// Contractor menu items
const contractorMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Timesheet",
    icon: Clock,
    href: "/dashboard/timesheet",
  },
  {
    title: "Expenses",
    icon: DollarSign,
    href: "/dashboard/expenses",
  },
  {
    title: "Documents",
    icon: FileText,
    href: "/dashboard/documents",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

// Consultant menu items
const consultantMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Contractors",
    icon: Users,
    href: "/dashboard/contractors",
  },
  {
    title: "Clients",
    icon: Building,
    href: "/dashboard/clients",
  },
  {
    title: "Third Parties",
    icon: Building2,
    href: "/dashboard/third-parties",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems =
    user?.role === "superadmin"
      ? superAdminMenuItems
      : user?.role === "admin"
      ? adminMenuItems
      : user?.role === "consultant"
      ? consultantMenuItems
      : user?.role === "client"
      ? clientMenuItems
      : contractorMenuItems;

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-center relative">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center justify-center">
            <Image
              src="/av-logo.png"
              alt="Aventus Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Image
              src="/av-logo.png"
              alt="Aventus Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
        )}
        {/* Decorative Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"></div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-[88px] -right-3 w-6 h-6 bg-[#FF6B00] rounded-full flex items-center justify-center text-white hover:bg-[#FF6B00]/90 transition-all shadow-lg z-10"
      >
        {isCollapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 btn-parallelogram transition-all ${
                    isActive
                      ? "bg-[#FF6B00] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  title={isCollapsed ? item.title : ""}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 relative">
        {/* Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"></div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 btn-parallelogram transition-all w-full text-gray-600 hover:text-white hover:bg-red-500"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
