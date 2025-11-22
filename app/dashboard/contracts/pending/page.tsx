"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { FileCheck, CheckCircle, Loader2, Eye, UserCheck } from "lucide-react";
import { getApiUrl } from "@/lib/config";

export default function PendingContractsPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [validating, setValidating] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    fetchPendingContracts();
  }, []);

  const fetchPendingContracts = async () => {
    try {
      setLoading(true);
      const response = await fetch("${getApiUrl()}/api/v1/contracts/pending");
      if (!response.ok) throw new Error("Failed to fetch contracts");

      const data = await response.json();
      setContracts(data.contracts || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      alert("Failed to load pending contracts");
    } finally {
      setLoading(false);
    }
  };

  const viewContractDetails = async (contractId: number) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/contracts/${contractId}`);
      if (!response.ok) throw new Error("Failed to fetch contract details");

      const data = await response.json();
      setSelectedContract(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching contract details:", error);
      alert("Failed to load contract details");
    }
  };

  const handleValidate = async () => {
    if (!selectedContract) return;

    setValidating(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/contracts/${selectedContract.id}/validate`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to validate contract");

      alert("Contract validated successfully!");
      setShowModal(false);
      fetchPendingContracts();
    } catch (error) {
      console.error("Error validating contract:", error);
      alert("Failed to validate contract");
    } finally {
      setValidating(false);
    }
  };

  const handleActivateAccount = async () => {
    if (!selectedContract) return;

    setActivating(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/contracts/${selectedContract.id}/activate`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to activate account");

      const data = await response.json();
      alert(`Account activated successfully! Temporary password sent to ${data.contractor_email}`);
      setShowModal(false);
      fetchPendingContracts();
    } catch (error) {
      console.error("Error activating account:", error);
      alert("Failed to activate account");
    } finally {
      setActivating(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`${theme === "dark" ? "bg-orange-500/10" : "bg-orange-50"} p-3 rounded-lg`}>
            <FileCheck className="text-orange-500" size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Pending Contract Validations
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Review and validate signed contracts, then activate contractor accounts
            </p>
          </div>
        </div>

        {/* Contracts List */}
        {contracts.length === 0 ? (
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg p-12 text-center`}>
            <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              No Pending Contracts
            </h3>
            <p className="text-gray-400">
              All contracts have been validated and activated. Check back later for new signed contracts.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {contract.consultant_name}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        Pending Validation
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Client</p>
                        <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                          {contract.client_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Position</p>
                        <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                          {contract.job_title || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Signed Date</p>
                        <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                          {formatDate(contract.contractor_signed_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Status</p>
                        <p className="text-yellow-500 font-medium">
                          Awaiting Validation
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => viewContractDetails(contract.id)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all ml-4"
                  >
                    <Eye size={18} />
                    <span>Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contract Review Modal */}
        {showModal && selectedContract && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-inherit border-b border-gray-700 p-6 flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Contract Review & Validation
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">{selectedContract.consultant_name}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Contract Details */}
                <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Contract Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Consultant</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {selectedContract.consultant_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Client</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {selectedContract.client_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Job Title</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {selectedContract.job_title}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {selectedContract.working_location}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Start Date</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {selectedContract.commencement_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {selectedContract.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Day Rate</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {selectedContract.contract_rate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Signed Date</p>
                      <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        {formatDate(selectedContract.contractor_signed_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contractor Signature */}
                {selectedContract.contractor_signature_type && (
                  <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                    <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Contractor Signature
                    </h3>
                    <div className="border border-gray-700 rounded-lg p-4 bg-white">
                      {selectedContract.contractor_signature_type === "typed" ? (
                        <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "cursive" }}>
                          {selectedContract.contractor_signature_data}
                        </p>
                      ) : (
                        <img
                          src={selectedContract.contractor_signature_data}
                          alt="Contractor Signature"
                          className="max-h-24"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Contract Document Preview */}
                <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Contract Document
                  </h3>
                  <div className={`border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} rounded-lg p-4 max-h-96 overflow-y-auto`}>
                    <pre className={`whitespace-pre-wrap font-mono text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {selectedContract.contract_content}
                    </pre>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {selectedContract.status === "signed" && (
                    <button
                      onClick={handleValidate}
                      disabled={validating}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validating ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Validating...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          <span>Validate Contract</span>
                        </>
                      )}
                    </button>
                  )}

                  {selectedContract.status === "validated" && (
                    <button
                      onClick={handleActivateAccount}
                      disabled={activating}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {activating ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Activating...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={20} />
                          <span>Activate Account & Send Credentials</span>
                        </>
                      )}
                    </button>
                  )}

                  {selectedContract.status === "signed" && (
                    <button
                      onClick={async () => {
                        await handleValidate();
                        if (!validating) {
                          // Refresh contract details
                          const response = await fetch(`${getApiUrl()}/api/v1/contracts/${selectedContract.id}`);
                          const updatedContract = await response.json();
                          setSelectedContract(updatedContract);
                        }
                      }}
                      disabled={validating || activating}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validating || activating ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={20} />
                          <span>Validate & Activate Account</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
