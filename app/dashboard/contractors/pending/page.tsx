"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { Clock, Mail, Calendar, Search, AlertCircle, ExternalLink } from "lucide-react";

export default function PendingContractsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Load pending contracts from localStorage
  const [pendingContracts, setPendingContracts] = useState<any[]>([]);

  useEffect(() => {
    const contracts = JSON.parse(localStorage.getItem("aventus-contracts") || "[]");
    const pending = contracts
      .filter((c: any) => c.status === "pending_signature")
      .map((c: any) => {
        const expiry = new Date(c.tokenExpiry);
        const now = new Date();
        const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...c,
          daysRemaining: Math.max(0, daysRemaining),
        };
      });
    setPendingContracts(pending);
  }, []);

  const filteredContracts = pendingContracts.filter(
    (contract) =>
      contract.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResendEmail = (contract: any) => {
    alert(`Resending contract email to ${contract.email}`);
    // TODO: Implement resend email functionality
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/contract/${token}`;
    navigator.clipboard.writeText(link);
    alert("Contract link copied to clipboard!");
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Pending Contracts
        </h1>
        <p className="text-gray-400 mt-2">
          Contracts sent to contractors awaiting signatures
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Pending</p>
              <p className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {pendingContracts.length}
              </p>
            </div>
            <Clock size={32} className="text-yellow-500" />
          </div>
        </div>

        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Expiring Soon</p>
              <p className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {pendingContracts.filter((c) => c.daysRemaining <= 2).length}
              </p>
            </div>
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>

        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sent This Week</p>
              <p className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                2
              </p>
            </div>
            <Mail size={32} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            />
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === "dark" ? "bg-gray-800" : "bg-gray-50"}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Contractor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Sent Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Expires
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-400">No pending contracts found</p>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className={`${
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-50"
                    } transition-all`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {contract.firstName} {contract.surname}
                        </p>
                        <p className="text-sm text-gray-400">{contract.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        {contract.role}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        {contract.clientName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                          {new Date(contract.sentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                          {new Date(contract.tokenExpiry).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {contract.daysRemaining === 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                          Expired
                        </span>
                      ) : contract.daysRemaining <= 2 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500">
                          {contract.daysRemaining}d left
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
                          {contract.daysRemaining}d left
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(contract.contractToken)}
                          className={`p-2 rounded-lg transition-all ${
                            theme === "dark"
                              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`}
                          title="Copy contract link"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={() => handleResendEmail(contract)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            theme === "dark"
                              ? "bg-gray-800 hover:bg-gray-700 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                          }`}
                        >
                          <Mail size={16} className="inline mr-2" />
                          Resend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
