"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, User, Building, Briefcase, DollarSign, FileText, CreditCard } from "lucide-react";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";

export default function CompleteCDSPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const contractId = params.id as string;
  const selectedRoute = searchParams.get('route'); // Get route from URL query

  const [activeSection, setActiveSection] = useState<"personal" | "management" | "placement" | "costs" | "client" | "payment" | "paydetails">("personal");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thirdParties, setThirdParties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const [formData, setFormData] = useState({
    // Personal Details (pre-filled from contract)
    firstName: "",
    surname: "",
    gender: "Male",
    nationality: "",
    country: "",
    currentLocation: "",
    homeAddress: "",
    addressLine3: "",
    addressLine4: "",
    phone: "",
    email: "",
    dob: "",

    // Management Company
    businessType: "",
    thirdPartyId: "",
    umbrellaCompanyName: "",
    registeredAddress: "",
    managementAddressLine2: "",
    managementAddressLine3: "",
    companyVATNo: "",
    companyName: "",
    accountNumber: "",
    ibanNumber: "",
    companyRegNo: "",

    // Placement Details (partially pre-filled)
    clientId: "",
    clientName: "",
    projectName: "",
    role: "",
    startDate: "",
    endDate: "",
    location: "",
    duration: "",
    currency: "SAR",
    clientChargeRate: "",
    candidatePayRate: "",
    candidateBasicSalary: "",
    contractorCosts: "",

    // Monthly Costs
    managementCompanyCharges: "",
    taxes: "",
    bankFees: "",
    fx: "",
    nationalisation: "",

    // Provisions
    eosb: "",
    vacationPay: "",
    sickLeave: "",
    otherProvision: "",

    // One Time Costs
    flights: "",
    visa: "",
    medicalInsurance: "",
    familyCosts: "",
    otherOneTimeCosts: "",

    // Additional Info
    upfrontInvoices: "",
    securityDeposit: "",
    laptopProvider: "client",
    otherNotes: "",

    // Summary Calculations
    contractorTotalFixedCosts: "",
    estimatedMonthlyGP: "",

    // Aventus Deal
    consultant: "",
    anySplits: "",
    resourcer: "",

    // Invoice Details
    timesheetRequired: "No",
    timesheetApproverName: "",
    invoiceEmail: "",
    clientContact: "",
    invoiceAddressLine1: "",
    invoiceAddressLine2: "",
    invoiceAddressLine3: "",
    invoiceAddressLine4: "",
    invoicePOBox: "",
    invoiceTaxNumber: "",
    contractorPayFrequency: "monthly",
    clientInvoiceFrequency: "monthly",
    clientPaymentTerms: "",
    invoicingPreferences: "per worker",
    invoiceInstructions: "",
    supportingDocsRequired: "No",
    poRequired: "No",
    poNumber: "",

    // Pay Details
    umbrellaOrDirect: "Umbrella",
    candidateBankDetails: "",
    candidateIBAN: "",
  });

  // Load contractor data from backend
  useEffect(() => {
    const loadContractor = async () => {
      try {
        const token = localStorage.getItem("aventus-auth-token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(`${getApiUrl()}/api/v1/contractors/${contractId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("aventus-auth-token");
          router.push("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch contractor");
        }

        const contractor = await response.json();

        // Check if contractor has uploaded documents (ready for CDS)
        if (contractor.status !== "documents_uploaded" && contractor.status !== "pending_review" && contractor.status !== "pending_cds_cs") {
          alert("Contractor must have uploaded documents before completing CDS.");
          router.push("/dashboard/contractors");
          return;
        }

        // Load all data from contractor record (includes both initial data and any saved CDS data)
        setFormData({
          // Personal Details
          firstName: contractor.first_name || "",
          surname: contractor.surname || "",
          gender: contractor.gender || "Male",
          nationality: contractor.nationality || "",
          country: contractor.country || "",
          currentLocation: contractor.current_location || "",
          homeAddress: contractor.home_address || "",
          addressLine3: contractor.address_line3 || "",
          addressLine4: contractor.address_line4 || "",
          phone: contractor.phone || "",
          email: contractor.email || "",
          dob: contractor.dob || "",

          // Management Company
          businessType: contractor.business_type || "",
          thirdPartyId: contractor.third_party_id || "",
          umbrellaCompanyName: contractor.umbrella_company_name || "",
          registeredAddress: contractor.registered_address || "",
          managementAddressLine2: contractor.management_address_line2 || "",
          managementAddressLine3: contractor.management_address_line3 || "",
          companyVATNo: contractor.company_vat_no || "",
          companyName: contractor.company_name || "",
          accountNumber: contractor.account_number || "",
          ibanNumber: contractor.iban_number || "",
          companyRegNo: contractor.company_reg_no || "",

          // Placement Details
          clientId: contractor.client_id || "",
          clientName: contractor.client_name || "",
          projectName: contractor.project_name || "",
          role: contractor.role || "",
          startDate: contractor.start_date || "",
          endDate: contractor.end_date || "",
          location: contractor.location || "",
          duration: contractor.duration || "",
          currency: contractor.currency || "SAR",
          clientChargeRate: contractor.client_charge_rate || "",
          candidatePayRate: contractor.candidate_pay_rate || "",
          candidateBasicSalary: contractor.candidate_basic_salary || "",
          contractorCosts: contractor.contractor_costs || "",

          // Monthly Costs
          managementCompanyCharges: contractor.management_company_charges || "",
          taxes: contractor.taxes || "",
          bankFees: contractor.bank_fees || "",
          fx: contractor.fx || "",
          nationalisation: contractor.nationalisation || "",

          // Provisions
          eosb: contractor.eosb || "",
          vacationPay: contractor.vacation_pay || "",
          sickLeave: contractor.sick_leave || "",
          otherProvision: contractor.other_provision || "",

          // One Time Costs
          flights: contractor.flights || "",
          visa: contractor.visa || "",
          medicalInsurance: contractor.medical_insurance || "",
          familyCosts: contractor.family_costs || "",
          otherOneTimeCosts: contractor.other_one_time_costs || "",

          // Additional Info
          upfrontInvoices: contractor.upfront_invoices || "",
          securityDeposit: contractor.security_deposit || "",
          laptopProvider: contractor.laptop_provider || "client",
          otherNotes: contractor.other_notes || "",

          // Summary Calculations
          contractorTotalFixedCosts: contractor.contractor_total_fixed_costs || "",
          estimatedMonthlyGP: contractor.estimated_monthly_gp || "",

          // Aventus Deal (auto-fill consultant from consultant_name if available)
          consultant: contractor.consultant || contractor.consultant_name || "",
          anySplits: contractor.any_splits || "",
          resourcer: contractor.resourcer || "",

          // Invoice Details
          timesheetRequired: contractor.timesheet_required || "No",
          timesheetApproverName: contractor.timesheet_approver_name || "",
          invoiceEmail: contractor.invoice_email || "",
          clientContact: contractor.client_contact || "",
          invoiceAddressLine1: contractor.invoice_address_line1 || "",
          invoiceAddressLine2: contractor.invoice_address_line2 || "",
          invoiceAddressLine3: contractor.invoice_address_line3 || "",
          invoiceAddressLine4: contractor.invoice_address_line4 || "",
          invoicePOBox: contractor.invoice_po_box || "",
          invoiceTaxNumber: contractor.invoice_tax_number || "",
          contractorPayFrequency: contractor.contractor_pay_frequency || "monthly",
          clientInvoiceFrequency: contractor.client_invoice_frequency || "monthly",
          clientPaymentTerms: contractor.client_payment_terms || "",
          invoicingPreferences: contractor.invoicing_preferences || "per worker",
          invoiceInstructions: contractor.invoice_instructions || "",
          supportingDocsRequired: contractor.supporting_docs_required || "No",
          poRequired: contractor.po_required || "No",
          poNumber: contractor.po_number || "",

          // Pay Details
          umbrellaOrDirect: contractor.umbrella_or_direct || "Umbrella",
          candidateBankDetails: contractor.candidate_bank_details || "",
          candidateIBAN: contractor.candidate_iban || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading contractor:", error);
        alert("Failed to load contractor data");
        router.push("/dashboard/contractors");
      }
    };

    loadContractor();
  }, [contractId, router]);

  // Load third parties
  useEffect(() => {
    const loadThirdParties = async () => {
      try {
        const token = localStorage.getItem("aventus-auth-token");
        if (!token) return;

        const response = await fetch(`${getApiUrl()}/api/v1/third-parties/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setThirdParties(data);
        }
      } catch (error) {
        console.error("Error loading third parties:", error);
      }
    };

    loadThirdParties();
  }, []);

  // Load clients data
  useEffect(() => {
    const loadClients = async () => {
      try {
        const token = localStorage.getItem("aventus-auth-token");
        if (!token) return;

        const response = await fetch(API_ENDPOINTS.clients, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data);

          // If contractor has a saved clientId, set the selectedClient
          if (formData.clientId) {
            const client = data.find((c: any) => c.id === formData.clientId);
            if (client) {
              setSelectedClient(client);
            }
          }
        } else {
          setClients([]);
        }
      } catch (error) {
        console.error("Error loading clients:", error);
        setClients([]);
      }
    };

    loadClients();
  }, [formData.clientId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // If third party is selected, auto-fill management company fields
    if (name === "thirdPartyId") {
      if (value) {
        const selectedThirdParty = thirdParties.find(tp => tp.id === value);
        if (selectedThirdParty) {
          setFormData({
            ...formData,
            thirdPartyId: value,
            umbrellaCompanyName: selectedThirdParty.company_name || "",
            registeredAddress: selectedThirdParty.address_line1 || "",
            managementAddressLine2: selectedThirdParty.address_line2 || "",
            managementAddressLine3: selectedThirdParty.address_line3 || "",
            companyVATNo: selectedThirdParty.company_vat_no || "",
            companyName: selectedThirdParty.company_name || "",
            accountNumber: selectedThirdParty.account_number || "",
            ibanNumber: selectedThirdParty.iban_number || "",
            companyRegNo: selectedThirdParty.company_reg_no || "",
          });
          return;
        }
      } else {
        // If cleared, reset all management company fields
        setFormData({
          ...formData,
          thirdPartyId: "",
          umbrellaCompanyName: "",
          registeredAddress: "",
          managementAddressLine2: "",
          managementAddressLine3: "",
          companyVATNo: "",
          companyName: "",
          accountNumber: "",
          ibanNumber: "",
          companyRegNo: "",
        });
        return;
      }
    }

    // If client is selected, update client name, reset project, and auto-fill invoice details
    if (name === "clientId") {
      if (value) {
        const selectedClient = clients.find(c => c.id === value);
        if (selectedClient) {
          setFormData({
            ...formData,
            clientId: value,
            clientName: selectedClient.company_name || "",
            projectName: "", // Reset project when client changes
            // Auto-fill invoice details from client
            timesheetRequired: selectedClient.timesheet_required ? "Yes" : "No",
            timesheetApproverName: selectedClient.timesheet_approver_name || "",
            invoiceEmail: selectedClient.contact_person_email || "",
            clientContact: selectedClient.contact_person_name || "",
            invoiceAddressLine1: selectedClient.address_line1 || "",
            invoiceAddressLine2: selectedClient.address_line2 || "",
            invoiceAddressLine3: selectedClient.address_line3 || "",
            invoiceAddressLine4: selectedClient.address_line4 || "",
            contractorPayFrequency: selectedClient.contractor_pay_frequency || "monthly",
            clientInvoiceFrequency: selectedClient.client_invoice_frequency || "monthly",
            clientPaymentTerms: selectedClient.client_payment_terms || "",
            invoicingPreferences: selectedClient.invoicing_preferences || "per worker",
            invoiceInstructions: selectedClient.invoice_instructions || "",
            supportingDocsRequired: selectedClient.supporting_documents_required && selectedClient.supporting_documents_required.length > 0 ? "Yes" : "No",
            poRequired: selectedClient.po_required ? "Yes" : "No",
            poNumber: selectedClient.po_number || "",
          });
          setSelectedClient(selectedClient);
          return;
        }
      } else {
        // If cleared, reset client, project, and invoice details
        setFormData({
          ...formData,
          clientId: "",
          clientName: "",
          projectName: "",
          timesheetRequired: "No",
          timesheetApproverName: "",
          invoiceEmail: "",
          clientContact: "",
          invoiceAddressLine1: "",
          invoiceAddressLine2: "",
          invoiceAddressLine3: "",
          invoiceAddressLine4: "",
          contractorPayFrequency: "monthly",
          clientInvoiceFrequency: "monthly",
          clientPaymentTerms: "",
          invoicingPreferences: "per worker",
          invoiceInstructions: "",
          supportingDocsRequired: "No",
          poRequired: "No",
          poNumber: "",
        });
        setSelectedClient(null);
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitCDS = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow submission if we're on the paydetails section
    if (activeSection !== "paydetails") {
      // If Enter was pressed on another section, just move to next section
      const sectionOrder = ["personal", "management", "placement", "costs", "client", "payment", "paydetails"];
      const currentIndex = sectionOrder.indexOf(activeSection);
      if (currentIndex < sectionOrder.length - 1) {
        setActiveSection(sectionOrder[currentIndex + 1] as any);
      }
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        router.push("/");
        return;
      }

      // First, save the route selection if we have one
      if (selectedRoute) {
        await fetch(`${API_ENDPOINTS.contractorById(contractId)}/select-route`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: selectedRoute,
            sub_route: "direct"
          }),
        });
      }

      // Submit CDS form data to backend
      const response = await fetch(`${getApiUrl()}/api/v1/contractors/${contractId}/cds-form`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData, // Backend expects { data: {...} }
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("aventus-auth-token");
        router.push("/");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit CDS form");
      }

      // CDS form submitted successfully, redirect to costing sheet
      router.push(`/dashboard/contractors/${contractId}/costing-sheet`);
    } catch (error: any) {
      console.error("Error submitting CDS form:", error);
      alert(`Failed to submit CDS form: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };


  const sections = [
    { id: "personal", label: "Contractor", icon: User },
    { id: "management", label: "Management Company", icon: Building },
    { id: "placement", label: "Placement Details", icon: Briefcase },
    { id: "costs", label: "Costs & Provisions", icon: DollarSign },
    { id: "client", label: "Aventus Deal", icon: FileText },
    { id: "payment", label: "Invoice Details", icon: FileText },
    { id: "paydetails", label: "Pay Details", icon: CreditCard },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/dashboard/contractors/${contractId}/select-route`)}
          className="flex items-center gap-2 mb-4 text-gray-400 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Route Selection
        </button>

        <div>
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Complete Contractor Detail Sheet (CDS)
          </h1>
          <p className="text-gray-400 mt-2">
            Fill in all contractor details to complete onboarding
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"} border ${theme === "dark" ? "border-blue-500/20" : "border-blue-200"} rounded-lg p-4 mb-6`}>
        <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-blue-800"}`}>
          <strong>Step 2 of 3:</strong> Fill in all contractor details across the 6 sections. Your progress will be saved automatically when you click 'Next: Costing Sheet'. You can return to edit this information later if needed.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-[#FF6B00] text-white"
                    : theme === "dark"
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form - Use the exact same structure as Add Contractor form */}
      <form onSubmit={handleSubmitCDS}>
        {/* Contractor Details */}
        {activeSection === "personal" && (
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Contractor Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name *</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Surname *</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nationality *</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Location</label>
                <input
                  type="text"
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  placeholder="City or region"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Home Address</label>
                <input
                  type="text"
                  name="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 3</label>
                <input
                  type="text"
                  name="addressLine3"
                  value={formData.addressLine3}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 4</label>
                <input
                  type="text"
                  name="addressLine4"
                  value={formData.addressLine4}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } opacity-60 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Management Company */}
        {activeSection === "management" && (
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Management Company Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Umbrella Company (Third Party)</label>
                <select
                  name="thirdPartyId"
                  value={formData.thirdPartyId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="">Select Umbrella Company</option>
                  {thirdParties.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.company_name}
                    </option>
                  ))}
                </select>
                {formData.thirdPartyId && (
                  <p className="text-xs text-gray-500 mt-2">
                    The fields below are auto-filled from the selected third party company
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Company Registration Number</label>
                <input
                  type="text"
                  name="companyRegNo"
                  value={formData.companyRegNo}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Registered Address (Line 1)</label>
                <input
                  type="text"
                  name="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 2</label>
                <input
                  type="text"
                  name="managementAddressLine2"
                  value={formData.managementAddressLine2}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 3</label>
                <input
                  type="text"
                  name="managementAddressLine3"
                  value={formData.managementAddressLine3}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Company VAT Number</label>
                <input
                  type="text"
                  name="companyVATNo"
                  value={formData.companyVATNo}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">IBAN Number</label>
                <input
                  type="text"
                  name="ibanNumber"
                  value={formData.ibanNumber}
                  onChange={handleChange}
                  readOnly={!!formData.thirdPartyId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    formData.thirdPartyId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Placement Details */}
        {activeSection === "placement" && (
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Placement Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client *</label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Project *</label>
                <select
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                  disabled={!formData.clientId}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    !formData.clientId
                      ? theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-60"
                        : "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="">Select Project</option>
                  {selectedClient?.projects?.map((project: any, index: number) => (
                    <option key={index} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {!formData.clientId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Please select a client first
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (Months) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
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
                  <option value="AED">AED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client Charge Rate *</label>
                <input
                  type="number"
                  name="clientChargeRate"
                  value={formData.clientChargeRate}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Candidate Pay Rate *</label>
                <input
                  type="number"
                  name="candidatePayRate"
                  value={formData.candidatePayRate}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Candidate Basic Salary (EOSB)</label>
                <input
                  type="number"
                  name="candidateBasicSalary"
                  value={formData.candidateBasicSalary}
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
        )}

        {/* Costs & Provisions */}
        {activeSection === "costs" && (
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Costs & Provisions
            </h2>

            {/* Monthly Costs */}
            <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Monthly Costs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Management Company Charges</label>
                <input
                  type="number"
                  name="managementCompanyCharges"
                  value={formData.managementCompanyCharges}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Taxes</label>
                <input
                  type="number"
                  name="taxes"
                  value={formData.taxes}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bank Fees</label>
                <input
                  type="number"
                  name="bankFees"
                  value={formData.bankFees}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">FX (Foreign Exchange)</label>
                <input
                  type="number"
                  name="fx"
                  value={formData.fx}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nationalisation</label>
                <input
                  type="number"
                  name="nationalisation"
                  value={formData.nationalisation}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>

            {/* Provisions */}
            <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Provisions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">EOSB (End of Service Benefit)</label>
                <input
                  type="number"
                  name="eosb"
                  value={formData.eosb}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Vacation Pay</label>
                <input
                  type="number"
                  name="vacationPay"
                  value={formData.vacationPay}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sick Leave</label>
                <input
                  type="number"
                  name="sickLeave"
                  value={formData.sickLeave}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Other Provision</label>
                <input
                  type="number"
                  name="otherProvision"
                  value={formData.otherProvision}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>

            {/* One Time Costs */}
            <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              One Time Costs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Flights</label>
                <input
                  type="number"
                  name="flights"
                  value={formData.flights}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Visa Costs</label>
                <input
                  type="number"
                  name="visa"
                  value={formData.visa}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Medical Insurance</label>
                <input
                  type="number"
                  name="medicalInsurance"
                  value={formData.medicalInsurance}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Family Costs</label>
                <input
                  type="number"
                  name="familyCosts"
                  value={formData.familyCosts}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Other One Time Costs</label>
                <input
                  type="number"
                  name="otherOneTimeCosts"
                  value={formData.otherOneTimeCosts}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>

            {/* Summary Fields */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Contractor Total Fixed Costs (Monthly)</label>
                  <input
                    type="number"
                    name="contractorTotalFixedCosts"
                    value={formData.contractorTotalFixedCosts}
                    onChange={handleChange}
                    placeholder="Total monthly fixed costs"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Monthly GP (Gross Profit)</label>
                  <input
                    type="number"
                    name="estimatedMonthlyGP"
                    value={formData.estimatedMonthlyGP}
                    onChange={handleChange}
                    placeholder="Estimated monthly gross profit"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aventus Deal */}
        {activeSection === "client" && (
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Aventus Deal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Consultant</label>
                <input
                  type="text"
                  name="consultant"
                  value={formData.consultant}
                  onChange={handleChange}
                  placeholder="Enter consultant name or initials"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Any Splits?</label>
                <input
                  type="text"
                  name="anySplits"
                  value={formData.anySplits}
                  onChange={handleChange}
                  placeholder="e.g., N/A or specify split details"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Resourcer</label>
                <input
                  type="text"
                  name="resourcer"
                  value={formData.resourcer}
                  onChange={handleChange}
                  placeholder="Enter resourcer name or initials"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Invoice Details */}
        {activeSection === "payment" && (
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Invoice Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Timesheet Required?</label>
                <select
                  name="timesheetRequired"
                  value={formData.timesheetRequired}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Timesheet Approver Name</label>
                <input
                  type="text"
                  name="timesheetApproverName"
                  value={formData.timesheetApproverName}
                  onChange={handleChange}
                  placeholder="Enter timesheet approver name"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Email</label>
                <input
                  type="email"
                  name="invoiceEmail"
                  value={formData.invoiceEmail}
                  onChange={handleChange}
                  placeholder="Enter invoice email address"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client Contact</label>
                <input
                  type="text"
                  name="clientContact"
                  value={formData.clientContact}
                  onChange={handleChange}
                  placeholder="Enter client contact name"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 1</label>
                <input
                  type="text"
                  name="invoiceAddressLine1"
                  value={formData.invoiceAddressLine1}
                  onChange={handleChange}
                  placeholder="Enter address line 1"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 2</label>
                <input
                  type="text"
                  name="invoiceAddressLine2"
                  value={formData.invoiceAddressLine2}
                  onChange={handleChange}
                  placeholder="Enter address line 2"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 3</label>
                <input
                  type="text"
                  name="invoiceAddressLine3"
                  value={formData.invoiceAddressLine3}
                  onChange={handleChange}
                  placeholder="Enter address line 3"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 4</label>
                <input
                  type="text"
                  name="invoiceAddressLine4"
                  value={formData.invoiceAddressLine4}
                  onChange={handleChange}
                  placeholder="Enter address line 4"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">PO Box</label>
                <input
                  type="text"
                  name="invoicePOBox"
                  value={formData.invoicePOBox}
                  onChange={handleChange}
                  placeholder="Enter PO Box"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tax Number</label>
                <input
                  type="text"
                  name="invoiceTaxNumber"
                  value={formData.invoiceTaxNumber}
                  onChange={handleChange}
                  placeholder="Enter tax number"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Contractor Pay Frequency</label>
                <select
                  name="contractorPayFrequency"
                  value={formData.contractorPayFrequency}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client Invoice Frequency</label>
                <select
                  name="clientInvoiceFrequency"
                  value={formData.clientInvoiceFrequency}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client Payment Terms</label>
                <input
                  type="text"
                  name="clientPaymentTerms"
                  value={formData.clientPaymentTerms}
                  onChange={handleChange}
                  placeholder="e.g., 14 days, 30 days, Net 30"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Invoicing Preferences</label>
                <select
                  name="invoicingPreferences"
                  value={formData.invoicingPreferences}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="consolidated">Consolidated</option>
                  <option value="per worker">Per Worker</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Instructions</label>
                <textarea
                  name="invoiceInstructions"
                  value={formData.invoiceInstructions}
                  onChange={handleChange}
                  placeholder="Enter any special invoice instructions"
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Supporting Documents Required?</label>
                <select
                  name="supportingDocsRequired"
                  value={formData.supportingDocsRequired}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">PO Required</label>
                <select
                  name="poRequired"
                  value={formData.poRequired}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">PO Number</label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  placeholder="Enter PO number if applicable"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pay Details */}
        {activeSection === "paydetails" && (
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg shadow-sm p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Pay Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Umbrella or Direct?</label>
                <select
                  name="umbrellaOrDirect"
                  value={formData.umbrellaOrDirect}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="Umbrella">Umbrella</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Candidate Bank Details</label>
                <input
                  type="text"
                  name="candidateBankDetails"
                  value={formData.candidateBankDetails}
                  onChange={handleChange}
                  placeholder="Enter bank name and other details"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Candidate IBAN</label>
                <input
                  type="text"
                  name="candidateIBAN"
                  value={formData.candidateIBAN}
                  onChange={handleChange}
                  placeholder="Enter IBAN number"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const sectionOrder = ["personal", "management", "placement", "costs", "client", "payment", "paydetails"];
              const currentIndex = sectionOrder.indexOf(activeSection);
              if (currentIndex > 0) {
                setActiveSection(sectionOrder[currentIndex - 1] as any);
              } else {
                router.push(`/dashboard/contractors/${contractId}/select-route`);
              }
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            {activeSection === "personal" ? "Cancel" : "Back"}
          </button>

          {activeSection !== "paydetails" ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const sectionOrder = ["personal", "management", "placement", "costs", "client", "payment", "paydetails"];
                const currentIndex = sectionOrder.indexOf(activeSection);
                if (currentIndex < sectionOrder.length - 1) {
                  setActiveSection(sectionOrder[currentIndex + 1] as any);
                }
              }}
              className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} className="rotate-180" />
              {submitting ? "Saving..." : "Next: Costing Sheet"}
            </button>
          )}
        </div>
      </form>

    </DashboardLayout>
  );
}
