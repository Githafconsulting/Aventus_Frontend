"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Save, Send, User, Building, Briefcase, DollarSign, FileText, CreditCard, Mail, X } from "lucide-react";

export default function AddContractorPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"personal" | "management" | "placement" | "costs" | "client" | "payment">("personal");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    contractLink: "",
    expiryDate: "",
  });

  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    surname: "",
    gender: "Male",
    nationality: "",
    homeAddress: "",
    addressLine3: "",
    addressLine4: "",
    phone: "",
    email: "",
    dob: "",

    // Management Company
    umbrellaCompanyName: "",
    registeredAddress: "",
    managementAddressLine2: "",
    managementAddressLine3: "",
    companyVATNo: "",
    companyName: "",
    accountNumber: "",
    ibanNumber: "",
    companyRegNo: "",

    // Placement Details
    clientName: "",
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

    // Client Details
    clientOfficeAddress: "",
    clientAddressLine2: "",
    clientAddressLine3: "",
    clientAddressLine4: "",
    clientPOBox: "",
    poRequired: "",
    poNumber: "",
    clientTaxNumber: "",
    contractorPayFrequency: "monthly",
    clientInvoiceFrequency: "monthly",
    clientPaymentTerms: "14 days",
    invoicingPreferences: "per worker",
    invoiceInstructions: "",
    supportingDocsRequired: "",

    // Pay Details
    umbrellaOrDirect: "Umbrella",
    candidateBankDetails: "",
    candidateAccountNumber: "",
    candidateMobile: "",
    currentLocation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Generate unique token and expiry date
  const generateContractToken = () => {
    const token = crypto.randomUUID();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
    return { token, expiryDate };
  };

  // Save as Draft
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const contractorData = {
      ...formData,
      status: "draft",
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    console.log("Saving draft:", contractorData);
    // TODO: Save to backend/state management
    alert("Contractor saved as draft!");
    router.push("/dashboard/contractors");
  };

  // Send Contract to Contractor
  const handleSendContract = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName || !formData.surname || !formData.email) {
      alert("Please fill in at least First Name, Surname, and Email before sending contract.");
      return;
    }

    const { token, expiryDate } = generateContractToken();
    const contractorData = {
      ...formData,
      status: "pending_signature",
      id: crypto.randomUUID(),
      contractToken: token,
      tokenExpiry: expiryDate.toISOString(),
      sentDate: new Date().toISOString(),
    };

    console.log("Sending contract:", contractorData);
    // TODO: Save to backend/state management

    // Prepare email data
    const contractLink = `${window.location.origin}/contract/${token}`;
    setEmailData({
      contractLink,
      expiryDate: expiryDate.toLocaleDateString(),
    });
    setShowEmailModal(true);
  };

  const sections = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "management", label: "Management Company", icon: Building },
    { id: "placement", label: "Placement Details", icon: Briefcase },
    { id: "costs", label: "Costs & Provisions", icon: DollarSign },
    { id: "client", label: "Client Details", icon: FileText },
    { id: "payment", label: "Payment Details", icon: CreditCard },
  ];

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
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Add New Contractor
          </h1>
          <p className="text-gray-400 mt-2">
            Complete all sections to onboard a new contractor
          </p>
        </div>
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

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Personal Details */}
        {activeSection === "personal" && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6 mb-6`}
          >
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Personal Details
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
                  Gender *
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nationality *
                </label>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Home Address
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Address Line 3
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Address Line 4
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number *
                </label>
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
                  Date of Birth *
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Management Company */}
        {activeSection === "management" && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6 mb-6`}
          >
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Management Company
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Umbrella Company Name
                </label>
                <input
                  type="text"
                  name="umbrellaCompanyName"
                  value={formData.umbrellaCompanyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Registered Address
                </label>
                <input
                  type="text"
                  name="registeredAddress"
                  value={formData.registeredAddress}
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
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="managementAddressLine2"
                  value={formData.managementAddressLine2}
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
                  Address Line 3
                </label>
                <input
                  type="text"
                  name="managementAddressLine3"
                  value={formData.managementAddressLine3}
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
                  Company VAT No.
                </label>
                <input
                  type="text"
                  name="companyVATNo"
                  value={formData.companyVATNo}
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
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
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
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
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
                  IBAN Number
                </label>
                <input
                  type="text"
                  name="ibanNumber"
                  value={formData.ibanNumber}
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
                  Company Reg No.
                </label>
                <input
                  type="text"
                  name="companyRegNo"
                  value={formData.companyRegNo}
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

        {/* Placement Details */}
        {activeSection === "placement" && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6 mb-6`}
          >
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Placement Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
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
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
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
                  Client Charge Rate
                </label>
                <input
                  type="number"
                  name="clientChargeRate"
                  value={formData.clientChargeRate}
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
                  Candidate Pay Rate
                </label>
                <input
                  type="number"
                  name="candidatePayRate"
                  value={formData.candidatePayRate}
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
                  Candidate Basic Salary (EOSB calc)
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Contractor Costs
                </label>
                <input
                  type="number"
                  name="contractorCosts"
                  value={formData.contractorCosts}
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
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6 mb-6`}
          >
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Costs & Provisions
            </h2>

            {/* Monthly Costs */}
            <h3 className="text-lg font-semibold text-gray-400 mb-4">Monthly Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Management Company Charges
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Taxes
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bank Fees
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  FX
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nationalisation
                </label>
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
            <h3 className="text-lg font-semibold text-gray-400 mb-4">Provisions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  EOSB
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Vacation Pay
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Sick Leave
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Other Provision
                </label>
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
            <h3 className="text-lg font-semibold text-gray-400 mb-4">One Time Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Flights
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  VISA
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Medical Insurance
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Family Costs
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Other One Time Costs
                </label>
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

            {/* Additional Info */}
            <h3 className="text-lg font-semibold text-gray-400 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Any Upfront Invoices Charged to Client?
                </label>
                <input
                  type="number"
                  name="upfrontInvoices"
                  value={formData.upfrontInvoices}
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
                  Security Deposit?
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
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
                  Laptop? Who's Providing
                </label>
                <select
                  name="laptopProvider"
                  value={formData.laptopProvider}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="client">Client</option>
                  <option value="contractor">Contractor</option>
                  <option value="company">Company</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Any Other Notes
                </label>
                <textarea
                  name="otherNotes"
                  value={formData.otherNotes}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Client Details */}
        {activeSection === "client" && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6 mb-6`}
          >
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Client Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Office & Central Regional Office
                </label>
                <input
                  type="text"
                  name="clientOfficeAddress"
                  value={formData.clientOfficeAddress}
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
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="clientAddressLine2"
                  value={formData.clientAddressLine2}
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
                  Address Line 3
                </label>
                <input
                  type="text"
                  name="clientAddressLine3"
                  value={formData.clientAddressLine3}
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
                  Address Line 4
                </label>
                <input
                  type="text"
                  name="clientAddressLine4"
                  value={formData.clientAddressLine4}
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
                  PO BOX
                </label>
                <input
                  type="text"
                  name="clientPOBox"
                  value={formData.clientPOBox}
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
                  PO Required
                </label>
                <input
                  type="text"
                  name="poRequired"
                  value={formData.poRequired}
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
                  PO Number
                </label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
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
                  Tax Number
                </label>
                <input
                  type="text"
                  name="clientTaxNumber"
                  value={formData.clientTaxNumber}
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
                  Contractor Pay Frequency
                </label>
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
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Client Invoice Frequency
                </label>
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
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Client Payment Terms
                </label>
                <input
                  type="text"
                  name="clientPaymentTerms"
                  value={formData.clientPaymentTerms}
                  onChange={handleChange}
                  placeholder="e.g., 14 days"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Invoicing Preferences
                </label>
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
                  <option value="per worker">Invoice per worker</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Invoice Instructions
                </label>
                <textarea
                  name="invoiceInstructions"
                  value={formData.invoiceInstructions}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Supporting Documents Required?
                </label>
                <input
                  type="text"
                  name="supportingDocsRequired"
                  value={formData.supportingDocsRequired}
                  onChange={handleChange}
                  placeholder="e.g., Invoice, Timesheet"
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

        {/* Payment Details */}
        {activeSection === "payment" && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-sm p-6 mb-6`}
          >
            <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Payment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Umbrella or Direct?
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Candidate Mobile No.
                </label>
                <input
                  type="tel"
                  name="candidateMobile"
                  value={formData.candidateMobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Candidate Bank Details (including IBAN)
                </label>
                <textarea
                  name="candidateBankDetails"
                  value={formData.candidateBankDetails}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter complete bank details and IBAN"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="candidateAccountNumber"
                  value={formData.candidateAccountNumber}
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
                  Current Location
                </label>
                <input
                  type="text"
                  name="currentLocation"
                  value={formData.currentLocation}
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

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
              }`}
            >
              <Save size={18} />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleSendContract}
              className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all flex items-center gap-2"
            >
              <Send size={18} />
              Send Contract
            </button>
          </div>
        </div>
      </form>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FF6B00] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={24} className="text-white" />
                <h2 className="text-xl font-bold text-white">
                  Contract Email Preview
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  router.push("/dashboard/contractors");
                }}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Email Content */}
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

              <div
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                } rounded-lg p-6`}
              >
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Dear {formData.firstName} {formData.surname},
                </p>
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  We are pleased to send you your employment contract for review and signature.
                </p>
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Please click the link below to review your contract details and provide your
                  electronic signature:
                </p>

                <div className={`${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                } p-4 rounded-lg border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                } my-6`}>
                  <p className="text-sm text-gray-400 mb-2">Contract Link:</p>
                  <a
                    href={emailData.contractLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B00] hover:underline break-all font-mono text-sm"
                  >
                    {emailData.contractLink}
                  </a>
                </div>

                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Important:</strong> This link will expire on{" "}
                  <span className="text-[#FF6B00] font-semibold">{emailData.expiryDate}</span>.
                  Please complete your review and signature before this date.
                </p>

                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  If you have any questions or concerns, please don't hesitate to contact us.
                </p>

                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Best regards,
                  <br />
                  <strong>AVENTUS Team</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  Edit Contract
                </button>
                <button
                  onClick={() => {
                    alert("Contract email sent successfully!");
                    setShowEmailModal(false);
                    router.push("/dashboard/contractors");
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
