"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Plus,
  Upload,
  Download,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Receipt,
} from "lucide-react";

// Expense categories
const expenseCategories = [
  { value: "travel", label: "Travel" },
  { value: "meals", label: "Meals & Entertainment" },
  { value: "accommodation", label: "Accommodation" },
  { value: "supplies", label: "Office Supplies" },
  { value: "equipment", label: "Equipment" },
  { value: "software", label: "Software & Subscriptions" },
  { value: "other", label: "Other" },
];

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  receipt?: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  notes?: string;
  rejectionReason?: string;
}

// Sample data
const expensesData: Expense[] = [
  {
    id: 1,
    date: "2024-11-15",
    category: "travel",
    description: "Client meeting transportation",
    amount: 45.50,
    receipt: "receipt-001.pdf",
    status: "pending",
    submittedDate: "2024-11-16",
  },
  {
    id: 2,
    date: "2024-11-10",
    category: "meals",
    description: "Business lunch with client",
    amount: 85.00,
    receipt: "receipt-002.pdf",
    status: "approved",
    submittedDate: "2024-11-11",
  },
  {
    id: 3,
    date: "2024-11-08",
    category: "software",
    description: "Monthly Adobe subscription",
    amount: 52.99,
    receipt: "receipt-003.pdf",
    status: "approved",
    submittedDate: "2024-11-09",
  },
  {
    id: 4,
    date: "2024-11-05",
    category: "equipment",
    description: "Wireless keyboard and mouse",
    amount: 129.99,
    receipt: "receipt-004.pdf",
    status: "rejected",
    submittedDate: "2024-11-06",
    rejectionReason: "Equipment purchases require pre-approval. Please submit approval request first.",
  },
];

export default function ExpensesPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: "all", label: "All Expenses", count: expensesData.length },
    { id: "pending", label: "Pending", count: expensesData.filter(e => e.status === "pending").length },
    { id: "approved", label: "Approved", count: expensesData.filter(e => e.status === "approved").length },
    { id: "rejected", label: "Rejected", count: expensesData.filter(e => e.status === "rejected").length },
  ];

  const filteredExpenses = activeTab === "all"
    ? expensesData
    : expensesData.filter(e => e.status === activeTab);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedAmount = expensesData.filter(e => e.status === "approved").reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = expensesData.filter(e => e.status === "pending").reduce((sum, expense) => sum + expense.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 flex items-center gap-1">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 flex items-center gap-1">
            <Clock size={12} />
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 flex items-center gap-1">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      travel: "🚗",
      meals: "🍽️",
      accommodation: "🏨",
      supplies: "📦",
      equipment: "💻",
      software: "💿",
      other: "📄",
    };
    return icons[category] || "📄";
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
            Expenses
          </h1>
          <p className="text-gray-400 mt-2">
            Submit and track your business expenses
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Submitted</p>
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-[#FF6B00]/10 rounded-lg">
              <DollarSign className="text-[#FF6B00]" size={24} />
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-500">
                ${approvedAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-500">
                ${pendingAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`border-b ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        } mb-6`}
      >
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-[#FF6B00] border-b-2 border-[#FF6B00]"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-[#FF6B00] text-white"
                    : theme === "dark"
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-12 shadow-sm text-center`}
          >
            <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
            <h3
              className={`text-lg font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              No Expenses Found
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't submitted any expenses yet.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2 px-6 rounded-lg transition-all"
            >
              Add Your First Expense
            </button>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } rounded-lg p-6 shadow-sm hover:shadow-md transition-all ${
                expense.status === "rejected" ? "border-l-4 border-red-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div
                    className={`p-4 rounded-lg text-2xl ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    {getCategoryIcon(expense.category)}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {expense.description}
                      </h3>
                      {getStatusBadge(expense.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>
                        {expenseCategories.find((c) => c.value === expense.category)?.label}
                      </span>
                      {expense.receipt && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Receipt size={14} />
                            Receipt attached
                          </span>
                        </>
                      )}
                    </div>

                    {/* Rejection Reason */}
                    {expense.status === "rejected" && expense.rejectionReason && (
                      <div
                        className={`mt-3 p-3 rounded-lg ${
                          theme === "dark" ? "bg-red-500/10" : "bg-red-50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                          <div>
                            <p className="text-red-500 font-medium text-sm mb-1">
                              Rejection Reason:
                            </p>
                            <p className="text-gray-400 text-sm">{expense.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="text-right ml-4">
                  <p
                    className={`text-2xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${expense.amount.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    {expense.receipt && (
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        }`}
                        title="View Receipt"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {expense.status === "pending" && (
                      <button
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Expense Modal (Simple placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg max-w-2xl w-full`}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add New Expense
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  {expenseCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description of expense"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Receipt (Optional)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    theme === "dark"
                      ? "border-gray-700 hover:border-[#FF6B00] bg-gray-800"
                      : "border-gray-300 hover:border-[#FF6B00] bg-gray-50"
                  }`}
                >
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-400 text-sm">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 rounded-lg transition-all">
                Submit Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
