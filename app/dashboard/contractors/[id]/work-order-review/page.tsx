"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  Edit,
  Send,
  Loader2,
  Eye,
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

export default function WorkOrderReviewPage() {
  const params = useParams();
  const router = useRouter();
  const contractorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

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
      setEditedData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPDF = () => {
    window.open(API_ENDPOINTS.contractorWorkOrderPdf(contractorId), "_blank");
  };

  const handleSaveEdits = () => {
    setWorkOrder(editedData);
    setIsEditing(false);
    alert("Changes saved! Note: To apply changes to the PDF, you need to update the CDS data.");
  };

  const handleCancelEdit = () => {
    setEditedData(workOrder);
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const handleSendWorkOrder = async () => {
    if (!confirm("Send this Work Order to the client? An email will be sent requesting their signature.")) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const endpoint = API_ENDPOINTS.contractorWorkOrderApprove(contractorId);

      // Debug logging
      console.log("=== SEND WORK ORDER DEBUG ===");
      console.log("Endpoint URL:", endpoint);
      console.log("Contractor ID:", contractorId);
      console.log("Has Token:", !!token);
      console.log("Token preview:", token?.substring(0, 30) + "...");

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response OK:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        throw new Error(errorData.detail || "Failed to send work order");
      }

      const result = await response.json();
      console.log("Success response:", result);

      alert("Work Order sent successfully to client!");
      router.push("/dashboard/contractors");
    } catch (err: any) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error type:", err.constructor.name);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.error("Full error:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
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
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Work Order
            </h2>
            <p className="text-red-600 mb-4">{error || "Work order not found"}</p>
            <button
              onClick={() => router.push("/dashboard/contractors")}
              className="text-[#FF6B00] hover:underline"
            >
              ← Back to Contractors
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/dashboard/contractors")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Contractors
          </button>

          <div className="flex items-center justify-between flex-1 ml-8">
            {isEditing ? (
              <>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-all"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  onClick={handleSaveEdits}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-all"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={handlePreviewPDF}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all"
                    title="Preview PDF"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <button
                  onClick={handleSendWorkOrder}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-sm rounded transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* A4 Work Order Document */}
        <div className="bg-white shadow-xl rounded-lg text-gray-900" style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-12" style={{ fontSize: '11pt', lineHeight: '1.6' }}>
            {/* Header with Logo */}
            <div className="text-center mb-6">
              <img
                src="/av-logo.png"
                alt="Aventus Logo"
                className="mx-auto mb-4"
                style={{ height: '50px', width: 'auto' }}
              />
              <p className="text-sm text-gray-700 mb-1">Appendix "1"</p>
              <h1 className="text-2xl font-bold text-[#FF6B00] mb-4">CONTRACTOR WORK ORDER</h1>
              <hr className="border-gray-300 mb-6" />
            </div>

            {/* Details and Definitions */}
            <h2 className="text-base font-bold text-gray-900 mb-4">Details and Definitions</h2>

            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-900">Contractor:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.contractor_name}
                  onChange={(e) => handleFieldChange('contractor_name', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-96"
                />
              ) : (
                workOrder.contractor_name
              )}
            </p>
            <p className="text-gray-800 mb-4">
              <span className="font-semibold text-gray-900">Location:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-96"
                />
              ) : (
                workOrder.location
              )}
              , or such other site as may be agreed from time to time by parties
            </p>

            <hr className="border-gray-200 my-4" />

            {/* Assignment Term */}
            <p className="font-semibold text-gray-900 mb-2">Assignment Term:</p>
            <p className="text-gray-800 mb-1">
              <span className="font-semibold text-gray-900">From:</span>{" "}
              {isEditing ? (
                <input
                  type="date"
                  value={editedData.start_date}
                  onChange={(e) => handleFieldChange('start_date', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800"
                />
              ) : (
                formatDate(workOrder.start_date)
              )}
            </p>
            <p className="text-gray-800 mb-1">
              <span className="font-semibold text-gray-900">To:</span>{" "}
              {isEditing ? (
                <input
                  type="date"
                  value={editedData.end_date}
                  onChange={(e) => handleFieldChange('end_date', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800"
                />
              ) : (
                formatDate(workOrder.end_date)
              )}
            </p>
            <p className="text-gray-800 mb-4">
              <span className="font-semibold text-gray-900">Duration:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.duration}
                  onChange={(e) => handleFieldChange('duration', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-64"
                />
              ) : (
                workOrder.duration
              )}
            </p>

            {/* Position */}
            <p className="text-gray-800 mb-4">
              <span className="font-semibold text-gray-900">Position:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-96"
                />
              ) : (
                workOrder.role
              )}
            </p>

            <hr className="border-gray-200 my-4" />

            {/* Assignment Details */}
            <p className="font-semibold text-gray-900 mb-2">Assignment details:</p>
            {isEditing ? (
              <textarea
                value={editedData.project_name || ''}
                onChange={(e) => handleFieldChange('project_name', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-full mb-1"
                rows={3}
              />
            ) : (
              workOrder.project_name && (
                <p className="text-gray-800 mb-1">{workOrder.project_name}</p>
              )
            )}
            <p className="text-sm text-gray-500 italic mb-4">(Include the type of work to be carried out)</p>

            <hr className="border-gray-200 my-4" />

            {/* Other Details */}
            <p className="text-gray-800 mb-2"><span className="font-semibold text-gray-900">Overtime:</span> N/A</p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-900">Charge Rate:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.charge_rate}
                  onChange={(e) => handleFieldChange('charge_rate', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-32"
                />
              ) : (
                workOrder.charge_rate
              )}{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.currency}
                  onChange={(e) => handleFieldChange('currency', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-20"
                />
              ) : (
                workOrder.currency
              )}{" "}
              per professional month worked
            </p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-900">Currency:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.currency}
                  onChange={(e) => handleFieldChange('currency', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-20"
                />
              ) : (
                workOrder.currency
              )}
            </p>
            <p className="text-gray-800 mb-2"><span className="font-semibold text-gray-900">Termination Notice Period:</span> TBC</p>
            <p className="text-gray-800 mb-2"><span className="font-semibold text-gray-900">Payment terms:</span> As per agreement, from date of invoice</p>
            <p className="text-gray-800 mb-6"><span className="font-semibold text-gray-900">Expenses:</span> All expenses approved in writing by the Client either to the Contractor or to Aventus</p>

            <hr className="border-gray-300 my-6" />

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-8 mt-6">
              {/* Aventus Signature */}
              <div>
                <p className="font-bold text-gray-900 mb-3">FOR AVENTUS CONTRACTOR MANAGEMENT:</p>
                <div className="space-y-2 text-gray-800">
                  <p>Signed: _____________________________</p>
                  <p>Name: _____________________________</p>
                  <p>Position: _____________________________</p>
                  <p>Date: _____________________________</p>
                </div>
              </div>

              {/* Contractor Signature */}
              <div>
                <p className="font-bold text-gray-900 mb-3">CONTRACTOR ACKNOWLEDGMENT:</p>
                <div className="space-y-2 text-gray-800">
                  <p>Signed: _____________________________</p>
                  <p>Name: _____________________________</p>
                  <p>Position: _____________________________</p>
                  <p>Date: _____________________________</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Footer */}
            <div className="text-center text-xs text-gray-600 mt-6">
              <p className="font-semibold text-gray-700">AVENTUS CONTRACTOR MANAGEMENT</p>
              <p>Email: contact@aventus.com</p>
              <p className="italic mt-1">This is a legally binding agreement. Please read carefully before signing.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
