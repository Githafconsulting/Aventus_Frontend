"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { API_ENDPOINTS } from "@/lib/config";
import {
  ArrowLeft,
  Building,
  User,
  CreditCard,
  Upload,
  X,
  CheckCircle,
  FileText,
  DollarSign,
} from "lucide-react";

interface DocumentToUpload {
  file: File;
  type: string;
}

export default function AddClientPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    company_reg_no: "",
    company_vat_no: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    address_line4: "",
    country: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    contact_person_title: "",
    bank_name: "",
    account_number: "",
    iban_number: "",
    swift_code: "",
    website: "",
    notes: "",
    is_active: true,
    // Payment Terms
    contractor_pay_frequency: "",
    client_invoice_frequency: "",
    client_payment_terms: "",
    invoicing_preferences: "",
    invoice_instructions: "",
    // Supporting Documents
    supporting_documents_required: [] as string[],
  });

  const [documentsToUpload, setDocumentsToUpload] = useState<DocumentToUpload[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && documentType) {
      const newDocs: DocumentToUpload[] = [];
      for (let i = 0; i < files.length; i++) {
        newDocs.push({ file: files[i], type: documentType });
      }
      setDocumentsToUpload((prev) => [...prev, ...newDocs]);
      setDocumentType("");
      e.target.value = "";
    }
  };

  const removeDocument = (index: number) => {
    setDocumentsToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      // Filter out empty strings and prepare data
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        // Keep booleans, non-empty strings, and non-empty arrays
        if (typeof value === 'boolean') {
          acc[key] = value;
        } else if (typeof value === 'string' && value !== '') {
          acc[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      console.log('[Add Client] URL:', API_ENDPOINTS.clients);
      console.log('[Add Client] Data:', cleanedData);

      // Create client
      const response = await fetch(API_ENDPOINTS.clients, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      console.log('[Add Client] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create client");
      }

      const createdClient = await response.json();
      console.log('[Add Client] Created client:', createdClient);

      // Upload documents if any
      if (documentsToUpload.length > 0) {
        for (const doc of documentsToUpload) {
          const formData = new FormData();
          formData.append("file", doc.file);
          formData.append("document_type", doc.type);

          await fetch(API_ENDPOINTS.clientUploadDocument(createdClient.id), {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        }
      }

      alert("Client created successfully!");
      router.push("/dashboard/clients");
    } catch (err: any) {
      console.error("[Add Client] Error creating client:", err);
      console.error("[Add Client] Error type:", typeof err);
      console.error("[Add Client] Error name:", err.name);
      setError(err.message || "Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-800 rounded-lg transition-all"
        >
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Add Client Company
          </h1>
          <p className="text-gray-400 mt-2">Create a new client company profile</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } card-parallelogram p-6 shadow-sm mb-6`}
        >
          {/* Company Information */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <Building size={20} className="text-white" />
              <span>Company Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., Technology, Finance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Registration No.
              </label>
              <input
                type="text"
                name="company_reg_no"
                value={formData.company_reg_no}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                VAT Number
              </label>
              <input
                type="text"
                name="company_vat_no"
                value={formData.company_vat_no}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="VAT number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Building, floor, unit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 3
              </label>
              <input
                type="text"
                name="address_line3"
                value={formData.address_line3}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="City, state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 4
              </label>
              <input
                type="text"
                name="address_line4"
                value={formData.address_line4}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Postal code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select country</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Egypt">Egypt</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Israel">Israel</option>
                <option value="Jordan">Jordan</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Oman">Oman</option>
                <option value="Palestine">Palestine</option>
                <option value="Qatar">Qatar</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Syria">Syria</option>
                <option value="Turkey">Turkey</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Yemen">Yemen</option>
              </select>
            </div>
          </div>

          {/* Contact Person */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <User size={20} className="text-white" />
              <span>Contact Person</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="contact_person_name"
                value={formData.contact_person_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="contact_person_title"
                value={formData.contact_person_title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., HR Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="contact_person_email"
                value={formData.contact_person_email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="contact_person_phone"
                value={formData.contact_person_phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="+971 XX XXX XXXX"
              />
            </div>
          </div>

          {/* Banking Details */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <CreditCard size={20} className="text-white" />
              <span>Banking Details</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Bank name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Account number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                IBAN Number
              </label>
              <input
                type="text"
                name="iban_number"
                value={formData.iban_number}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="IBAN number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                SWIFT Code
              </label>
              <input
                type="text"
                name="swift_code"
                value={formData.swift_code}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="SWIFT code"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <Upload size={20} className="text-white" />
              <span>Documents</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Document Type
              </label>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., Contract, Agreement, License"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                disabled={!documentType}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Documents to Upload */}
          {documentsToUpload.length > 0 && (
            <div className="mb-6 p-4 border-2 border-[#FF6B00] rounded-lg bg-[#FF6B00]/5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-[#FF6B00]" size={20} />
                <span className="text-sm font-semibold text-gray-400">
                  {documentsToUpload.length} document{documentsToUpload.length !== 1 ? "s" : ""} ready to upload
                </span>
              </div>
              <div className="space-y-2">
                {documentsToUpload.map((doc, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-[#FF6B00]" />
                      <div>
                        <p className="text-sm font-medium text-gray-300">
                          {doc.file.name}
                        </p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Terms */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <DollarSign size={20} className="text-white" />
              <span>Payment Terms</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Contractor Pay Frequency
              </label>
              <select
                name="contractor_pay_frequency"
                value={formData.contractor_pay_frequency}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select frequency</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Semi-monthly">Semi-monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Client Invoice Frequency
              </label>
              <select
                name="client_invoice_frequency"
                value={formData.client_invoice_frequency}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select frequency</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Semi-monthly">Semi-monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Client Payment Terms
              </label>
              <select
                name="client_payment_terms"
                value={formData.client_payment_terms}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select payment terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Invoicing Preferences
              </label>
              <select
                name="invoicing_preferences"
                value={formData.invoicing_preferences}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select preference</option>
                <option value="Consolidated">Consolidated</option>
                <option value="Per Worker">Per Worker</option>
                <option value="Consolidated per Project">Consolidated per Project</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Invoice Instructions
              </label>
              <textarea
                name="invoice_instructions"
                value={formData.invoice_instructions}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Special instructions for invoicing..."
              />
            </div>
          </div>

          {/* Supporting Documents Required */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <FileText size={20} className="text-white" />
              <span>Supporting Documents Required</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800/50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.supporting_documents_required.includes("Invoice")}
                  onChange={(e) => {
                    const docs = [...formData.supporting_documents_required];
                    if (e.target.checked) {
                      docs.push("Invoice");
                    } else {
                      const index = docs.indexOf("Invoice");
                      if (index > -1) docs.splice(index, 1);
                    }
                    setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                  }}
                  className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <span className="text-sm font-medium text-gray-300">Invoice</span>
              </label>
            </div>

            <div>
              <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800/50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.supporting_documents_required.includes("Timesheet")}
                  onChange={(e) => {
                    const docs = [...formData.supporting_documents_required];
                    if (e.target.checked) {
                      docs.push("Timesheet");
                    } else {
                      const index = docs.indexOf("Timesheet");
                      if (index > -1) docs.splice(index, 1);
                    }
                    setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                  }}
                  className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <span className="text-sm font-medium text-gray-300">Timesheet</span>
              </label>
            </div>

            <div>
              <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800/50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.supporting_documents_required.includes("Work Order")}
                  onChange={(e) => {
                    const docs = [...formData.supporting_documents_required];
                    if (e.target.checked) {
                      docs.push("Work Order");
                    } else {
                      const index = docs.indexOf("Work Order");
                      if (index > -1) docs.splice(index, 1);
                    }
                    setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                  }}
                  className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <span className="text-sm font-medium text-gray-300">Work Order</span>
              </label>
            </div>

            <div>
              <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800/50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.supporting_documents_required.includes("Contract")}
                  onChange={(e) => {
                    const docs = [...formData.supporting_documents_required];
                    if (e.target.checked) {
                      docs.push("Contract");
                    } else {
                      const index = docs.indexOf("Contract");
                      if (index > -1) docs.splice(index, 1);
                    }
                    setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                  }}
                  className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <span className="text-sm font-medium text-gray-300">Contract</span>
              </label>
            </div>

            <div>
              <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800/50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.supporting_documents_required.includes("PO")}
                  onChange={(e) => {
                    const docs = [...formData.supporting_documents_required];
                    if (e.target.checked) {
                      docs.push("PO");
                    } else {
                      const index = docs.indexOf("PO");
                      if (index > -1) docs.splice(index, 1);
                    }
                    setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                  }}
                  className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <span className="text-sm font-medium text-gray-300">Purchase Order (PO)</span>
              </label>
            </div>

            <div>
              <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800/50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.supporting_documents_required.includes("Other")}
                  onChange={(e) => {
                    const docs = [...formData.supporting_documents_required];
                    if (e.target.checked) {
                      docs.push("Other");
                    } else {
                      const index = docs.indexOf("Other");
                      if (index > -1) docs.splice(index, 1);
                    }
                    setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                  }}
                  className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <span className="text-sm font-medium text-gray-300">Other</span>
              </label>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <FileText size={20} className="text-white" />
              <span>Additional Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              placeholder="Any additional notes about this client..."
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 btn-parallelogram bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 btn-parallelogram bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Client"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
