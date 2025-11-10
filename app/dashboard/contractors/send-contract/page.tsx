"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Send, Mail, X } from "lucide-react";
import { populateContractTemplate } from "@/types/contractTemplate";

export default function SendContractPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [contractData, setContractData] = useState({
    contractLink: "",
    expiryDate: "",
  });

  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    surname: "",
    email: "",
    dob: "",
    nationality: "",

    // Position Info
    role: "",
    clientName: "",
    startDate: "",
    endDate: "",
    duration: "",
    location: "",

    // Compensation
    currency: "SAR",
    payRate: "",
    chargeRate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateContractToken = () => {
    const token = crypto.randomUUID();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    return { token, expiryDate };
  };

  const handleSendContract = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName || !formData.surname || !formData.email) {
      alert("Please fill in First Name, Surname, and Email.");
      return;
    }

    const { token, expiryDate } = generateContractToken();

    // Prepare contractor data for storage
    const contractorData = {
      id: crypto.randomUUID(),
      ...formData,
      status: "pending_signature",
      contractToken: token,
      tokenExpiry: expiryDate.toISOString(),
      sentDate: new Date().toISOString(),
    };

    console.log("Sending contract:", contractorData);
    // TODO: Save to backend

    // Store in localStorage for demo
    const contracts = JSON.parse(localStorage.getItem("aventus-contracts") || "[]");
    contracts.push(contractorData);
    localStorage.setItem("aventus-contracts", JSON.stringify(contracts));

    const contractLink = `${window.location.origin}/contract/${token}`;
    setContractData({
      contractLink,
      expiryDate: expiryDate.toLocaleDateString(),
    });
    setShowEmailModal(true);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/contractors")}
          className="flex items-center gap-2 mb-4 text-gray-400 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Contractors
        </button>

        <div>
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Send Employment Contract
          </h1>
          <p className="text-gray-400 mt-2">
            Enter basic contractor information to generate and send the employment agreement
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"} border ${theme === "dark" ? "border-blue-500/20" : "border-blue-200"} rounded-lg p-4 mb-6`}>
        <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-blue-800"}`}>
          <strong>Workflow:</strong> Fill out basic details → Send contract → Contractor signs → Complete CDS → Activate account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSendContract}>
        {/* Basic Information */}
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Contractor Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Surname *
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>
        </div>

        {/* Position Details */}
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Position Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Role/Position
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Duration (months)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Riyadh, Saudi Arabia"
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Compensation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="SAR">SAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Contractor Pay Rate
              </label>
              <input
                type="number"
                name="payRate"
                value={formData.payRate}
                onChange={handleChange}
                placeholder="Monthly rate"
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Client Charge Rate
              </label>
              <input
                type="number"
                name="chargeRate"
                value={formData.chargeRate}
                onChange={handleChange}
                placeholder="Monthly rate"
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/contractors")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all flex items-center gap-2"
          >
            <Send size={18} />
            Send Employment Contract
          </button>
        </div>
      </form>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="sticky top-0 bg-[#FF6B00] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={24} className="text-white" />
                <h2 className="text-xl font-bold text-white">Contract Email Preview</h2>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">To:</p>
                <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {formData.email}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Subject:</p>
                <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Action Required: Review and Sign Your Employment Contract
                </p>
              </div>

              <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} rounded-lg p-6`}>
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Dear {formData.firstName} {formData.surname},
                </p>
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  We are pleased to extend an offer of employment to you. Please review and sign your employment contract using the secure link below.
                </p>

                <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} p-4 rounded-lg border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} my-6`}>
                  <p className="text-sm text-gray-400 mb-2">Contract Link:</p>
                  <a
                    href={contractData.contractLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B00] hover:underline break-all font-mono text-sm"
                  >
                    {contractData.contractLink}
                  </a>
                </div>

                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Important:</strong> This link will expire on <span className="text-[#FF6B00] font-semibold">{contractData.expiryDate}</span>. Please review and sign before this date.
                </p>

                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Best regards,<br />
                  <strong>AVENTUS Team</strong>
                </p>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    alert("Contract email sent successfully!");
                    setShowEmailModal(false);
                    router.push("/dashboard/contractors/pending");
                  }}
                  className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all flex items-center gap-2"
                >
                  <Send size={18} />
                  Confirm & Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
