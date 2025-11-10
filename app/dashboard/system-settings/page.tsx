"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Database,
  Shield,
  Mail,
  Globe,
  Save,
  Download,
  Upload,
  CheckCircle,
} from "lucide-react";

export default function SystemSettingsPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"general" | "security" | "email" | "backup">("general");

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          System Settings
        </h1>
        <p className="text-gray-400 mt-2">
          Configure system-wide settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div
        className={`border-b ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        } mb-6`}
      >
        <div className="flex gap-6 overflow-x-auto">
          {[
            { id: "general", label: "General", icon: Globe },
            { id: "security", label: "Security", icon: Shield },
            { id: "email", label: "Email", icon: Mail },
            { id: "backup", label: "Backup", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-purple-500 border-b-2 border-purple-500"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6`}
          >
            <h3
              className={`text-lg font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              General Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  defaultValue="Aventus HR System"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue="Aventus Technologies"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Time Zone
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option>UTC (GMT+0:00)</option>
                  <option selected>Eastern Time (GMT-5:00)</option>
                  <option>Pacific Time (GMT-8:00)</option>
                  <option>Central European Time (GMT+1:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Date Format
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Currency
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Reset
            </button>
            <button className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6`}
          >
            <h3
              className={`text-lg font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Security Settings
            </h3>
            <div className="space-y-6">
              {/* Password Policy */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-4">
                  Password Policy
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Require minimum 8 characters
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Require at least one uppercase letter
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Require at least one number
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Require special characters
                    </span>
                  </label>
                </div>
              </div>

              {/* Session Management */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-4">
                  Session Management
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Force logout on password change
                    </span>
                  </label>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-4">
                  Two-Factor Authentication
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Require 2FA for all admins
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Enable SMS authentication
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      Enable email authentication
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Reset
            </button>
            <button className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === "email" && (
        <div className="space-y-6">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6`}
          >
            <h3
              className={`text-lg font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Email Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  SMTP Server
                </label>
                <input
                  type="text"
                  placeholder="smtp.example.com"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    defaultValue="587"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Encryption
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  >
                    <option>TLS</option>
                    <option>SSL</option>
                    <option>None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="noreply@aventus.com"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  defaultValue="Aventus HR System"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all text-sm">
                  Send Test Email
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Reset
            </button>
            <button className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Backup Tab */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          {/* Automatic Backups */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6`}
          >
            <h3
              className={`text-lg font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Automatic Backups
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-400">
                  Enable automatic backups
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Backup Frequency
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option>Every 6 hours</option>
                  <option selected>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>
            </div>
          </div>

          {/* Manual Backup */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6`}
          >
            <h3
              className={`text-lg font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Manual Backup
            </h3>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all flex items-center gap-2">
                <Download size={18} />
                Create Backup Now
              </button>
              <button className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-all flex items-center gap-2">
                <Upload size={18} />
                Restore from Backup
              </button>
            </div>
          </div>

          {/* Recent Backups */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6`}
          >
            <h3
              className={`text-lg font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Recent Backups
            </h3>
            <div className="space-y-3">
              {[
                { date: "2024-12-15 02:00 AM", size: "24.5 GB", status: "success" },
                { date: "2024-12-14 02:00 AM", size: "24.3 GB", status: "success" },
                { date: "2024-12-13 02:00 AM", size: "24.1 GB", status: "success" },
              ].map((backup, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {backup.date}
                      </p>
                      <p className="text-sm text-gray-400">{backup.size}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all text-sm">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
