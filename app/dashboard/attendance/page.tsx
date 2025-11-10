"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Sample attendance data
const attendanceData = [
  {
    id: 1,
    employeeName: "Sarah Johnson",
    department: "Engineering",
    date: "2024-12-15",
    clockIn: "09:00 AM",
    clockOut: "06:00 PM",
    totalHours: "9h 0m",
    status: "present",
  },
  {
    id: 2,
    employeeName: "Michael Chen",
    department: "Marketing",
    date: "2024-12-15",
    clockIn: "08:45 AM",
    clockOut: "05:30 PM",
    totalHours: "8h 45m",
    status: "present",
  },
  {
    id: 3,
    employeeName: "Emily Davis",
    department: "Sales",
    date: "2024-12-15",
    clockIn: "-",
    clockOut: "-",
    totalHours: "-",
    status: "absent",
  },
  {
    id: 4,
    employeeName: "James Wilson",
    department: "HR",
    date: "2024-12-15",
    clockIn: "09:30 AM",
    clockOut: "06:15 PM",
    totalHours: "8h 45m",
    status: "present",
  },
  {
    id: 5,
    employeeName: "Lisa Anderson",
    department: "Finance",
    date: "2024-12-15",
    clockIn: "09:15 AM",
    clockOut: "-",
    totalHours: "In Progress",
    status: "present",
  },
  {
    id: 6,
    employeeName: "David Martinez",
    department: "Engineering",
    date: "2024-12-15",
    clockIn: "10:00 AM",
    clockOut: "06:30 PM",
    totalHours: "8h 30m",
    status: "late",
  },
  {
    id: 7,
    employeeName: "Jennifer Lee",
    department: "Design",
    date: "2024-12-15",
    clockIn: "09:00 AM",
    clockOut: "06:00 PM",
    totalHours: "9h 0m",
    status: "present",
  },
  {
    id: 8,
    employeeName: "Robert Taylor",
    department: "Operations",
    date: "2024-12-15",
    clockIn: "-",
    clockOut: "-",
    totalHours: "-",
    status: "on-leave",
  },
];

export default function AttendancePage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2024-12-15");

  // Filter attendance data
  const filteredAttendance = attendanceData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || record.department === selectedDepartment;

    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [
    ...new Set(attendanceData.map((rec) => rec.department)),
  ];

  // Calculate statistics
  const presentCount = attendanceData.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  const absentCount = attendanceData.filter((r) => r.status === "absent")
    .length;
  const onLeaveCount = attendanceData.filter((r) => r.status === "on-leave")
    .length;
  const lateCount = attendanceData.filter((r) => r.status === "late").length;

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
            Attendance Records
          </h1>
          <p className="text-gray-400 mt-2">
            Track and manage employee attendance
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit">
          <Download size={20} />
          Export Report
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
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Present</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {presentCount}
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
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Absent</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {absentCount}
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
              <AlertCircle className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Late</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {lateCount}
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
              <CalendarIcon className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">On Leave</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {onLeaveCount}
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
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            />
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
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Clock In
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Clock Out
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Total Hours
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr
                  key={record.id}
                  className={`border-b ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  } ${
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  } transition-all`}
                >
                  <td className="px-6 py-4">
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {record.employeeName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-sm">{record.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {record.clockIn}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {record.clockOut}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {record.totalHours}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === "present"
                          ? "bg-green-500/10 text-green-500"
                          : record.status === "absent"
                          ? "bg-red-500/10 text-red-500"
                          : record.status === "late"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {record.status === "on-leave" ? "On Leave" : record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredAttendance.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-12 shadow-sm text-center mt-6`}
        >
          <p className="text-gray-400 text-lg">No attendance records found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
