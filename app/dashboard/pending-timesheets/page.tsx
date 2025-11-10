"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, X, Eye, Clock, Calendar } from "lucide-react";

// Sample pending timesheets for manager review
const pendingTimesheetsData = [
  {
    id: 1,
    contractorName: "John Doe",
    contractorEmail: "john.doe@example.com",
    week: "Dec 11-15, 2024",
    project: "Project Alpha",
    hours: {
      monday: 8,
      tuesday: 8,
      wednesday: 7,
      thursday: 8,
      friday: 9,
    },
    totalHours: 40,
    submittedDate: "2024-12-15 14:30",
    notes: "Worked on API integration and bug fixes",
  },
  {
    id: 2,
    contractorName: "Jane Smith",
    contractorEmail: "jane.smith@example.com",
    week: "Dec 11-15, 2024",
    project: "Project Beta",
    hours: {
      monday: 8,
      tuesday: 7.5,
      wednesday: 8,
      thursday: 8,
      friday: 6.5,
    },
    totalHours: 38,
    submittedDate: "2024-12-15 16:45",
    notes: "Frontend development and client meeting on Friday afternoon",
  },
  {
    id: 3,
    contractorName: "Bob Williams",
    contractorEmail: "bob.williams@example.com",
    week: "Dec 11-15, 2024",
    project: "Project Gamma",
    hours: {
      monday: 8,
      tuesday: 8,
      wednesday: 9,
      thursday: 8,
      friday: 9,
    },
    totalHours: 42,
    submittedDate: "2024-12-14 10:20",
    notes: "Sprint completion and deployment",
  },
];

export default function ManagerPendingTimesheetsPage() {
  const { theme } = useTheme();
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const handleApprove = (timesheetId: number) => {
    console.log("Approving timesheet:", timesheetId);
    setShowApprovalModal(false);
    setSelectedTimesheet(null);
    // Handle approval logic
  };

  const handleDecline = (timesheetId: number) => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining");
      return;
    }
    console.log("Declining timesheet:", timesheetId, "Reason:", declineReason);
    setShowDeclineModal(false);
    setSelectedTimesheet(null);
    setDeclineReason("");
    // Handle decline logic
  };

  const openApprovalModal = (timesheet: any) => {
    setSelectedTimesheet(timesheet);
    setShowApprovalModal(true);
  };

  const openDeclineModal = (timesheet: any) => {
    setSelectedTimesheet(timesheet);
    setShowDeclineModal(true);
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
          Pending Timesheets
        </h1>
        <p className="text-gray-400 mt-2">
          Review and approve contractor timesheets
        </p>
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
              <p className="text-gray-400 text-sm">Pending Review</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {pendingTimesheetsData.length}
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
            <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
              <Calendar className="text-[#FF6B00]" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Hours</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {pendingTimesheetsData.reduce((sum, t) => sum + t.totalHours, 0)}h
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
              <Eye className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Contractors</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {new Set(pendingTimesheetsData.map((t) => t.contractorName)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timesheets List */}
      <div className="space-y-4">
        {pendingTimesheetsData.map((timesheet) => (
          <div
            key={timesheet.id}
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {timesheet.contractorName.charAt(0)}
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {timesheet.contractorName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {timesheet.contractorEmail}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Submitted:{" "}
                    {new Date(timesheet.submittedDate).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                Pending Review
              </span>
            </div>

            {/* Timesheet Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-xs">Week</p>
                <p
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {timesheet.week}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Project</p>
                <p
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {timesheet.project}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Hours</p>
                <p
                  className={`font-medium text-lg ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {timesheet.totalHours}h
                </p>
              </div>
            </div>

            {/* Weekly Hours Breakdown */}
            <div
              className={`p-4 rounded-lg mb-4 ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <p className="text-gray-400 text-xs mb-3">HOURS BREAKDOWN</p>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(timesheet.hours).map(([day, hours]) => (
                  <div key={day} className="text-center">
                    <p className="text-gray-400 text-xs capitalize mb-1">
                      {day.slice(0, 3)}
                    </p>
                    <p
                      className={`font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {hours}h
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {timesheet.notes && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <p className="text-gray-400 text-xs mb-2">NOTES</p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {timesheet.notes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => openApprovalModal(timesheet)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center gap-2"
              >
                <Check size={18} />
                Approve
              </button>
              <button
                onClick={() => openDeclineModal(timesheet)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center gap-2"
              >
                <X size={18} />
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pendingTimesheetsData.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-12 shadow-sm text-center`}
        >
          <Clock className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-400 text-lg">No pending timesheets</p>
          <p className="text-gray-400 text-sm mt-2">
            All timesheets have been reviewed
          </p>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedTimesheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 max-w-md w-full`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Approve Timesheet
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to approve the timesheet for{" "}
              <span className="font-semibold text-[#FF6B00]">
                {selectedTimesheet.contractorName}
              </span>{" "}
              ({selectedTimesheet.week})?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApprove(selectedTimesheet.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedTimesheet(null);
                }}
                className={`flex-1 font-medium py-3 px-6 rounded-lg transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedTimesheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 max-w-md w-full`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Decline Timesheet
            </h3>
            <p className="text-gray-400 mb-4">
              Declining timesheet for{" "}
              <span className="font-semibold text-[#FF6B00]">
                {selectedTimesheet.contractorName}
              </span>{" "}
              ({selectedTimesheet.week})
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Reason for Decline *
              </label>
              <textarea
                rows={4}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Please explain why this timesheet is being declined..."
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDecline(selectedTimesheet.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setSelectedTimesheet(null);
                  setDeclineReason("");
                }}
                className={`flex-1 font-medium py-3 px-6 rounded-lg transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
