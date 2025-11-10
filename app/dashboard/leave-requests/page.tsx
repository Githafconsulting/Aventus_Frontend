"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  Filter,
  Search,
} from "lucide-react";

// Sample leave requests data
const leaveRequestsData = [
  {
    id: 1,
    employeeName: "Sarah Johnson",
    department: "Engineering",
    leaveType: "Vacation",
    startDate: "2024-12-20",
    endDate: "2024-12-24",
    days: 5,
    reason: "Family vacation",
    status: "pending",
    appliedDate: "2024-12-10",
  },
  {
    id: 2,
    employeeName: "Michael Chen",
    department: "Marketing",
    leaveType: "Sick Leave",
    startDate: "2024-12-15",
    endDate: "2024-12-15",
    days: 1,
    reason: "Medical checkup",
    status: "approved",
    appliedDate: "2024-12-14",
  },
  {
    id: 3,
    employeeName: "Emily Davis",
    department: "Sales",
    leaveType: "Vacation",
    startDate: "2025-01-05",
    endDate: "2025-01-12",
    days: 8,
    reason: "Holiday trip",
    status: "pending",
    appliedDate: "2024-12-11",
  },
  {
    id: 4,
    employeeName: "James Wilson",
    department: "HR",
    leaveType: "Personal",
    startDate: "2024-12-18",
    endDate: "2024-12-18",
    days: 1,
    reason: "Personal matters",
    status: "approved",
    appliedDate: "2024-12-12",
  },
  {
    id: 5,
    employeeName: "Lisa Anderson",
    department: "Finance",
    leaveType: "Vacation",
    startDate: "2024-12-27",
    endDate: "2024-12-31",
    days: 5,
    reason: "Year-end break",
    status: "pending",
    appliedDate: "2024-12-13",
  },
  {
    id: 6,
    employeeName: "David Martinez",
    department: "Engineering",
    leaveType: "Sick Leave",
    startDate: "2024-12-08",
    endDate: "2024-12-09",
    days: 2,
    reason: "Flu",
    status: "rejected",
    appliedDate: "2024-12-07",
  },
];

export default function LeaveRequestsPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLeaveType, setSelectedLeaveType] = useState("all");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Filter leave requests
  const filteredRequests = leaveRequestsData.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;

    const matchesLeaveType =
      selectedLeaveType === "all" || request.leaveType === selectedLeaveType;

    return matchesSearch && matchesStatus && matchesLeaveType;
  });

  const handleApprove = (requestId: number) => {
    console.log("Approved request:", requestId);
    // Handle approval logic
  };

  const handleReject = (requestId: number) => {
    console.log("Rejected request:", requestId);
    // Handle rejection logic
  };

  // Calculate statistics
  const pendingCount = leaveRequestsData.filter(
    (r) => r.status === "pending"
  ).length;
  const approvedCount = leaveRequestsData.filter(
    (r) => r.status === "approved"
  ).length;
  const rejectedCount = leaveRequestsData.filter(
    (r) => r.status === "rejected"
  ).length;

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
            Leave Requests
          </h1>
          <p className="text-gray-400 mt-2">
            Review and manage employee leave requests
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit">
          <Plus size={20} />
          New Leave Request
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {pendingCount}
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
              <Check className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {approvedCount}
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
              <X className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {rejectedCount}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
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

          {/* Leave Type Filter */}
          <div>
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Leave Types</option>
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal">Personal</option>
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Employee Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold">
                    {request.employeeName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {request.employeeName}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {request.department} • Applied on{" "}
                      {new Date(request.appliedDate).toLocaleDateString(
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

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs">Leave Type</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {request.leaveType}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Start Date</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {new Date(request.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">End Date</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {new Date(request.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Duration</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {request.days} {request.days === 1 ? "day" : "days"}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-gray-400 text-xs">Reason</p>
                  <p
                    className={`${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {request.reason}
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    request.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : request.status === "approved"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>

                {request.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-12 shadow-sm text-center`}
        >
          <p className="text-gray-400 text-lg">No leave requests found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
