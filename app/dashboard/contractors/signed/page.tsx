"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  CheckCircle,
  Mail,
  Calendar,
  Search,
  Eye,
  UserCheck,
  X,
  Send,
  Copy,
  FileText,
} from "lucide-react";

export default function SignedContractsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");

  // Load signed contracts from localStorage
  const [signedContracts, setSignedContracts] = useState<any[]>([]);

  useEffect(() => {
    const loadContracts = () => {
      const contracts = JSON.parse(localStorage.getItem("aventus-contracts") || "[]");
      const signed = contracts.filter((c: any) => c.status === "signed" && !c.cdsCompleted);
      setSignedContracts(signed);
    };

    loadContracts();
    // Optionally, set up an interval to refresh data
    const interval = setInterval(loadContracts, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredContracts = signedContracts.filter(
    (contract) =>
      contract.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateTemporaryPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleActivateAccount = (contract: any) => {
    setSelectedContract(contract);
    const tempPass = generateTemporaryPassword();
    setTemporaryPassword(tempPass);
    setShowActivationModal(true);
  };

  const handleConfirmActivation = () => {
    console.log("Activating account for:", selectedContract);
    console.log("Temporary password:", temporaryPassword);
    // TODO: Send activation email and update contract status

    // Remove from signed contracts (it's now active)
    setSignedContracts(signedContracts.filter((c) => c.id !== selectedContract.id));

    alert("Account activated successfully!");
    setShowActivationModal(false);
    setSelectedContract(null);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(temporaryPassword);
    alert("Password copied to clipboard!");
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
          Signed Contracts
        </h1>
        <p className="text-gray-400 mt-2">
          Contracts signed by contractors awaiting account activation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Awaiting Activation</p>
              <p className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {signedContracts.length}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>

        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Signed This Week</p>
              <p className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {signedContracts.length}
              </p>
            </div>
            <Calendar size={32} className="text-blue-500" />
          </div>
        </div>

        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Response Time</p>
              <p className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                2.5d
              </p>
            </div>
            <Mail size={32} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
        <div className="relative">
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
                  Signed Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Signature Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-400">No signed contracts awaiting activation</p>
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
                          {new Date(contract.signedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          contract.signature.type === "typed"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-purple-500/10 text-purple-500"
                        }`}
                      >
                        {contract.signature.type === "typed" ? "Typed" : "Drawn"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert("View contract details - TODO")}
                          className={`p-2 rounded-lg transition-all ${
                            theme === "dark"
                              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`}
                          title="View contract"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/contractors/complete-cds/${contract.id}`)}
                          className="px-4 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white transition-all flex items-center gap-2"
                        >
                          <FileText size={16} />
                          Complete CDS
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

      {/* Activation Modal */}
      {showActivationModal && selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-green-500 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck size={24} className="text-white" />
                <h2 className="text-xl font-bold text-white">
                  Activate Account
                </h2>
              </div>
              <button
                onClick={() => setShowActivationModal(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Email Preview */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">To:</p>
                <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {selectedContract.email}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Subject:</p>
                <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Welcome to AVENTUS - Your Account is Ready!
                </p>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                } rounded-lg p-6 mb-6`}
              >
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Dear {selectedContract.firstName} {selectedContract.surname},
                </p>
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Congratulations! Your employment contract has been processed and your
                  account is now active.
                </p>
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Here are your login credentials:
                </p>

                <div
                  className={`${
                    theme === "dark" ? "bg-gray-900" : "bg-white"
                  } p-4 rounded-lg border ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  } my-6`}
                >
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Email:</p>
                    <p className={`font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {selectedContract.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Temporary Password:</p>
                    <div className="flex items-center gap-2">
                      <p className={`font-mono font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {temporaryPassword}
                      </p>
                      <button
                        onClick={handleCopyPassword}
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "hover:bg-gray-800 text-gray-400"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                        title="Copy password"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Important Security Notice:</strong> For your security, you will be
                  required to change this password upon your first login.
                </p>

                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  You can access your contractor dashboard at:{" "}
                  <a href={window.location.origin} className="text-[#FF6B00] hover:underline">
                    {window.location.origin}
                  </a>
                </p>

                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Best regards,
                  <br />
                  <strong>AVENTUS Team</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowActivationModal(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmActivation}
                  className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-all flex items-center gap-2"
                >
                  <Send size={18} />
                  Activate Account & Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
