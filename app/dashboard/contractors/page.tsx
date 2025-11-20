"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Plus,
  CheckCircle,
  ArrowRight,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/config";

export default function ContractorsPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contractStageFilter, setContractStageFilter] = useState<string>("all");
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCancel = async (contractorId: string, contractorName: string) => {
    if (!confirm(`⚠️ CANCEL CONTRACTOR REQUEST\n\nAre you sure you want to cancel the contractor request for "${contractorName}"?\n\nThis will mark the contractor as rejected/cancelled but will keep the record for your reference.\n\nClick OK to confirm cancellation, or Cancel to keep the contractor active.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(API_ENDPOINTS.contractorCancel(contractorId), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to cancel contractor" }));
        throw new Error(errorData.detail || "Failed to cancel contractor");
      }

      alert(`Contractor ${contractorName} cancelled successfully`);
      // Reload the page to refresh contractor list
      window.location.reload();
    } catch (error: any) {
      console.error("Error cancelling contractor:", error);
      alert(`Failed to cancel contractor: ${error.message}`);
    }
  };

  const handleRecall = async (contractorId: string, contractorName: string) => {
    if (!confirm(`📝 RECALL FOR EDITING\n\nRecall "${contractorName}" from review to make changes?\n\nThe contractor will be moved back to "Documents Uploaded" status and you can edit the CDS & CS forms before resubmitting for review.\n\nClick OK to recall, or Cancel to leave as pending review.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(API_ENDPOINTS.contractorRecall(contractorId), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to recall contractor" }));
        throw new Error(errorData.detail || "Failed to recall contractor");
      }

      alert(`Contractor ${contractorName} recalled successfully! You can now make changes and resubmit.`);
      // Reload the page to refresh contractor list
      window.location.reload();
    } catch (error: any) {
      console.error("Error recalling contractor:", error);
      alert(`Failed to recall contractor: ${error.message}`);
    }
  };

  const handleDelete = async (contractorId: string, contractorName: string) => {
    if (!confirm(`🗑️ DELETE CONTRACTOR\n\nAre you sure you want to permanently delete "${contractorName}"?\n\nThis action cannot be undone and will remove all associated data.\n\nClick OK to delete permanently, or Cancel to keep the contractor.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(API_ENDPOINTS.contractorDelete(contractorId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to delete contractor" }));
        throw new Error(errorData.detail || "Failed to delete contractor");
      }

      alert(`Contractor ${contractorName} deleted successfully`);
      // Reload the page to refresh contractor list
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting contractor:", error);
      alert(`Failed to delete contractor: ${error.message}`);
    }
  };

  // Load contractors from backend API
  useEffect(() => {
    const loadContractors = async () => {
      try {
        const token = localStorage.getItem("aventus-auth-token");

        if (!token) {
          console.error("No auth token found - redirecting to login");
          router.push("/auth/login");
          return;
        }

        const response = await fetch(API_ENDPOINTS.contractors, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Token expired or invalid - redirecting to login");
          localStorage.removeItem("aventus-auth-token");
          router.push("/auth/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch contractors");
        }

        const data = await response.json();

        // Transform backend data to frontend format
        const transformedContractors = data.map((c: any) => {
          // Count uploaded documents (only count non-null, non-empty strings)
          const uploadedDocs = [
            c.passport_document,
            c.photo_document,
            c.visa_page_document,
            c.id_front_document,
            c.id_back_document,
            c.emirates_id_document,
            c.degree_document,
            c.third_party_document
          ].filter(doc => doc && doc !== '' && doc !== null).length;

          // Check if contractor has other documents
          const otherDocsCount = c.other_documents ? (Array.isArray(c.other_documents) ? c.other_documents.length : 0) : 0;

          const totalUploadedDocs = uploadedDocs + otherDocsCount;

          return {
            id: c.id,
            name: `${c.first_name} ${c.surname}`,
            email: c.email,
            phone: c.phone || "N/A",
            position: c.role || "Not specified",
            location: c.location || "Not specified",
            status: c.status,
            onboarding_route: c.onboarding_route,
            joinDate: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            avatar: `${c.first_name?.[0] || 'C'}${c.surname?.[0] || 'C'}`,
            contractToken: c.contract_token,
            sentDate: c.sent_date,
            signedDate: c.signed_date,
            activatedDate: c.activated_date,
            documents: {
              uploadedCount: totalUploadedDocs,
              hasDocuments: totalUploadedDocs > 0,
            },
          };
        });

        setContractors(transformedContractors);
        setLoading(false);
      } catch (error) {
        console.error("Error loading contractors:", error);
        setLoading(false);
      }
    };

    loadContractors();
    const interval = setInterval(loadContractors, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [router]);

  // Filter contractors
  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearch =
      contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contractor.status === statusFilter;

    const matchesContractStage =
      contractStageFilter === "all" ||
      (contractStageFilter === "pending_signature" && contractor.status === "pending_signature") ||
      (contractStageFilter === "signed" && contractor.status === "signed") ||
      (contractStageFilter === "offboarded" && contractor.status === "offboarded");

    return matchesSearch && matchesStatus && matchesContractStage;
  });


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
            Contractors
          </h1>
          <p className="text-gray-400 mt-2">
            Manage contractors and their documents
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            href="/dashboard/contractors/create-initial"
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 btn-parallelogram transition-all flex items-center gap-2 w-fit"
          >
            <Plus size={20} />
            Add Contractor
          </Link>
        </div>
      </div>

      {/* Contract Stage Tabs */}
      <div className="mb-6">
        <div className={`flex gap-2 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
          <button
            onClick={() => setContractStageFilter("all")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              contractStageFilter === "all"
                ? "border-[#FF6B00] text-[#FF6B00]"
                : theme === "dark"
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            All Contractors
          </button>
          <button
            onClick={() => setContractStageFilter("pending_signature")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              contractStageFilter === "pending_signature"
                ? "border-[#FF6B00] text-[#FF6B00]"
                : theme === "dark"
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending Contracts
          </button>
          <button
            onClick={() => setContractStageFilter("signed")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              contractStageFilter === "signed"
                ? "border-[#FF6B00] text-[#FF6B00]"
                : theme === "dark"
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Signed Contracts
          </button>
          <button
            onClick={() => setContractStageFilter("offboarded")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              contractStageFilter === "offboarded"
                ? "border-[#FF6B00] text-[#FF6B00]"
                : theme === "dark"
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Offboarded
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } card-parallelogram p-4 shadow-sm mb-6`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search contractors by name, email, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 input-parallelogram border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-3 input-parallelogram border transition-all outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_documents">Pending Documents</option>
            <option value="documents_uploaded">Documents Uploaded</option>
            <option value="pending_third_party_response">Pending Third Party Response</option>
            <option value="pending_cds_cs">Pending CDS & CS</option>
            <option value="cds_cs_completed">CDS & CS Completed</option>
            <option value="pending_review">Pending Review</option>
            <option value="awaiting_work_order_approval">Awaiting Work Order Approval</option>
            <option value="approved">Approved</option>
            <option value="work_order_completed">Work Order Completed</option>
            <option value="pending_signature">Pending Signature</option>
            <option value="pending_superadmin_signature">Pending Superadmin Signature</option>
            <option value="signed">Signed</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Contractors Table */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } card-parallelogram shadow-sm overflow-hidden`}
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
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Contact Number
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Documents
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B00]"></div>
                      <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                        Loading contractors...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredContractors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        No contractors found
                      </p>
                      <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                        {searchQuery || statusFilter !== "all" || contractStageFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by onboarding your first contractor"}
                      </p>
                      {!searchQuery && statusFilter === "all" && contractStageFilter === "all" && (
                        <Link
                          href="/dashboard/contractors/create-initial"
                          className="mt-4 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2 px-6 btn-parallelogram transition-all"
                        >
                          Add First Contractor
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContractors.map((contractor) => {
                return (
                  <tr
                    key={contractor.id}
                    className={`border-b ${
                      theme === "dark" ? "border-gray-800" : "border-gray-200"
                    } ${
                      theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    } transition-all`}
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/contractors/${contractor.id}`}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {contractor.avatar}
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {contractor.name}
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Job Title */}
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">{contractor.position}</p>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">{contractor.email}</p>
                    </td>

                    {/* Contact Number */}
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">{contractor.phone}</p>
                    </td>

                    {/* Documents */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`font-bold text-lg ${
                              contractor.documents.hasDocuments
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                          >
                            {contractor.documents.uploadedCount}
                          </span>
                        </div>
                        {contractor.documents.hasDocuments && (
                          <button
                            className="text-xs text-[#FF6B00] hover:text-[#FF6B00]/80 underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/contractors/${contractor.id}`);
                            }}
                          >
                            View Documents
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 btn-parallelogram text-xs font-semibold ${
                          contractor.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : contractor.status === "signed"
                            ? "bg-blue-500/10 text-blue-500"
                            : contractor.status === "approved"
                            ? "bg-green-500/10 text-green-500"
                            : contractor.status === "rejected"
                            ? "bg-red-500/10 text-red-500"
                            : contractor.status === "cancelled"
                            ? "bg-gray-500/10 text-gray-500"
                            : contractor.status === "pending_third_party_response"
                            ? "bg-purple-500/10 text-purple-500"
                            : contractor.status === "awaiting_work_order_approval"
                            ? "bg-amber-500/10 text-amber-500"
                            : contractor.status === "work_order_completed"
                            ? "bg-green-500/10 text-green-500"
                            : contractor.status === "pending_cds_cs"
                            ? "bg-purple-500/10 text-purple-500"
                            : contractor.status === "cds_cs_completed"
                            ? "bg-green-500/10 text-green-500"
                            : contractor.status === "pending_review"
                            ? "bg-orange-500/10 text-orange-500"
                            : contractor.status === "documents_uploaded"
                            ? "bg-cyan-500/10 text-cyan-500"
                            : contractor.status === "pending_documents"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : contractor.status === "pending_signature"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : contractor.status === "pending_superadmin_signature"
                            ? "bg-orange-500/10 text-orange-500"
                            : contractor.status === "draft"
                            ? "bg-gray-500/10 text-gray-500"
                            : contractor.status === "suspended"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {contractor.status === "approved"
                          ? (user?.role === "consultant" ? "Approved - Send Work Order" : "Approved")
                          : contractor.status === "rejected"
                          ? "Rejected"
                          : contractor.status === "cancelled"
                          ? "Cancelled"
                          : contractor.status === "pending_third_party_response"
                          ? "Pending Third Party Response"
                          : contractor.status === "pending_cds_cs"
                          ? "Pending CDS & CS"
                          : contractor.status === "cds_cs_completed"
                          ? "CDS & CS Completed"
                          : contractor.status === "signed"
                          ? "Contract Signed"
                          : contractor.status === "pending_superadmin_signature"
                          ? "Awaiting Admin Signature"
                          : contractor.status === "pending_signature"
                          ? "Awaiting Contractor Signature"
                          : contractor.status.charAt(0).toUpperCase() +
                            contractor.status.slice(1).replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      {contractor.status === "pending_documents" ? (
                        <div className="flex items-center gap-2 justify-center">
                          <span className="px-3 py-2 bg-amber-100 text-amber-700 btn-parallelogram text-xs font-medium">
                            Awaiting Documents
                          </span>
                          <button
                            onClick={() => handleCancel(contractor.id, contractor.name)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : contractor.status === "documents_uploaded" ? (
                        // Check if onboarding route has been selected
                        contractor.onboarding_route ? (
                          // Route selected (third_party or wps_freelancer): Show Fill CDS & CS Form button
                          user?.role === "consultant" ? (
                            <div className="flex items-center gap-2 justify-center">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/dashboard/contractors/complete-cds/${contractor.id}`
                                  )
                                }
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2"
                              >
                                {contractor.onboarding_route === "third_party" ? "Next: Fill CDS & CS Form" : "Fill CDS & CS Form"}
                                <ArrowRight size={16} />
                              </button>
                              <button
                                onClick={() => handleCancel(contractor.id, contractor.name)}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 justify-center">
                              <span className="px-3 py-2 bg-purple-100 text-purple-700 btn-parallelogram text-xs font-medium">
                                Awaiting CDS & CS Form
                              </span>
                              <button
                                onClick={() => handleCancel(contractor.id, contractor.name)}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          )
                        ) : (
                          // Initial upload route: Show Select Route button
                          user?.role === "consultant" ? (
                            <div className="flex items-center gap-2 justify-center">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/dashboard/contractors/${contractor.id}/select-route`
                                  )
                                }
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2"
                              >
                                Select Route
                                <ArrowRight size={16} />
                              </button>
                              <button
                                onClick={() => handleCancel(contractor.id, contractor.name)}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 justify-center">
                              <span className="px-3 py-2 bg-blue-100 text-blue-700 btn-parallelogram text-xs font-medium">
                                Awaiting Route Selection
                              </span>
                              <button
                                onClick={() => handleCancel(contractor.id, contractor.name)}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          )
                        )
                      ) : contractor.status === "pending_third_party_response" ? (
                        <div className="flex items-center gap-2 justify-center">
                          <span className="px-3 py-2 bg-purple-100 text-purple-700 btn-parallelogram text-xs font-medium">
                            Awaiting 3rd Party
                          </span>
                          <button
                            onClick={() => handleCancel(contractor.id, contractor.name)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : contractor.status === "pending_cds_cs" ? (
                        // Pending CDS & CS: Show Fill CDS & CS Form button
                        user?.role === "consultant" ? (
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/contractors/complete-cds/${contractor.id}`
                                )
                              }
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2"
                            >
                              Fill CDS & CS Form
                              <ArrowRight size={16} />
                            </button>
                            <button
                              onClick={() => handleCancel(contractor.id, contractor.name)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-center">
                            <span className="px-3 py-2 bg-blue-100 text-blue-700 btn-parallelogram text-xs font-medium">
                              Pending CDS & CS
                            </span>
                            <button
                              onClick={() => handleCancel(contractor.id, contractor.name)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        )
                      ) : contractor.status === "cds_cs_completed" ? (
                        user?.role === "consultant" ? (
                          <div className="flex items-center gap-2 justify-center">
                            <span className="px-3 py-2 bg-yellow-100 text-yellow-700 btn-parallelogram text-xs font-medium">
                              Awaiting Approval
                            </span>
                            <button
                              onClick={() => handleRecall(contractor.id, contractor.name)}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white btn-parallelogram transition-all text-xs font-medium flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                              Recall
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/contractors/${contractor.id}/review`
                              )
                            }
                            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2 mx-auto"
                          >
                            Review & Approve
                            <ArrowRight size={16} />
                          </button>
                        )
                      ) : contractor.status === "pending_review" ? (
                        user?.role === "consultant" ? (
                          <div className="flex items-center gap-2 justify-center">
                            <span className="px-3 py-2 bg-yellow-100 text-yellow-700 btn-parallelogram text-xs font-medium">
                              Awaiting Approval
                            </span>
                            <button
                              onClick={() => handleRecall(contractor.id, contractor.name)}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white btn-parallelogram transition-all text-xs font-medium flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                              Recall
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/contractors/${contractor.id}/review`
                              )
                            }
                            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2 mx-auto"
                          >
                            Review & Approve
                            <ArrowRight size={16} />
                          </button>
                        )
                      ) : contractor.status === "awaiting_work_order_approval" ? (
                        user?.role === "consultant" ? (
                          <span className="px-4 py-2 bg-amber-100 text-amber-700 btn-parallelogram text-sm font-medium">
                            Work Order Pending Approval
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/contractors/${contractor.id}/work-order-review`
                              )
                            }
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2 mx-auto"
                          >
                            Review Work Order
                            <ArrowRight size={16} />
                          </button>
                        )
                      ) : contractor.status === "approved" ? (
                        user?.role === "consultant" ? (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/contractors/${contractor.id}/work-order-review`
                              )
                            }
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2 mx-auto"
                          >
                            Send Work Order
                            <ArrowRight size={16} />
                          </button>
                        ) : (
                          <span className="px-4 py-2 bg-green-100 text-green-700 btn-parallelogram text-sm font-medium">
                            Approved
                          </span>
                        )
                      ) : contractor.status === "rejected" ? (
                        <span className="px-4 py-2 bg-red-100 text-red-700 btn-parallelogram text-sm font-medium">
                          Rejected
                        </span>
                      ) : contractor.status === "pending_signature" ? (
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-700 btn-parallelogram text-sm font-medium">
                          Awaiting Contractor Signature
                        </span>
                      ) : contractor.status === "pending_superadmin_signature" ? (
                        user?.role === "superadmin" ? (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/contractors/${contractor.id}/sign-contract`
                              )
                            }
                            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2 mx-auto"
                          >
                            Review & Sign Contract
                            <ArrowRight size={16} />
                          </button>
                        ) : (
                          <span className="px-4 py-2 bg-orange-100 text-orange-700 btn-parallelogram text-sm font-medium">
                            Awaiting Superadmin Signature
                          </span>
                        )
                      ) : contractor.status === "draft" ? (
                        <button
                          onClick={() => handleCancel(contractor.id, contractor.name)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-sm font-medium"
                        >
                          Delete
                        </button>
                      ) : contractor.status === "cancelled" || contractor.status === "rejected" ? (
                        <button
                          onClick={() => handleDelete(contractor.id, contractor.name)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2 mx-auto"
                          title="Delete Contractor"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      ) : contractor.status === "work_order_completed" ? (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/contractors/${contractor.id}/generate-contract`
                            )
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2 mx-auto"
                        >
                          Generate Contract
                          <ArrowRight size={16} />
                        </button>
                      ) : contractor.status === "signed" ? (
                        <div className="flex items-center gap-2 justify-center flex-wrap">
                          <a
                            href={API_ENDPOINTS.contractorSignedContract(contractor.id) + `?token=${localStorage.getItem("aventus-auth-token")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View Contract
                          </a>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to activate ${contractor.name}?`)) {
                                try {
                                  const token = localStorage.getItem("aventus-auth-token");
                                  const response = await fetch(
                                    API_ENDPOINTS.contractorActivate(contractor.id),
                                    {
                                      method: "POST",
                                      headers: {
                                        "Authorization": `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  if (response.ok) {
                                    alert("Contractor activated successfully!");
                                    setContractors(contractors.map(c =>
                                      c.id === contractor.id ? { ...c, status: "active" } : c
                                    ));
                                  } else {
                                    throw new Error("Failed to activate");
                                  }
                                } catch (error: any) {
                                  alert(`Failed to activate contractor: ${error.message}`);
                                }
                              }
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white btn-parallelogram transition-all text-sm font-medium"
                          >
                            Activate
                          </button>
                          {user?.role === "superadmin" && (
                            <button
                              onClick={async () => {
                                if (confirm(`⚠️ RESET FOR TESTING\n\nThis will reset ${contractor.name}'s status back to "Pending Admin Signature" so you can test the signing workflow again.\n\nThis will clear the superadmin signature.\n\nContinue?`)) {
                                  try {
                                    const token = localStorage.getItem("aventus-auth-token");
                                    const response = await fetch(
                                      API_ENDPOINTS.resetToPendingSignature(contractor.id),
                                      {
                                        method: "POST",
                                        headers: {
                                          "Authorization": `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    if (response.ok) {
                                      alert("Contractor reset to pending signature!");
                                      window.location.reload();
                                    } else {
                                      throw new Error("Failed to reset");
                                    }
                                  } catch (error: any) {
                                    alert(`Failed to reset contractor: ${error.message}`);
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white btn-parallelogram transition-all text-sm font-medium"
                              title="Reset to test signing workflow"
                            >
                              Reset for Testing
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => router.push(`/dashboard/contractors/${contractor.id}`)}
                          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram transition-all text-sm font-medium"
                        >
                          Manage
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredContractors.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-lg">No contractors found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
