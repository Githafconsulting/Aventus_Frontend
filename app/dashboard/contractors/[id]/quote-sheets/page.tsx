"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Send, FileText, Download, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function QuoteSheetsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const contractorId = params.id as string;

  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending_request" | "requested" | "received" | "approved">("pending_request");

  const [requestForm, setRequestForm] = useState({
    saudiThirdPartyEmail: "",
    requestMessage: "",
  });

  const [quoteSheetData, setQuoteSheetData] = useState({
    quotationNumber: "",
    quotationDate: "",
    monthlyRate: "",
    setupFee: "",
    otherCharges: "",
    totalCost: "",
    notes: "",
    attachmentUrl: "",
  });

  useEffect(() => {
    fetchContractor();
  }, [contractorId]);

  const fetchContractor = async () => {
    try {
      // TODO: Replace with actual API call
      setContractor({
        id: contractorId,
        firstName: "John",
        surname: "Doe",
        country: "Saudi Arabia",
        businessType: "3rd_party_saudi",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contractor:", error);
      setLoading(false);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Send email to Saudi 3rd Party
    console.log("Sending Quote Sheet request:", requestForm);

    alert(`Quote Sheet request sent to ${requestForm.saudiThirdPartyEmail}`);
    setStatus("requested");
  };

  const handleQuoteSheetReceived = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Save quote sheet data
    console.log("Quote Sheet data:", quoteSheetData);

    alert("Quote Sheet data saved successfully!");
    setStatus("received");
  };

  const handleApprove = () => {
    setStatus("approved");
    alert("Quote Sheet approved! Proceeding to next step.");
    router.push(`/dashboard/contractors/${contractorId}/costing-sheet`);
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
              Quote Sheets - Saudi 3rd Party
            </h1>
            <p className="text-gray-400 mt-2">
              {contractor?.firstName} {contractor?.surname}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {status === "pending_request" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700">
                <Clock size={16} />
                Pending Request
              </span>
            )}
            {status === "requested" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
                <AlertCircle size={16} />
                Awaiting Response
              </span>
            )}
            {status === "received" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                <FileText size={16} />
                Quote Sheet Received
              </span>
            )}
            {status === "approved" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                <CheckCircle size={16} />
                Approved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Step 1: Send Request to Saudi 3rd Party */}
      {(status === "pending_request" || status === "requested") && (
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Step 1: Request Quote Sheet from Saudi 3rd Party
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Send an email to the Saudi third-party provider requesting the quote sheet for this contractor.
          </p>

          <form onSubmit={handleSendRequest}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Saudi 3rd Party Email *
                </label>
                <input
                  type="email"
                  value={requestForm.saudiThirdPartyEmail}
                  onChange={(e) => setRequestForm({ ...requestForm, saudiThirdPartyEmail: e.target.value })}
                  required
                  disabled={status === "requested"}
                  placeholder="saudi.provider@example.com"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Request Message
                </label>
                <textarea
                  value={requestForm.requestMessage}
                  onChange={(e) => setRequestForm({ ...requestForm, requestMessage: e.target.value })}
                  disabled={status === "requested"}
                  rows={6}
                  placeholder="Dear Team,&#10;&#10;Please provide a quote sheet for the following contractor:&#10;Name: John Doe&#10;Position: Software Engineer&#10;...&#10;"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                ></textarea>
              </div>

              {status === "pending_request" && (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all"
                >
                  <Send size={18} />
                  Send Request to Saudi 3rd Party
                </button>
              )}

              {status === "requested" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={18} />
                  <span>Request sent on {new Date().toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </form>

          {status === "requested" && (
            <button
              onClick={() => setStatus("received")}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <FileText size={18} />
              Mark as Received (Enter Quote Sheet Data)
            </button>
          )}
        </div>
      )}

      {/* Step 2: Enter Quote Sheet Data */}
      {(status === "received" || status === "approved") && (
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Step 2: Enter Quote Sheet Details
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter the quote sheet information received from the Saudi third-party provider.
          </p>

          <form onSubmit={handleQuoteSheetReceived}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Quotation Number
                </label>
                <input
                  type="text"
                  value={quoteSheetData.quotationNumber}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, quotationNumber: e.target.value })}
                  disabled={status === "approved"}
                  placeholder="QS-2025-001"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Quotation Date
                </label>
                <input
                  type="date"
                  value={quoteSheetData.quotationDate}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, quotationDate: e.target.value })}
                  disabled={status === "approved"}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Monthly Rate (SAR) *
                </label>
                <input
                  type="number"
                  value={quoteSheetData.monthlyRate}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, monthlyRate: e.target.value })}
                  disabled={status === "approved"}
                  required
                  placeholder="15000"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Setup Fee (SAR)
                </label>
                <input
                  type="number"
                  value={quoteSheetData.setupFee}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, setupFee: e.target.value })}
                  disabled={status === "approved"}
                  placeholder="2000"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Other Charges (SAR)
                </label>
                <input
                  type="number"
                  value={quoteSheetData.otherCharges}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, otherCharges: e.target.value })}
                  disabled={status === "approved"}
                  placeholder="500"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Total Cost (SAR) *
                </label>
                <input
                  type="number"
                  value={quoteSheetData.totalCost}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, totalCost: e.target.value })}
                  disabled={status === "approved"}
                  required
                  placeholder="17500"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Notes
                </label>
                <textarea
                  value={quoteSheetData.notes}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, notes: e.target.value })}
                  disabled={status === "approved"}
                  rows={4}
                  placeholder="Additional notes or special terms..."
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Attachment URL
                </label>
                <input
                  type="url"
                  value={quoteSheetData.attachmentUrl}
                  onChange={(e) => setQuoteSheetData({ ...quoteSheetData, attachmentUrl: e.target.value })}
                  disabled={status === "approved"}
                  placeholder="https://storage.aventus.com/quote-sheets/..."
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:opacity-50`}
                />
              </div>
            </div>

            {status === "received" && (
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <CheckCircle size={18} />
                  Save Quote Sheet Data
                </button>
              </div>
            )}
          </form>

          {status === "received" && quoteSheetData.monthlyRate && (
            <button
              onClick={handleApprove}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all"
            >
              <CheckCircle size={18} />
              Approve & Continue to CDS/Costing Sheet
            </button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
