"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlusCircle,
  FileText,
  Upload,
  X,
} from "lucide-react";

export default function ContractorTimesheetPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "declined">("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [timesheetFile, setTimesheetFile] = useState<File | null>(null);
  const [approvalFile, setApprovalFile] = useState<File | null>(null);
  const [timesheetsData, setTimesheetsData] = useState<any>({
    timesheets: [],
    total: 0,
    pending: 0,
    approved: 0,
    declined: 0,
  });
  const [loading, setLoading] = useState(true);

  // Get contractor ID from session/auth - using placeholder for now
  const contractorId = "contractor_123"; // TODO: Get from auth context

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/timesheets/contractor/${contractorId}`
      );
      const data = await response.json();
      setTimesheetsData(data);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditResubmit = (timesheetId: number) => {
    router.push("/dashboard/timesheet/fill");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'timesheet' | 'approval') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'timesheet') {
        setTimesheetFile(file);
      } else {
        setApprovalFile(file);
      }
    }
  };

  const removeFile = (type: 'timesheet' | 'approval') => {
    if (type === 'timesheet') {
      setTimesheetFile(null);
    } else {
      setApprovalFile(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!timesheetFile) {
      alert("Please upload a timesheet document");
      return;
    }

    const now = new Date();
    try {
      const response = await fetch("http://localhost:8000/api/v1/timesheets/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractor_id: contractorId,
          month: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
          year: now.getFullYear(),
          month_number: now.getMonth() + 1,
          notes: "",
        }),
      });

      if (response.ok) {
        alert("Timesheet uploaded successfully!");
        setShowUploadModal(false);
        setTimesheetFile(null);
        setApprovalFile(null);
        fetchTimesheets(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to upload timesheet");
      }
    } catch (error) {
      console.error("Error uploading timesheet:", error);
      alert("Error uploading timesheet. Please try again.");
    }
  };

  const allTimesheets = timesheetsData.timesheets || [];

  const filteredTimesheets = activeTab === "all"
    ? allTimesheets
    : allTimesheets.filter((t: any) => t.status === activeTab);

  return (
    <DashboardLayout>
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-400">Loading timesheets...</p>
        </div>
      )}

      {!loading && (
        <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            My Timesheets
          </h1>
          <p className="text-gray-400 mt-2">
            View submitted timesheets and fill new ones
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowUploadModal(true)}
            className={`font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            <Upload size={20} />
            Upload Timesheet
          </button>
          <button
            onClick={() => router.push("/dashboard/timesheet/fill")}
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
          >
            <PlusCircle size={20} />
            Fill Timesheet
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Submitted</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {timesheetsData.total}
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
              <Clock className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {timesheetsData.pending}
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
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {timesheetsData.approved}
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
              <p className="text-gray-400 text-sm">Declined</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {timesheetsData.declined}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto">
          {[
            { id: "all", label: "All Timesheets", count: timesheetsData.total },
            { id: "pending", label: "Pending", count: timesheetsData.pending },
            { id: "approved", label: "Approved", count: timesheetsData.approved },
            { id: "declined", label: "Declined", count: timesheetsData.declined },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? theme === "dark"
                    ? "bg-[#FF6B00] text-white"
                    : "bg-[#FF6B00] text-white"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <span className="text-sm">{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : theme === "dark"
                    ? "bg-gray-900 text-gray-500"
                    : "bg-white text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timesheets List */}
      <div className="space-y-4">
        {filteredTimesheets.map((timesheet) => (
          <div
            key={timesheet.id}
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm ${
              timesheet.status === "declined" ? "border-l-4 border-red-500" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {timesheet.month}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      timesheet.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : timesheet.status === "approved"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <div>
                    <p className="text-gray-400 text-xs">Total Days</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {timesheet.total_days || 0} {timesheet.total_days === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Work Days</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {timesheet.work_days || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Sick Days</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {timesheet.sick_days || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Submitted</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {timesheet.submitted_date ? new Date(timesheet.submitted_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      ) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Manager</p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {timesheet.manager_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {timesheet.status === "pending" && <Clock className="text-yellow-500" size={24} />}
                {timesheet.status === "approved" && <CheckCircle className="text-green-500" size={24} />}
                {timesheet.status === "declined" && <XCircle className="text-red-500" size={24} />}
              </div>
            </div>

            {/* Decline Reason */}
            {timesheet.status === "declined" && timesheet.decline_reason && (
              <>
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    theme === "dark" ? "bg-red-500/10" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-red-500 font-medium text-sm mb-1">
                        Reason for Decline:
                      </p>
                      <p className="text-gray-400 text-sm">{timesheet.decline_reason}</p>
                    </div>
                  </div>
                </div>

                {/* Resubmit Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleEditResubmit(timesheet.id)}
                    className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2 px-6 rounded-lg transition-all text-sm"
                  >
                    Edit & Resubmit
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTimesheets.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-12 shadow-sm text-center`}
        >
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-400 text-lg">No timesheets found</p>
          <p className="text-gray-400 text-sm mt-2">
            Start by filling out your first timesheet
          </p>
          <button
            onClick={() => router.push("/dashboard/timesheet/fill")}
            className="mt-6 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all inline-flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Fill Timesheet
          </button>
        </div>
      )}

      {/* Upload Timesheet Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Upload Timesheet
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setTimesheetFile(null);
                  setApprovalFile(null);
                }}
                className={`p-2 rounded-lg transition-all ${
                  theme === "dark"
                    ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                }`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <p className="text-gray-400 text-sm">
                Upload your completed timesheet document and proof of approval (if available)
              </p>

              {/* Upload Timesheet Document */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Timesheet Document <span className="text-red-500">*</span>
                </label>
                {!timesheetFile ? (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      theme === "dark"
                        ? "border-gray-700 hover:border-[#FF6B00] bg-gray-800 hover:bg-gray-750"
                        : "border-gray-300 hover:border-[#FF6B00] bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => handleFileChange(e, "timesheet")}
                    />
                  </label>
                ) : (
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-6 h-6 text-[#FF6B00] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {timesheetFile.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(timesheetFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <button
                        onClick={() => removeFile("timesheet")}
                        className={`p-1 rounded transition-all ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                            : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Proof of Approval */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Proof of Approval (Optional)
                </label>
                {!approvalFile ? (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      theme === "dark"
                        ? "border-gray-700 hover:border-[#FF6B00] bg-gray-800 hover:bg-gray-750"
                        : "border-gray-300 hover:border-[#FF6B00] bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, PNG, JPG (Max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileChange(e, "approval")}
                    />
                  </label>
                ) : (
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-6 h-6 text-[#FF6B00] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {approvalFile.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(approvalFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <button
                        onClick={() => removeFile("approval")}
                        className={`p-1 rounded transition-all ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                            : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any additional notes about this timesheet..."
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setTimesheetFile(null);
                  setApprovalFile(null);
                }}
                className={`font-medium py-2 px-6 rounded-lg transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2 px-6 rounded-lg transition-all"
              >
                Upload Timesheet
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </DashboardLayout>
  );
}
