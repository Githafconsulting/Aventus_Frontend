"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import { ArrowLeft, Building2, Users, FileText, Mail, Send, Globe, MapPin, Briefcase, CheckCircle2, CheckCircle } from "lucide-react";

interface ThirdParty {
  id: string;
  company_name: string;
  contact_person_name: string;
  contact_person_email: string;
}

type RouteType = "WPS" | "FREELANCER" | "UAE" | "SAUDI" | "OFFSHORE";
type SubRouteType = "DIRECT" | "THIRD_PARTY";

export default function SelectRoutePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const contractorId = params.id as string;

  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
  const [selectedSubRoute, setSelectedSubRoute] = useState<SubRouteType | null>(null);
  const [showSubRouteSelection, setShowSubRouteSelection] = useState(false);
  const [showThirdPartyForm, setShowThirdPartyForm] = useState(false);

  // Third party form state
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [selectedThirdParty, setSelectedThirdParty] = useState<string>("");
  const [thirdPartyEmail, setThirdPartyEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    clearPreviousRouteSelection(); // Clear any previous route so user can choose again
    fetchContractor();
    fetchThirdParties();
  }, [contractorId]);

  // Clear any previously selected route so user can choose again
  const clearPreviousRouteSelection = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      await fetch(`${API_ENDPOINTS.contractorById(contractorId)}/clear-route`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Previous route selection cleared");
    } catch (error) {
      console.log("Note: Could not clear previous route (this is okay if none existed)");
    }
  };

  // Auto-populate email and body when third party is selected
  useEffect(() => {
    if (selectedThirdParty && thirdParties.length > 0 && contractor) {
      const thirdParty = thirdParties.find(tp => tp.id === selectedThirdParty);
      if (thirdParty) {
        // Auto-populate third party email
        setThirdPartyEmail(thirdParty.contact_person_email);

        // Update email body with third party contact info
        setEmailBody(`Dear ${thirdParty.contact_person_name},

We would like to request a quote for the following contractor:

Name: ${contractor.first_name} ${contractor.surname}
Email: ${contractor.email}
Nationality: ${contractor.nationality || "N/A"}

Please provide us with your rates, terms, and any applicable fees.

Best regards,
${user?.name}
Aventus Resources`);
      }
    } else {
      // Clear email when no third party selected
      setThirdPartyEmail("");
    }
  }, [selectedThirdParty, thirdParties, contractor, user]);

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
      const url = `${API_ENDPOINTS.thirdParties}?include_inactive=false`;
      console.log("Fetching third parties from:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Third parties response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Third parties fetched:", data);
        setThirdParties(data);
      } else {
        const errorText = await response.text();
        console.error("Third parties fetch failed:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching third parties:", error);
    }
  };

  const handleRouteSelection = (route: RouteType) => {
    setSelectedRoute(route);

    // SAUDI route goes directly to quote sheets WITHOUT saving to database
    if (route === "SAUDI") {
      router.push(`/dashboard/contractors/${contractorId}/quote-sheets`);
    } else {
      // Check if route has sub-options (like UAE)
      const routeConfig = routeOptions.find(r => r.type === route);
      if (routeConfig?.hasSubOptions) {
        // Show sub-route selection (DIRECT vs THIRD_PARTY)
        setShowSubRouteSelection(true);
      } else {
        // WPS, FREELANCER, OFFSHORE go directly to CDS form WITHOUT saving yet
        // Route will be saved when CDS form is submitted
        router.push(`/dashboard/contractors/complete-cds/${contractorId}?route=${route.toLowerCase()}`);
      }
    }
  };

  const handleSubRouteSelection = (subRoute: SubRouteType) => {
    setSelectedSubRoute(subRoute);

    if (subRoute === "THIRD_PARTY") {
      // Show third party form for email
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
      // DIRECT route (UAE) - go to CDS form WITHOUT saving yet
      if (selectedRoute) {
        router.push(`/dashboard/contractors/complete-cds/${contractorId}?route=${selectedRoute.toLowerCase()}`);
      }
    }
  };

  const submitRouteSelection = async (route: RouteType, subRoute: SubRouteType) => {
    console.log("=== SUBMIT ROUTE SELECTION ===");
    console.log("Route:", route);
    console.log("SubRoute:", subRoute);
    console.log("Contractor ID:", contractorId);

    setSubmitting(true);
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const url = `${API_ENDPOINTS.contractorById(contractorId)}/select-route`;
      const payload = {
        route: route.toLowerCase(),
        sub_route: subRoute.toLowerCase()
      };

      console.log("URL:", url);
      console.log("Payload:", payload);
      console.log("Token:", token ? "Present" : "Missing");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("Success! Redirecting...");
        // SAUDI routes to Quote Sheet, all others route to CDS Form
        if (route === "SAUDI") {
          router.push(`/dashboard/contractors/${contractorId}/quote-sheets`);
        } else {
          router.push(`/dashboard/contractors/complete-cds/${contractorId}`);
        }
      } else {
        console.error("Failed:", responseData);
        alert(`Failed to select route: ${responseData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error selecting route:", error);
      alert("An error occurred: " + error);
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

      // First save the route selection
      await fetch(`${API_ENDPOINTS.contractorById(contractorId)}/select-route`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: selectedRoute?.toLowerCase(),
          sub_route: "third_party"
        }),
      });

      // Then send the third party request
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
        // SAUDI routes to Quote Sheet, UAE routes to contractors list
        if (selectedRoute === "SAUDI") {
          router.push(`/dashboard/contractors/${contractorId}/quote-sheets`);
        } else {
          router.push("/dashboard/contractors");
        }
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

  // Route configuration with icons and colors
  const routeOptions = [
    {
      type: "WPS" as RouteType,
      label: "WPS",
      description: "Work Permit System",
      icon: Briefcase,
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      borderColor: "border-blue-500"
    },
    {
      type: "FREELANCER" as RouteType,
      label: "Freelancer",
      description: "Independent Contractor",
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      borderColor: "border-purple-500"
    },
    {
      type: "UAE" as RouteType,
      label: "UAE",
      description: "United Arab Emirates",
      icon: MapPin,
      color: "green",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      borderColor: "border-green-500",
      hasSubOptions: true
    },
    {
      type: "SAUDI" as RouteType,
      label: "Saudi Arabia",
      description: "Kingdom of Saudi Arabia",
      icon: Globe,
      color: "orange",
      bgColor: "bg-[#FF6B00]/10",
      textColor: "text-[#FF6B00]",
      borderColor: "border-[#FF6B00]",
      hasSubOptions: true
    },
    {
      type: "OFFSHORE" as RouteType,
      label: "Offshore",
      description: "International Placement",
      icon: Building2,
      color: "cyan",
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-500",
      borderColor: "border-cyan-500"
    }
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => {
            if (showThirdPartyForm || showSubRouteSelection) {
              // If in third party form or sub-route selection, go back to main route selection
              setShowThirdPartyForm(false);
              setShowSubRouteSelection(false);
              setSelectedRoute(null);
              setSelectedSubRoute(null);
              setSelectedThirdParty("");
              setThirdPartyEmail("");
              setEmailSubject("");
              setEmailBody("");
            } else {
              // If in main route selection, go back to contractors list
              router.push("/dashboard/contractors");
            }
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          {showThirdPartyForm || showSubRouteSelection ? "Back to Select Route" : "Back to Contractors"}
        </button>

        <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {showThirdPartyForm ? "Request Quote from Third Party" : "Select Onboarding Route"}
        </h1>
        <p className="text-gray-400 mt-2">
          {showThirdPartyForm
            ? `Requesting quote for ${contractor?.first_name} ${contractor?.surname}`
            : `Choose the onboarding route for ${contractor?.first_name} ${contractor?.surname}`
          }
        </p>
      </div>

      {!showThirdPartyForm ? (
        !showSubRouteSelection ? (
          /* Main Route Selection */
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-4">
              {routeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => handleRouteSelection(option.type)}
                    className={`flex items-center gap-3 px-6 py-3 btn-parallelogram font-bold transition-all border-2 group ${
                      selectedRoute === option.type
                        ? "bg-[#FF6B00] text-white border-[#FF8C00] shadow-lg shadow-[#FF6B00]/30"
                        : "bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-black hover:text-white border-[#FF6B00]/30 hover:border-[#FF8C00]"
                    } shadow-md hover:shadow-lg`}
                  >
                    <div className={`p-1.5 rounded ${selectedRoute === option.type ? 'bg-white/20' : 'bg-[#FF6B00]/20 group-hover:bg-white/20'}`}>
                      <Icon size={20} className={selectedRoute === option.type ? 'text-white' : 'text-[#FF6B00] group-hover:text-white'} />
                    </div>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Sub-Route Selection */
          <div className="max-w-2xl">
            <h2 className={`text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {selectedRoute}
            </h2>

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => handleSubRouteSelection("DIRECT")}
                className={`flex items-center gap-3 px-6 py-3 btn-parallelogram font-bold transition-all border-2 group ${
                  selectedSubRoute === "DIRECT"
                    ? "bg-[#FF6B00] text-white border-[#FF8C00] shadow-lg shadow-[#FF6B00]/30"
                    : "bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-black hover:text-white border-[#FF6B00]/30 hover:border-[#FF8C00]"
                } shadow-md hover:shadow-lg`}
              >
                <div className={`p-1.5 rounded ${selectedSubRoute === "DIRECT" ? 'bg-white/20' : 'bg-[#FF6B00]/20 group-hover:bg-white/20'}`}>
                  <CheckCircle2 size={20} className={selectedSubRoute === "DIRECT" ? 'text-white' : 'text-[#FF6B00] group-hover:text-white'} />
                </div>
                <span>Direct</span>
              </button>

              <button
                onClick={() => handleSubRouteSelection("THIRD_PARTY")}
                className={`flex items-center gap-3 px-6 py-3 btn-parallelogram font-bold transition-all border-2 group ${
                  selectedSubRoute === "THIRD_PARTY"
                    ? "bg-[#FF6B00] text-white border-[#FF8C00] shadow-lg shadow-[#FF6B00]/30"
                    : "bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-black hover:text-white border-[#FF6B00]/30 hover:border-[#FF8C00]"
                } shadow-md hover:shadow-lg`}
              >
                <div className={`p-1.5 rounded ${selectedSubRoute === "THIRD_PARTY" ? 'bg-white/20' : 'bg-[#FF6B00]/20 group-hover:bg-white/20'}`}>
                  <Building2 size={20} className={selectedSubRoute === "THIRD_PARTY" ? 'text-white' : 'text-[#FF6B00] group-hover:text-white'} />
                </div>
                <span>Third Party</span>
              </button>
            </div>

            <button
              onClick={() => {
                setShowSubRouteSelection(false);
                setSelectedRoute(null);
                setSelectedSubRoute(null);
              }}
              className={`px-4 py-2 btn-parallelogram text-sm font-medium transition-all ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Back
            </button>
          </div>
        )
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
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  style={{
                    colorScheme: theme === "dark" ? "dark" : "light"
                  }}
                >
                  <option value="" className={theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"}>
                    Select a company...
                  </option>
                  {thirdParties.map((tp) => (
                    <option
                      key={tp.id}
                      value={tp.id}
                      className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
                    >
                      {tp.company_name}
                    </option>
                  ))}
                </select>
                {thirdParties.length === 0 && (
                  <p className="text-sm text-yellow-500 mt-2">
                    No third party companies available. Please add one first.
                  </p>
                )}
              </div>

              {/* Third Party Email (Auto-populated) */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                  Third Party Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={thirdPartyEmail}
                  readOnly
                  placeholder="Select a company to auto-fill email..."
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-400"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  } cursor-not-allowed`}
                />
                {thirdPartyEmail && (
                  <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Email auto-populated from selected company
                  </p>
                )}
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
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all outline-none ${
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
                  placeholder="Select a third party company to auto-populate..."
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all outline-none resize-none ${
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
                    // Reset all states to go back to route selection WITHOUT saving
                    setShowThirdPartyForm(false);
                    setSelectedRoute(null);
                    setSelectedThirdParty("");
                    setThirdPartyEmail("");
                    setEmailSubject("");
                    setEmailBody("");
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
