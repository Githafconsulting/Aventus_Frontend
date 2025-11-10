"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Download,
  Eye,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

// Sample payroll data
const payrollData = [
  {
    id: 1,
    employeeName: "Sarah Johnson",
    employeeId: "EMP-001",
    department: "Engineering",
    basicSalary: 10000,
    allowances: 2000,
    deductions: 1200,
    netSalary: 10800,
    payPeriod: "December 2024",
    payDate: "2024-12-31",
    status: "processed",
  },
  {
    id: 2,
    employeeName: "Michael Chen",
    employeeId: "EMP-002",
    department: "Marketing",
    basicSalary: 8500,
    allowances: 1500,
    deductions: 1000,
    netSalary: 9000,
    payPeriod: "December 2024",
    payDate: "2024-12-31",
    status: "processed",
  },
  {
    id: 3,
    employeeName: "Emily Davis",
    employeeId: "EMP-003",
    department: "Sales",
    basicSalary: 9000,
    allowances: 2500,
    deductions: 1150,
    netSalary: 10350,
    payPeriod: "December 2024",
    payDate: "2024-12-31",
    status: "pending",
  },
  {
    id: 4,
    employeeName: "James Wilson",
    employeeId: "EMP-004",
    department: "HR",
    basicSalary: 7500,
    allowances: 1000,
    deductions: 850,
    netSalary: 7650,
    payPeriod: "December 2024",
    payDate: "2024-12-31",
    status: "pending",
  },
  {
    id: 5,
    employeeName: "Lisa Anderson",
    employeeId: "EMP-005",
    department: "Finance",
    basicSalary: 9500,
    allowances: 1800,
    deductions: 1130,
    netSalary: 10170,
    payPeriod: "December 2024",
    payDate: "2024-12-31",
    status: "processed",
  },
];

export default function PayrollPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("December 2024");

  // Filter payroll data
  const filteredPayroll = payrollData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || record.department === selectedDepartment;

    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(payrollData.map((rec) => rec.department))];

  // Calculate statistics
  const totalPayroll = payrollData.reduce((sum, rec) => sum + rec.netSalary, 0);
  const processedCount = payrollData.filter(
    (r) => r.status === "processed"
  ).length;
  const pendingCount = payrollData.filter((r) => r.status === "pending").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Payroll Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage employee salaries and payslips
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit">
          <Download size={20} />
          Export Payroll
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
              <DollarSign className="text-[#FF6B00]" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Payroll</p>
              <p
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                ${totalPayroll.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Employees</p>
              <p
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {payrollData.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Processed</p>
              <p
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {processedCount}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-6 shadow-sm mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Pay Period */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Pay Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="December 2024">December 2024</option>
              <option value="November 2024">November 2024</option>
              <option value="October 2024">October 2024</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Search
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Status</option>
              <option value="processed">Processed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
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
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Department
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Basic Salary
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Allowances
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Deductions
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Net Salary
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.map((record) => (
                <tr
                  key={record.id}
                  className={`border-b ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  } ${
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  } transition-all`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {record.employeeName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {record.employeeId}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400">{record.department}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${record.basicSalary.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-green-500">
                      +${record.allowances.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-red-500">
                      -${record.deductions.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p
                      className={`font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${record.netSalary.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === "processed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        }`}
                        title="View Payslip"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        }`}
                        title="Download Payslip"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPayroll.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-12 shadow-sm text-center mt-6`}
        >
          <p className="text-gray-400 text-lg">No payroll records found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
