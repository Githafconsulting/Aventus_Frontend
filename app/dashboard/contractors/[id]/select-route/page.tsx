"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import { ArrowLeft, Building2, Users, FileText, Mail, Send } from "lucide-react";

interface ThirdParty {
  id: string;
  company_name: string;
  contact_person_name: string;
  contact_person_email: string;
}

export default function SelectRoutePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const contractorId = params.id as string;

  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<"wps_freelancer" | "third_party" | null>(null);
  const [showThirdPartyForm, setShowThirdPartyForm] = useState(false);

  // Third party form state
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [selectedThirdParty, setSelectedThirdParty] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    fetchContractor();
    fetchThirdParties();
  }, [contractorId]);

  const fetchContractor = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(API_ENDPOINTS.contractorById(contractorId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setContractor(data);
      }
    } catch (error) {
      console.error("Error fetching contractor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThirdParties = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(`${API_ENDPOINTS.thirdParties}?include_inactive=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setThirdParties(data);
      }
    } catch (error) {
      console.error("Error fetching third parties:", error);
    }
  };

  const handleRouteSelection = async (route: "wps_freelancer" | "third_party") => {
    setSelectedRoute(route);

    if (route === "third_party") {
      // First, submit the route selection to save it in the database
      await submitRouteSelection(route);

      // Then show the form with pre-filled email template
      setShowThirdPartyForm(true);
      setEmailSubject(`Quote Request for ${contractor?.first_name} ${contractor?.surname}`);
      setEmailBody(`Dear Team,

We would like to request a quote for the following contractor:

Name: ${contractor?.first_name} ${contractor?.surname}
Email: ${contractor?.email}
Nationality: ${contractor?.nationality || "N/A"}

Please provide us with your rates, terms, and any applicable fees.

Best regards,
${user?.name}
Aventus Resources`);
    } else {
      // WPS/Freelancer - directly select route and go to CDS
      await submitRouteSelection(route);
    }
  };

  const submitRouteSelection = async (route: "wps_freelancer" | "third_party") => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(`${API_ENDPOINTS.contractorById(contractorId)}/select-route`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ route }),
      });

      if (response.ok) {
        if (route === "wps_freelancer") {
          // Redirect to CDS form
          router.push(`/dashboard/contractors/complete-cds/${contractorId}`);
        }
      } else {
        alert("Failed to select route");
      }
    } catch (error) {
      console.error("Error selecting route:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendThirdPartyRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedThirdParty) {
      alert("Please select a third party company");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        `${API_ENDPOINTS.contractorById(contractorId)}/send-third-party-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            third_party_id: selectedThirdParty,
            email_subject: emailSubject,
            email_body: emailBody,
          }),
        }
      );

      if (response.ok) {
        alert("Third party request sent successfully!");
        router.push("/dashboard/contractors");
      } else {
        alert("Failed to send third party request");
      }
    } catch (error) {
      console.error("Error sending third party request:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/contractors")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Contractors
        </button>

        <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Select Onboarding Route
        </h1>
        <p className="text-gray-400 mt-2">
          Choose the onboarding route for {contractor?.first_name} {contractor?.surname}
        </p>
      </div>

      {!showThirdPartyForm ? (
        /* Route Selection Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {/* WPS/Freelancer Route */}
          <div
            onClick={() => handleRouteSelection("wps_freelancer")}
            className={`${
              theme === "dark" ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
            } card-parallelogram p-6 cursor-pointer transition-all border-2 ${
              selectedRoute === "wps_freelancer"
                ? "border-[#FF6B00]"
                : theme === "dark"
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500/10 btn-parallelogram mb-3">
                <Users className="text-blue-500" size={32} />
              </div>

              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                WPS / Freelancer
              </h3>
            </div>
          </div>

          {/* Third Party Route */}
          <div
            onClick={() => handleRouteSelection("third_party")}
            className={`${
              theme === "dark" ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
            } card-parallelogram p-6 cursor-pointer transition-all border-2 ${
              selectedRoute === "third_party"
                ? "border-[#FF6B00]"
                : theme === "dark"
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-[#FF6B00]/10 btn-parallelogram mb-3">
                <Building2 className="text-[#FF6B00]" size={32} />
              </div>

              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Third Party
              </h3>
            </div>
          </div>
        </div>
      ) : (
        /* Third Party Email Form */
        <div className="max-w-2xl mx-auto">
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} card-parallelogram shadow-lg overflow-hidden`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail size={24} />
                Request Quote from Third Party
              </h2>
            </div>

            <form onSubmit={handleSendThirdPartyRequest} className="p-6 space-y-5">
              {/* Select Third Party */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                  Third Party Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedThirdParty}
                  onChange={(e) => setSelectedThirdParty(e.target.value)}
                  required
                  className={`w-full px-4 py-2.5 input-parallelogram border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="">Select a company...</option>
                  {thirdParties.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.company_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Subject */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                  className={`w-full px-4 py-2.5 input-parallelogram border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              {/* Email Body */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  required
                  rows={10}
                  placeholder="Enter your message here..."
                  className={`w-full px-4 py-2.5 input-parallelogram border transition-all outline-none resize-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowThirdPartyForm(false);
                    setSelectedRoute(null);
                  }}
                  disabled={submitting}
                  className={`px-6 py-2.5 btn-parallelogram font-medium transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  } disabled:opacity-50`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#FF6B00] hover:bg-[#FF8C00] text-white py-2.5 px-6 btn-parallelogram font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
