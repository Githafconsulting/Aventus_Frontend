"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Download,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/config";

export default function WorkOrderReviewPage() {
  const params = useParams();
  const router = useRouter();
  const contractorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWorkOrder();
  }, [contractorId]);

  const fetchWorkOrder = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        API_ENDPOINTS.contractorWorkOrder(contractorId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch work order");
      }

      const data = await response.json();
      setWorkOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWorkOrder = async () => {
    if (
      !confirm(
        "Approve and send this Work Order to the contractor? An email will be sent with preview and download links."
      )
    ) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        API_ENDPOINTS.contractorWorkOrderApprove(contractorId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to approve work order");
      }

      const data = await response.json();
      alert(
        `Success! Work Order approved and sent to contractor. Status is now "Approved" and the contractor can proceed to contract signing.`
      );

      // Navigate back to contractors list
      router.push("/dashboard/contractors");
    } catch (err: any) {
      console.error("Error approving work order:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreviewPDF = () => {
    window.open(
      API_ENDPOINTS.contractorWorkOrderPdf(contractorId),
      "_blank"
    );
  };

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = API_ENDPOINTS.contractorWorkOrderPdf(contractorId);
    link.download = `work_order_${workOrder?.work_order_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !workOrder) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Work Order
            </h2>
            <p className="text-red-600 mb-4">{error || "Work order not found"}</p>
            <Link
              href="/dashboard/contractors"
              className="inline-flex items-center gap-2 text-[#FF6B00] hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Contractors
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/contractors"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Contractors
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Review & Approve Work Order
          </h1>
          <p className="text-gray-600 mt-2">
            Review the generated work order before sending to the contractor
          </p>
        </div>

        {/* Work Order Number Badge */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Work Order Number</p>
              <h2 className="text-2xl font-bold">{workOrder.work_order_number}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Status</p>
              <p className="text-lg font-semibold">Pending Approval</p>
            </div>
          </div>
        </div>

        {/* PDF Preview/Download */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Work Order Document
          </h3>
          <div className="flex gap-4">
            <button
              onClick={handlePreviewPDF}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              <Eye size={20} />
              Preview PDF
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Work Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contractor Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#FF6B00]" />
              Contractor Details
            </h3>
            <div className="space-y-3">
              <DetailItem label="Name" value={workOrder.contractor_name} />
              <DetailItem label="Business Type" value={workOrder.business_type} />
              {workOrder.umbrella_company_name && (
                <DetailItem
                  label="Company Name"
                  value={workOrder.umbrella_company_name}
                />
              )}
            </div>
          </div>

          {/* Assignment Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-[#FF6B00]" />
              Assignment Details
            </h3>
            <div className="space-y-3">
              <DetailItem label="Client" value={workOrder.client_name} />
              {workOrder.project_name && (
                <DetailItem label="Project" value={workOrder.project_name} />
              )}
              <DetailItem label="Role" value={workOrder.role} />
              <DetailItem label="Location" value={workOrder.location} />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#FF6B00]" />
              Timeline
            </h3>
            <div className="space-y-3">
              <DetailItem
                label="Start Date"
                value={
                  workOrder.start_date
                    ? new Date(workOrder.start_date).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailItem
                label="End Date"
                value={
                  workOrder.end_date
                    ? new Date(workOrder.end_date).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailItem label="Duration" value={workOrder.duration} />
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-[#FF6B00]" />
              Financial Details
            </h3>
            <div className="space-y-3">
              <DetailItem label="Currency" value={workOrder.currency} />
              <DetailItem
                label="Pay Rate"
                value={`${workOrder.pay_rate} ${workOrder.currency}`}
              />
              <DetailItem
                label="Charge Rate"
                value={`${workOrder.charge_rate} ${workOrder.currency}`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {workOrder.status === "pending_approval" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Decision
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                disabled={submitting}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
              <button
                onClick={handleApproveWorkOrder}
                disabled={submitting}
                className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Approve & Send to Contractor
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Helper component for displaying detail items
function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className="text-sm text-gray-900 text-right max-w-[60%]">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </span>
    </div>
  );
}
