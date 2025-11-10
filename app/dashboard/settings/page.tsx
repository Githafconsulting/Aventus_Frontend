"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  CreditCard,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"profile" | "account" | "preferences" | "notifications">("profile");

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Settings
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-4`}
          >
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? "bg-[#FF6B00] text-white"
                        : theme === "dark"
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6`}
          >
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Profile Information
                </h2>

                {/* Profile Picture */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold text-3xl">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2 px-4 rounded-lg transition-all mb-2">
                        Upload Photo
                      </button>
                      <p className="text-gray-400 text-sm">
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          placeholder="City, Country"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center gap-2">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Account Security Section */}
            {activeSection === "account" && (
              <div>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Account Security
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"
                    }`}
                  >
                    <p className="text-sm text-gray-400">
                      Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                    </p>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Enable 2FA
                      </p>
                      <p className="text-sm text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center gap-2">
                    <Save size={18} />
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <div>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Preferences
                </h2>

                <div className="space-y-6">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Language
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <select
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Timezone
                    </label>
                    <select
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    >
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (London)</option>
                      <option>UTC+1 (Paris)</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Date Format
                    </label>
                    <select
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    >
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Currency
                    </label>
                    <div className="relative">
                      <CreditCard
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <select
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      >
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                        <option>GBP - British Pound</option>
                        <option>CAD - Canadian Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center gap-2">
                    <Save size={18} />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Notification Settings
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-800">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-400">
                        Receive email updates about your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-800">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Timesheet Reminders
                      </p>
                      <p className="text-sm text-gray-400">
                        Get reminded to submit your timesheets
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-800">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Expense Updates
                      </p>
                      <p className="text-sm text-gray-400">
                        Notifications when expenses are approved or rejected
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-800">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Document Updates
                      </p>
                      <p className="text-sm text-gray-400">
                        Alerts when new documents are available
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Marketing Emails
                      </p>
                      <p className="text-sm text-gray-400">
                        Receive updates about new features and tips
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center gap-2">
                    <Save size={18} />
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
