"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Send, FileText, CheckCircle, Clock } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

export default function QuoteSheetsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const contractorId = params.id as string;

  const [contractor, setContractor] = useState<any>(null);
  const [thirdParties, setThirdParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"pending_request" | "requested">("pending_request");

  const [requestForm, setRequestForm] = useState({
    thirdPartyId: "",
    thirdPartyEmail: "",
    emailCC: "",
    emailSubject: "Quote Sheet Request for Contractor",
    requestMessage: "",
  });

  useEffect(() => {
    fetchContractor();
    fetchThirdParties();
  }, [contractorId]);

  const fetchContractor = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(API_ENDPOINTS.contractorById(contractorId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContractor(data);

        // Pre-fill the message with contractor details
        setRequestForm(prev => ({
          ...prev,
          requestMessage: `Dear Team,\n\nWe kindly request a quote sheet for the following contractor:\n\nContractor Name: ${data.first_name} ${data.surname}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nPlease use the button below to upload the quote sheet document.\n\nThank you for your cooperation.`
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contractor:", error);
      setLoading(false);
    }
  };

  const fetchThirdParties = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(`${API_ENDPOINTS.contractors.replace('/contractors/', '/third-parties/')}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setThirdParties(data);
      }
    } catch (error) {
      console.error("Error fetching third parties:", error);
    }
  };

  const handleThirdPartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    if (selectedId) {
      const selectedThirdParty = thirdParties.find(tp => tp.id === selectedId);
      if (selectedThirdParty) {
        setRequestForm(prev => ({
          ...prev,
          thirdPartyId: selectedId,
          thirdPartyEmail: selectedThirdParty.contact_person_email || "",
        }));
      }
    } else {
      setRequestForm(prev => ({
        ...prev,
        thirdPartyId: "",
        thirdPartyEmail: "",
      }));
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestForm.thirdPartyEmail || !requestForm.emailSubject || !requestForm.requestMessage) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(`${API_ENDPOINTS.contractorById(contractorId)}/request-quote-sheet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          third_party_id: requestForm.thirdPartyId || null,
          third_party_email: requestForm.thirdPartyEmail,
          email_cc: requestForm.emailCC || null,
          email_subject: requestForm.emailSubject,
          email_message: requestForm.requestMessage,
        }),
      });

      if (response.ok) {
        setStatus("requested");
        alert("Quote sheet request sent successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send request");
      }
    } catch (error: any) {
      console.error("Error sending request:", error);
      alert(`Failed to send request: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
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
              Request Quote Sheet - Saudi Arabia
            </h1>
            <p className="text-gray-400 mt-2">
              {contractor?.first_name} {contractor?.surname}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {status === "pending_request" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700">
                <Clock size={16} />
                Ready to Send
              </span>
            )}
            {status === "requested" && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                <CheckCircle size={16} />
                Request Sent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Request Form */}
      {status === "pending_request" && (
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Send Quote Sheet Request
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Send an email to the third-party provider with a link to upload the quote sheet document.
          </p>

          <form onSubmit={handleSendRequest}>
            <div className="space-y-5">
              {/* Third Party Dropdown - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Select Third Party
                </label>
                <select
                  value={requestForm.thirdPartyId}
                  onChange={handleThirdPartyChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="">-- Select from existing third parties or enter email below --</option>
                  {thirdParties.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.company_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Two Column Layout for Email Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Third Party Email *
                  </label>
                  <input
                    type="email"
                    value={requestForm.thirdPartyEmail}
                    onChange={(e) => setRequestForm({ ...requestForm, thirdPartyEmail: e.target.value })}
                    required
                    placeholder="provider@example.com"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    CC Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={requestForm.emailCC}
                    onChange={(e) => setRequestForm({ ...requestForm, emailCC: e.target.value })}
                    placeholder="cc@example.com"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>

              {/* Email Subject - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Subject *
                </label>
                <input
                  type="text"
                  value={requestForm.emailSubject}
                  onChange={(e) => setRequestForm({ ...requestForm, emailSubject: e.target.value })}
                  required
                  placeholder="Quote Sheet Request for Contractor"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              {/* Message Area - Full Width with More Height */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Request Message *
                </label>
                <textarea
                  value={requestForm.requestMessage}
                  onChange={(e) => setRequestForm({ ...requestForm, requestMessage: e.target.value })}
                  required
                  rows={14}
                  placeholder="Enter your message to the third party..."
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/contractors/${contractorId}`)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {submitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Request Sent Confirmation */}
      {status === "requested" && (
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6`}>
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Request Sent Successfully!
            </h2>
            <p className="text-gray-400 mb-4">
              The quote sheet request has been sent to{" "}
              <strong className="text-[#FF6B00]">{requestForm.thirdPartyEmail}</strong>
              {requestForm.emailCC && (
                <>
                  {" "}with a CC to{" "}
                  <strong className="text-[#FF6B00]">{requestForm.emailCC}</strong>
                </>
              )}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              The third party will receive an email with an upload link. Once they upload the quote sheet,
              it will be automatically added to the contractor's documents, and you will be notified to
              proceed with the CDS (Costing & Deal Sheet) form.
            </p>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Next Steps:</strong>
              </p>
              <ol className="text-sm text-gray-500 text-left space-y-1 list-decimal list-inside">
                <li>Third party uploads quote sheet document</li>
                <li>Document is automatically saved to contractor</li>
                <li>Contractor status changes to "Pending CDS"</li>
                <li>You fill out the CDS form</li>
                <li>Submit for superadmin review and approval</li>
              </ol>
            </div>

            <button
              onClick={() => router.push(`/dashboard/contractors/${contractorId}`)}
              className="px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all"
            >
              Return to Contractor Details
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
