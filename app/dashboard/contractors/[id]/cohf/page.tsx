"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Send, FileText, Download, CheckCircle, Clock, AlertCircle, FileSignature } from "lucide-react";

export default function COHFPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const contractorId = params.id as string;

  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"draft" | "sent_to_3rd_party" | "pending_docusign" | "docusigned" | "completed">("draft");

  const [cohfData, setCohfData] = useState({
    // Contractor Details
    contractorName: "",
    position: "",
    startDate: "",
    endDate: "",
    location: "",

    // Cost Breakdown
    monthlyBaseSalary: "",
    housingAllowance: "",
    transportAllowance: "",
    otherAllowances: "",
    totalMonthlyCost: "",

    // One-Time Costs
    recruitmentFee: "",
    visaFee: "",
    medicalInsurance: "",
    flightTickets: "",
    setupCosts: "",
    totalOneTimeCost: "",

    // Third Party Charges
    managementFee: "",
    serviceCharge: "",
    adminFee: "",
    totalThirdPartyCharges: "",

    // Grand Total
    grandTotal: "",

    // Additional Info
    paymentTerms: "",
    invoiceFrequency: "",
    notes: "",
  });

  const [emailData, setEmailData] = useState({
    uaeThirdPartyEmail: "",
    emailMessage: "",
    docusignLink: "",
  });

  useEffect(() => {
    fetchContractor();
  }, [contractorId]);

  const fetchContractor = async () => {
    try {
      // TODO: Replace with actual API call
      setContractor({
        id: contractorId,
        firstName: "Ahmed",
        surname: "Al-Mansoori",
        country: "UAE",
        businessType: "3rd_party_uae",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contractor:", error);
      setLoading(false);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving COHF draft:", cohfData);
    alert("COHF saved as draft!");
  };

  const handleSendTo3rdParty = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Send email to UAE 3rd Party
    console.log("Sending COHF to UAE 3rd Party:", emailData);

    alert(`COHF sent to ${emailData.uaeThirdPartyEmail}`);
    setStatus("sent_to_3rd_party");
  };

  const handleDocuSignReceived = () => {
    setStatus("pending_docusign");
  };

  const handleManagerDocuSign = () => {
    // TODO: Integrate with DocuSign API
    alert("DocuSign link sent to Manager!");
    setStatus("docusigned");
  };

  const handleComplete = () => {
    setStatus("completed");
    alert("COHF process completed! Proceeding to contract generation.");
    router.push(`/dashboard/contractors/${contractorId}/generate-contract`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/dashboard/contractors/${contractorId}`)}
          className="flex items-center gap-2 mb-4 text-gray-400 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Contractor Details
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              COHF - Cost of Hire Form (UAE)
            </h1>
            <p className="text-gray-400 mt-2">
              {contractor?.firstName} {contractor?.surname}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {status === "draft" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700">
                <FileText size={16} />
                Draft
              </span>
            )}
            {status === "sent_to_3rd_party" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
                <Clock size={16} />
                Awaiting 3rd Party Response
              </span>
            )}
            {status === "pending_docusign" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                <FileSignature size={16} />
                Pending DocuSign
              </span>
            )}
            {status === "docusigned" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                <CheckCircle size={16} />
                DocuSigned
              </span>
            )}
            {status === "completed" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                <CheckCircle size={16} />
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${status === "draft" || status === "sent_to_3rd_party" || status === "pending_docusign" || status === "docusigned" || status === "completed" ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === "draft" || status === "sent_to_3rd_party" || status === "pending_docusign" || status === "docusigned" || status === "completed" ? "bg-green-500" : "bg-gray-300"}`}>
              <CheckCircle size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium">1. Ops Completes COHF</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full ${status === "sent_to_3rd_party" || status === "pending_docusign" || status === "docusigned" || status === "completed" ? "bg-green-500" : "bg-gray-300"}`} style={{ width: status === "draft" ? "0%" : "100%" }}></div>
          </div>
          <div className={`flex items-center gap-2 ${status === "sent_to_3rd_party" || status === "pending_docusign" || status === "docusigned" || status === "completed" ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === "sent_to_3rd_party" || status === "pending_docusign" || status === "docusigned" || status === "completed" ? "bg-green-500" : "bg-gray-300"}`}>
              {status === "sent_to_3rd_party" || status === "pending_docusign" || status === "docusigned" || status === "completed" ? <CheckCircle size={16} className="text-white" /> : <span className="text-white text-xs">2</span>}
            </div>
            <span className="text-sm font-medium">2. UAE 3rd Party Adds Details</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full ${status === "pending_docusign" || status === "docusigned" || status === "completed" ? "bg-green-500" : "bg-gray-300"}`} style={{ width: status === "sent_to_3rd_party" ? "50%" : status === "pending_docusign" || status === "docusigned" || status === "completed" ? "100%" : "0%" }}></div>
          </div>
          <div className={`flex items-center gap-2 ${status === "pending_docusign" || status === "docusigned" || status === "completed" ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === "pending_docusign" || status === "docusigned" || status === "completed" ? "bg-green-500" : "bg-gray-300"}`}>
              {status === "pending_docusign" || status === "docusigned" || status === "completed" ? <CheckCircle size={16} className="text-white" /> : <span className="text-white text-xs">3</span>}
            </div>
            <span className="text-sm font-medium">3. Manager DocuSigns</span>
          </div>
        </div>
      </div>

      {/* Step 1: Complete COHF Form */}
      {status === "draft" && (
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Step 1: Complete COHF with Key Details
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Fill out the Cost of Hire Form with initial contractor details and cost estimates.
          </p>

          <form onSubmit={handleSaveDraft}>
            {/* Contractor Details */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Contractor Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Contractor Name *
                  </label>
                  <input
                    type="text"
                    value={cohfData.contractorName}
                    onChange={(e) => setCohfData({ ...cohfData, contractorName: e.target.value })}
                    required
                    placeholder="Ahmed Al-Mansoori"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={cohfData.position}
                    onChange={(e) => setCohfData({ ...cohfData, position: e.target.value })}
                    required
                    placeholder="Senior Software Engineer"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={cohfData.startDate}
                    onChange={(e) => setCohfData({ ...cohfData, startDate: e.target.value })}
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
                    End Date
                  </label>
                  <input
                    type="date"
                    value={cohfData.endDate}
                    onChange={(e) => setCohfData({ ...cohfData, endDate: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={cohfData.location}
                    onChange={(e) => setCohfData({ ...cohfData, location: e.target.value })}
                    required
                    placeholder="Dubai, UAE"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* Monthly Costs */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Monthly Costs (AED)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Monthly Base Salary *
                  </label>
                  <input
                    type="number"
                    value={cohfData.monthlyBaseSalary}
                    onChange={(e) => setCohfData({ ...cohfData, monthlyBaseSalary: e.target.value })}
                    required
                    placeholder="20000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Housing Allowance
                  </label>
                  <input
                    type="number"
                    value={cohfData.housingAllowance}
                    onChange={(e) => setCohfData({ ...cohfData, housingAllowance: e.target.value })}
                    placeholder="5000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Transport Allowance
                  </label>
                  <input
                    type="number"
                    value={cohfData.transportAllowance}
                    onChange={(e) => setCohfData({ ...cohfData, transportAllowance: e.target.value })}
                    placeholder="2000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Other Allowances
                  </label>
                  <input
                    type="number"
                    value={cohfData.otherAllowances}
                    onChange={(e) => setCohfData({ ...cohfData, otherAllowances: e.target.value })}
                    placeholder="1000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Total Monthly Cost *
                  </label>
                  <input
                    type="number"
                    value={cohfData.totalMonthlyCost}
                    onChange={(e) => setCohfData({ ...cohfData, totalMonthlyCost: e.target.value })}
                    required
                    placeholder="28000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* One-Time Costs */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                One-Time Costs (AED)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Recruitment Fee
                  </label>
                  <input
                    type="number"
                    value={cohfData.recruitmentFee}
                    onChange={(e) => setCohfData({ ...cohfData, recruitmentFee: e.target.value })}
                    placeholder="5000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Visa Fee
                  </label>
                  <input
                    type="number"
                    value={cohfData.visaFee}
                    onChange={(e) => setCohfData({ ...cohfData, visaFee: e.target.value })}
                    placeholder="3000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Medical Insurance
                  </label>
                  <input
                    type="number"
                    value={cohfData.medicalInsurance}
                    onChange={(e) => setCohfData({ ...cohfData, medicalInsurance: e.target.value })}
                    placeholder="2000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Flight Tickets
                  </label>
                  <input
                    type="number"
                    value={cohfData.flightTickets}
                    onChange={(e) => setCohfData({ ...cohfData, flightTickets: e.target.value })}
                    placeholder="1500"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Setup Costs
                  </label>
                  <input
                    type="number"
                    value={cohfData.setupCosts}
                    onChange={(e) => setCohfData({ ...cohfData, setupCosts: e.target.value })}
                    placeholder="1000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Total One-Time Cost
                  </label>
                  <input
                    type="number"
                    value={cohfData.totalOneTimeCost}
                    onChange={(e) => setCohfData({ ...cohfData, totalOneTimeCost: e.target.value })}
                    placeholder="12500"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={cohfData.paymentTerms}
                    onChange={(e) => setCohfData({ ...cohfData, paymentTerms: e.target.value })}
                    placeholder="Net 30 days"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Invoice Frequency
                  </label>
                  <select
                    value={cohfData.invoiceFrequency}
                    onChange={(e) => setCohfData({ ...cohfData, invoiceFrequency: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={cohfData.notes}
                    onChange={(e) => setCohfData({ ...cohfData, notes: e.target.value })}
                    rows={4}
                    placeholder="Additional notes or special terms..."
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                <FileText size={18} />
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus("sent_to_3rd_party")}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all"
              >
                <Send size={18} />
                Continue to Send to UAE 3rd Party
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Send to UAE 3rd Party */}
      {status === "sent_to_3rd_party" && (
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Step 2: Email UAE 3rd Party to Add More Details
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Send the COHF to the UAE third-party provider to add additional details and prepare DocuSign.
          </p>

          <form onSubmit={handleSendTo3rdParty}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  UAE 3rd Party Email *
                </label>
                <input
                  type="email"
                  value={emailData.uaeThirdPartyEmail}
                  onChange={(e) => setEmailData({ ...emailData, uaeThirdPartyEmail: e.target.value })}
                  required
                  placeholder="uae.provider@example.com"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Message
                </label>
                <textarea
                  value={emailData.emailMessage}
                  onChange={(e) => setEmailData({ ...emailData, emailMessage: e.target.value })}
                  rows={6}
                  placeholder="Dear Team,&#10;&#10;Please review the attached COHF and add the remaining details for the contractor. Once complete, please prepare the DocuSign document for manager approval.&#10;&#10;Contractor: Ahmed Al-Mansoori&#10;Position: Senior Software Engineer&#10;...&#10;"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all"
              >
                <Send size={18} />
                Send Email to UAE 3rd Party
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleDocuSignReceived}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <FileSignature size={18} />
              UAE 3rd Party Sent DocuSign (Mark as Received)
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Manager DocuSign */}
      {(status === "pending_docusign" || status === "docusigned") && (
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Step 3: Manager DocuSign
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            The UAE third-party has sent the COHF via DocuSign. Manager needs to review and sign.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-4">
                <strong>DocuSign Link:</strong> The UAE 3rd party has sent a DocuSign link to the manager's email.
              </p>
              {status === "pending_docusign" && (
                <button
                  onClick={handleManagerDocuSign}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all"
                >
                  <FileSignature size={18} />
                  Manager Signed via DocuSign
                </button>
              )}
              {status === "docusigned" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={18} />
                  <span className="font-medium">Manager has signed the COHF via DocuSign</span>
                </div>
              )}
            </div>

            {status === "docusigned" && (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <CheckCircle size={18} />
                Complete COHF Process & Proceed to Contract
              </button>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
