"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { getApiUrl } from "@/lib/config";
import {
  ArrowLeft,
  FileText,
  User,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Edit2,
  Download,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface WorkOrder {
  id: string;
  work_order_number: string;
  contractor_id: string;
  third_party_id: string | null;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  hourly_rate: number | null;
  fixed_price: number | null;
  estimated_hours: number | null;
  actual_hours: number;
  status: string;
  notes: string | null;
  documents: any[];
  created_by: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function ViewWorkOrderPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const workOrderId = params?.id as string;

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workOrderId) {
      fetchWorkOrder();
    }
  }, [workOrderId]);

  const fetchWorkOrder = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/work-orders/${workOrderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch work order");
      }

      const data = await response.json();
      setWorkOrder(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching work order:", err);
      setError("Failed to load work order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      draft: { color: "gray", label: "Draft" },
      pending: { color: "yellow", label: "Pending" },
      approved: { color: "green", label: "Approved" },
      in_progress: { color: "blue", label: "In Progress" },
      completed: { color: "purple", label: "Completed" },
      cancelled: { color: "red", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold bg-${config.color}-500/10 text-${config.color}-500`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading work order...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !workOrder) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{error || "Work order not found"}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-gray-400" />
          </button>
          <div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {workOrder.work_order_number}
            </h1>
            <p className="text-gray-400 mt-2">{workOrder.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {getStatusBadge(workOrder.status)}
          <button
            onClick={() => router.push(`/dashboard/work-orders/edit/${workOrder.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white transition-all"
          >
            <Edit2 size={16} />
            Edit Work Order
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Work Order Information */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <FileText size={20} className="text-white" />
              <span>Work Order Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Work Order Number
              </label>
              <p
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {workOrder.work_order_number}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Title
              </label>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {workOrder.title}
              </p>
            </div>

            {workOrder.description && (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  Description
                </label>
                <p className="text-gray-400">{workOrder.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Assignment */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <User size={20} className="text-white" />
              <span>Assignment</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Contractor ID
              </label>
              <p className="text-gray-400">{workOrder.contractor_id}</p>
            </div>

            {workOrder.third_party_id && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  Third Party ID
                </label>
                <p className="text-gray-400">{workOrder.third_party_id}</p>
              </div>
            )}

            {workOrder.location && (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  Location
                </label>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={16} />
                  <span>{workOrder.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <Calendar size={20} className="text-white" />
              <span>Timeline</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Start Date
              </label>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={16} />
                <span>{new Date(workOrder.start_date).toLocaleDateString()}</span>
              </div>
            </div>

            {workOrder.end_date && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  End Date
                </label>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span>{new Date(workOrder.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Details */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <DollarSign size={20} className="text-white" />
              <span>Financial Details</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workOrder.hourly_rate !== null && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  Hourly Rate
                </label>
                <div className="flex items-center gap-2 text-green-500 text-lg font-semibold">
                  <DollarSign size={18} />
                  <span>{workOrder.hourly_rate.toFixed(2)}/hr</span>
                </div>
              </div>
            )}

            {workOrder.fixed_price !== null && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  Fixed Price
                </label>
                <div className="flex items-center gap-2 text-green-500 text-lg font-semibold">
                  <DollarSign size={18} />
                  <span>{workOrder.fixed_price.toFixed(2)}</span>
                </div>
              </div>
            )}

            {workOrder.estimated_hours !== null && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  Estimated Hours
                </label>
                <div className="flex items-center gap-2 text-blue-500 text-lg font-semibold">
                  <Clock size={18} />
                  <span>{workOrder.estimated_hours}h</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Actual Hours
              </label>
              <div className="flex items-center gap-2 text-purple-500 text-lg font-semibold">
                <Clock size={18} />
                <span>{workOrder.actual_hours}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        {workOrder.documents && workOrder.documents.length > 0 && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm`}
          >
            <div className="mb-6">
              <div
                className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
                }}
              >
                <FileText size={20} className="text-white" />
                <span>Documents</span>
              </div>
              <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
            </div>

            <div className="space-y-2">
              {workOrder.documents.map((doc: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-[#FF6B00]" />
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {doc.filename}
                      </p>
                      <p className="text-xs text-gray-400">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(doc.url, "_blank")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 transition-all text-sm font-medium"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <a
                      href={doc.url}
                      download
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all text-sm font-medium"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {workOrder.notes && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm`}
          >
            <div className="mb-6">
              <div
                className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
                }}
              >
                <FileText size={20} className="text-white" />
                <span>Additional Information</span>
              </div>
              <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Notes
              </label>
              <p className="text-gray-400 whitespace-pre-wrap">{workOrder.notes}</p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Created By
              </label>
              <p className="text-gray-400">{workOrder.created_by}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Created At
              </label>
              <p className="text-gray-400">
                {new Date(workOrder.created_at).toLocaleString()}
              </p>
            </div>

            {workOrder.updated_at && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  Last Updated
                </label>
                <p className="text-gray-400">
                  {new Date(workOrder.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
