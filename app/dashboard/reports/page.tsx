"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Clock,
  BarChart3,
} from "lucide-react";

// Sample report types
const reportTypes = [
  {
    id: 1,
    title: "Employee Summary Report",
    description: "Complete overview of all employees including personal and employment details",
    icon: Users,
    color: "blue",
    lastGenerated: "2024-12-10",
  },
  {
    id: 2,
    title: "Attendance Report",
    description: "Detailed attendance records with present, absent, and late statistics",
    icon: Clock,
    color: "green",
    lastGenerated: "2024-12-14",
  },
  {
    id: 3,
    title: "Leave Report",
    description: "Analysis of leave requests, approvals, and remaining leave balances",
    icon: Calendar,
    color: "yellow",
    lastGenerated: "2024-12-12",
  },
  {
    id: 4,
    title: "Payroll Report",
    description: "Comprehensive payroll breakdown with salaries, deductions, and net pay",
    icon: DollarSign,
    color: "purple",
    lastGenerated: "2024-12-01",
  },
  {
    id: 5,
    title: "Department Analytics",
    description: "Department-wise employee distribution and performance metrics",
    icon: BarChart3,
    color: "orange",
    lastGenerated: "2024-12-08",
  },
  {
    id: 6,
    title: "Performance Report",
    description: "Employee performance reviews and ratings across all departments",
    icon: TrendingUp,
    color: "red",
    lastGenerated: "2024-11-30",
  },
];

// Recent reports history
const recentReports = [
  {
    id: 1,
    name: "Attendance Report - November 2024",
    type: "Attendance",
    generatedBy: "Admin User",
    generatedDate: "2024-12-14",
    format: "PDF",
  },
  {
    id: 2,
    name: "Payroll Report - November 2024",
    type: "Payroll",
    generatedBy: "Admin User",
    generatedDate: "2024-12-01",
    format: "Excel",
  },
  {
    id: 3,
    name: "Employee Summary - Q4 2024",
    type: "Employee",
    generatedBy: "Admin User",
    generatedDate: "2024-12-10",
    format: "PDF",
  },
  {
    id: 4,
    name: "Leave Report - December 2024",
    type: "Leave",
    generatedBy: "HR Manager",
    generatedDate: "2024-12-12",
    format: "Excel",
  },
];

export default function ReportsPage() {
  const { theme } = useTheme();
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    start: "2024-12-01",
    end: "2024-12-31",
  });
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: "bg-blue-500/10 text-blue-500",
      green: "bg-green-500/10 text-green-500",
      yellow: "bg-yellow-500/10 text-yellow-500",
      purple: "bg-purple-500/10 text-purple-500",
      orange: "bg-[#FF6B00]/10 text-[#FF6B00]",
      red: "bg-red-500/10 text-red-500",
    };
    return colors[color] || "bg-gray-500/10 text-gray-500";
  };

  const handleGenerateReport = () => {
    console.log("Generating report:", {
      reportId: selectedReport,
      dateRange,
      format: selectedFormat,
    });
    // Handle report generation
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Reports & Analytics
        </h1>
        <p className="text-gray-400 mt-2">
          Generate comprehensive reports for HR management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Reports */}
        <div className="lg:col-span-2">
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Available Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`${
                    theme === "dark" ? "bg-gray-900" : "bg-white"
                  } rounded-lg p-6 shadow-sm cursor-pointer transition-all ${
                    selectedReport === report.id
                      ? "ring-2 ring-[#FF6B00]"
                      : theme === "dark"
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 ${getColorClasses(
                        report.color
                      )} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold mb-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {report.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {report.description}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Last generated:{" "}
                        {new Date(report.lastGenerated).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Configuration */}
        <div>
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Generate Report
          </h2>
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm`}
          >
            {selectedReport ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Selected Report
                  </label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {reportTypes.find((r) => r.id === selectedReport)?.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateReport}
                  className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Generate Report
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-400">
                  Select a report type to generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="mt-8">
        <h2
          className={`text-xl font-semibold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Recent Reports
        </h2>
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg shadow-sm overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                } border-b ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Report Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Generated By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Format
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr
                    key={report.id}
                    className={`border-b ${
                      theme === "dark" ? "border-gray-800" : "border-gray-200"
                    } ${
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-50"
                    } transition-all`}
                  >
                    <td className="px-6 py-4">
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {report.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FF6B00]/10 text-[#FF6B00]">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">
                        {report.generatedBy}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">
                        {new Date(report.generatedDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">{report.format}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        }`}
                        title="Download Report"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
