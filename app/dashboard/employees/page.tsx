"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

// Sample employee data
const employeesData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@aventus.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Software Engineer",
    status: "active",
    joinDate: "2022-01-15",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@aventus.com",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    position: "Marketing Manager",
    status: "active",
    joinDate: "2021-06-20",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@aventus.com",
    phone: "+1 (555) 345-6789",
    department: "Sales",
    position: "Sales Director",
    status: "active",
    joinDate: "2020-03-10",
    avatar: "ED",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@aventus.com",
    phone: "+1 (555) 456-7890",
    department: "HR",
    position: "HR Manager",
    status: "active",
    joinDate: "2021-11-05",
    avatar: "JW",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@aventus.com",
    phone: "+1 (555) 567-8901",
    department: "Finance",
    position: "Financial Analyst",
    status: "active",
    joinDate: "2022-08-12",
    avatar: "LA",
  },
  {
    id: 6,
    name: "David Martinez",
    email: "david.martinez@aventus.com",
    phone: "+1 (555) 678-9012",
    department: "Engineering",
    position: "DevOps Engineer",
    status: "active",
    joinDate: "2023-02-18",
    avatar: "DM",
  },
  {
    id: 7,
    name: "Jennifer Lee",
    email: "jennifer.lee@aventus.com",
    phone: "+1 (555) 789-0123",
    department: "Design",
    position: "UX Designer",
    status: "active",
    joinDate: "2022-04-22",
    avatar: "JL",
  },
  {
    id: 8,
    name: "Robert Taylor",
    email: "robert.taylor@aventus.com",
    phone: "+1 (555) 890-1234",
    department: "Operations",
    position: "Operations Coordinator",
    status: "on-leave",
    joinDate: "2021-09-30",
    avatar: "RT",
  },
];

export default function EmployeesPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filter employees
  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || employee.department === selectedDepartment;

    const matchesStatus =
      selectedStatus === "all" || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [
    ...new Set(employeesData.map((emp) => emp.department)),
  ];

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
            Employees
          </h1>
          <p className="text-gray-400 mt-2">
            Manage and view all employee information
          </p>
        </div>
        <Link
          href="/dashboard/employees/add"
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-6 shadow-sm mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
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
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Grid/List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEmployees.map((employee) => (
          <Link
            key={employee.id}
            href={`/dashboard/employees/${employee.id}`}
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm transition-all hover:shadow-md ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {employee.avatar}
                </div>

                {/* Employee Info */}
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employee.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{employee.position}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Mail size={14} />
                      {employee.email}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Phone size={14} />
                      {employee.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Info */}
              <div className="flex items-center gap-6">
                {/* Department */}
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Department</p>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employee.department}
                  </p>
                </div>

                {/* Join Date */}
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Joined</p>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Date(employee.joinDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    employee.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : employee.status === "on-leave"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {employee.status === "on-leave" ? "On Leave" : employee.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-12 shadow-sm text-center`}
        >
          <p className="text-gray-400 text-lg">No employees found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
