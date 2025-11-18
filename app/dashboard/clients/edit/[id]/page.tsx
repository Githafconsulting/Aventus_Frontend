"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Download,
  Eye,
  Trash2,
} from "lucide-react";

interface DocumentToUpload {
  file: File;
  type: string;
}

interface ExistingDocument {
  type: string;
  filename: string;
  url: string;
  uploaded_at: string;
}

interface Client {
  id: string;
  company_name: string;
  industry: string | null;
  company_reg_no: string | null;
  company_vat_no: string | null;
  registered_address: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  contact_person_name: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;
  contact_person_title: string | null;
  bank_name: string | null;
  account_number: string | null;
  iban_number: string | null;
  swift_code: string | null;
  website: string | null;
  notes: string | null;
  is_active: boolean;
  documents: ExistingDocument[];
}

export default function EditClientPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;

  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    company_reg_no: "",
    company_vat_no: "",
    registered_address: "",
    city: "",
    country: "",
    postal_code: "",
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
  });

  const [client, setClient] = useState<Client | null>(null);
  const [existingDocuments, setExistingDocuments] = useState<ExistingDocument[]>([]);
  const [documentsToUpload, setDocumentsToUpload] = useState<DocumentToUpload[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch client data on mount
  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const fetchClient = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) return;

      const response = await fetch(API_ENDPOINTS.clientById(clientId as string), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setClient(data);
        setExistingDocuments(data.documents || []);

        // Populate form
        setFormData({
          company_name: data.company_name || "",
          industry: data.industry || "",
          company_reg_no: data.company_reg_no || "",
          company_vat_no: data.company_vat_no || "",
          registered_address: data.registered_address || "",
          city: data.city || "",
          country: data.country || "",
          postal_code: data.postal_code || "",
          contact_person_name: data.contact_person_name || "",
          contact_person_email: data.contact_person_email || "",
          contact_person_phone: data.contact_person_phone || "",
          contact_person_title: data.contact_person_title || "",
          bank_name: data.bank_name || "",
          account_number: data.account_number || "",
          iban_number: data.iban_number || "",
          swift_code: data.swift_code || "",
          website: data.website || "",
          notes: data.notes || "",
          is_active: data.is_active ?? true,
        });
      }
    } catch (err) {
      console.error("Error fetching client:", err);
      setError("Failed to load client");
    } finally {
      setLoading(false);
    }
  };

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

  const removeNewDocument = (index: number) => {
    setDocumentsToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingDocument = async (index: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) return;

      const response = await fetch(
        API_ENDPOINTS.clientDeleteDocument(clientId as string, index),
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Document deleted successfully");
        fetchClient();
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      // Update client
      const response = await fetch(API_ENDPOINTS.clientById(clientId as string), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update client");
      }

      // Upload new documents if any
      if (documentsToUpload.length > 0) {
        for (const doc of documentsToUpload) {
          const formData = new FormData();
          formData.append("file", doc.file);
          formData.append("document_type", doc.type);

          await fetch(API_ENDPOINTS.clientUploadDocument(clientId as string), {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        }
        setDocumentsToUpload([]);
      }

      alert("Client updated successfully!");
      router.push("/dashboard/clients");
    } catch (err: any) {
      console.error("Error updating client:", err);
      setError(err.message || "Failed to update client");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading client...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            Edit Client Company
          </h1>
          <p className="text-gray-400 mt-2">{client?.company_name}</p>
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
          } rounded-lg p-6 shadow-sm mb-6`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                name="registered_address"
                value={formData.registered_address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                name="account_number"
                value={formData.account_number}
                onChange={handleInputChange}
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
                name="iban_number"
                value={formData.iban_number}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
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

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Existing Documents
              </h3>
              <div className="space-y-2">
                {existingDocuments.map((doc, index) => (
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
                          {doc.filename}
                        </p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(doc.url, "_blank")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 transition-all text-sm font-medium"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <a
                        href={doc.url}
                        download
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all text-sm font-medium"
                      >
                        <Download size={14} />
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingDocument(index)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all text-sm font-medium"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Document Type
              </label>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* New Documents to Upload */}
          {documentsToUpload.length > 0 && (
            <div className="mb-6 p-4 border-2 border-[#FF6B00] rounded-lg bg-[#FF6B00]/5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-[#FF6B00]" size={20} />
                <span className="text-sm font-semibold text-gray-400">
                  {documentsToUpload.length} new document{documentsToUpload.length !== 1 ? "s" : ""} ready to upload
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
                      onClick={() => removeNewDocument(index)}
                      className="p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            />
          </div>

          {/* Work Order & Cost of Hire Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Work Order Required?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="work_order_required"
                    value="yes"
                    className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="work_order_required"
                    value="no"
                    defaultChecked
                    className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Cost of Hire Tracking Required?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cost_of_hire_required"
                    value="yes"
                    className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cost_of_hire_required"
                    value="no"
                    defaultChecked
                    className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Client"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
