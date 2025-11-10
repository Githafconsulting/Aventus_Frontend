"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings, User, LogOut, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: number;
  type: "success" | "info" | "warning";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: 1,
    type: "success",
    title: "Timesheet Approved",
    message: "Your October timesheet has been approved",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Document Available",
    message: "Your salary certificate is ready for download",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Timesheet Reminder",
    message: "Don't forget to submit your timesheet by end of month",
    time: "1 day ago",
    read: true,
  },
];

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleName = () => {
    if (user?.role === "superadmin") return "Super Admin";
    if (user?.role === "admin") return "Admin";
    if (user?.role === "consultant") return "Consultant";
    if (user?.role === "manager") return "Manager";
    if (user?.role === "contractor") return "Contractor";
    return "User";
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "warning":
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Bell className="text-blue-500" size={20} />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {getRoleName()} Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {user?.name || "User"}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Status Badge for Contractors */}
          {user?.role === "contractor" && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">
              ● Active
            </span>
          )}

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#FF6B00] rounded-full text-white text-xs flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#FF6B00] hover:text-[#FF6B00]/80"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-[#FF6B00] rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {notifications.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-gray-400 text-xs">{user?.email || ""}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email || ""}</p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role || "User"}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      router.push("/dashboard/settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/dashboard/settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <User size={18} />
                    <span className="text-sm">Profile</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
