"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl } from "@/lib/config";
import {
  Search,
  Plus,
  FileText,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  User,
  Building2,
  DollarSign,
  Clock,
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
  status: "draft" | "pending" | "approved" | "in_progress" | "completed" | "cancelled";
  notes: string | null;
  documents: any[];
  created_by: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function WorkOrdersPage() {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch work orders on mount
  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(
        "${getApiUrl()}/api/v1/work-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch work orders");
      }

      const data = await response.json();
      setWorkOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching work orders:", err);
      setError("Failed to load work orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkOrder = async (id: string, workOrderNumber: string) => {
    if (!confirm(`Are you sure you want to delete work order ${workOrderNumber}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/v1/work-orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete work order");
      }

      alert("Work order deleted successfully");
      fetchWorkOrders();
    } catch (err: any) {
      console.error("Error deleting work order:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Filter work orders
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.work_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wo.location && wo.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || wo.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

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
        className={`px-3 py-1 rounded-full text-xs font-semibold bg-${config.color}-500/10 text-${config.color}-500 w-fit`}
      >
        {config.label}
      </span>
    );
  };

  const stats = {
    total: workOrders.length,
    draft: workOrders.filter((wo) => wo.status === "draft").length,
    pending: workOrders.filter((wo) => wo.status === "pending").length,
    approved: workOrders.filter((wo) => wo.status === "approved").length,
    in_progress: workOrders.filter((wo) => wo.status === "in_progress").length,
    completed: workOrders.filter((wo) => wo.status === "completed").length,
  };

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
            Work Orders
          </h1>
          <p className="text-gray-400 mt-2">
            Manage work orders for contractors and third parties
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/work-orders/add")}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add Work Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Total</p>
          <p
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.total}
          </p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Draft</p>
          <p className="text-2xl font-bold text-gray-500">{stats.draft}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-500">{stats.in_progress}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Completed</p>
          <p className="text-2xl font-bold text-purple-500">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-6 shadow-sm mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by work order number, title or location..."
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
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading work orders...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Work Orders List */}
      {!loading && !error && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg shadow-sm overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Work Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Financial
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredWorkOrders.map((wo) => (
                  <tr
                    key={wo.id}
                    className={`${
                      theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {/* Work Order */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {wo.work_order_number}
                          </div>
                          <div className="text-xs text-gray-400">{wo.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {wo.location && (
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 size={12} />
                            <span>{wo.location}</span>
                          </div>
                        )}
                        {wo.description && (
                          <div className="text-xs mt-1 truncate max-w-[200px]">
                            {wo.description}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Timeline */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={12} />
                          <span>{new Date(wo.start_date).toLocaleDateString()}</span>
                        </div>
                        {wo.end_date && (
                          <div className="text-xs">
                            To: {new Date(wo.end_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Financial */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {wo.hourly_rate && (
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign size={12} />
                            <span>${wo.hourly_rate}/hr</span>
                          </div>
                        )}
                        {wo.fixed_price && (
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign size={12} />
                            <span>${wo.fixed_price} (fixed)</span>
                          </div>
                        )}
                        {wo.estimated_hours && (
                          <div className="flex items-center gap-2 text-xs">
                            <Clock size={10} />
                            <span>{wo.estimated_hours}h est.</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(wo.status)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/work-orders/view/${wo.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 transition-all text-sm font-medium"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/work-orders/edit/${wo.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all text-sm font-medium"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWorkOrder(wo.id, wo.work_order_number)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && filteredWorkOrders.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3
            className={`text-lg font-semibold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            No Work Orders Found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
