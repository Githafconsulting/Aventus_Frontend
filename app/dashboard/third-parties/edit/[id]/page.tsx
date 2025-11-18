"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { API_ENDPOINTS } from "@/lib/config";
import {
  ArrowLeft,
  Upload,
  X,
  FileText,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Download,
  Trash2,
  CheckCircle,
  Eye,
  Plus,
  Settings,
  User,
} from "lucide-react";

interface CustomField {
  field_name: string;
  value_type: "text" | "radio";
  value: string;
  options: string[];
}

interface WorkflowConfig {
  quote_sheet_applicable: boolean;
  cds_applicable: boolean;
  cost_sheet_applicable: boolean;
  work_order_applicable: boolean;
  proposal_applicable: boolean;
  cohf_applicable: boolean;
  contractor_contract_applicable: boolean;
  contractor_contract_provider: "Aventus" | "Third Party" | "";
  schedule_form_applicable: boolean;
  custom_fields: CustomField[];
}

interface ThirdParty {
  id: string;
  country: string | null;
  company_type: string | null;
  workflow_config: WorkflowConfig | null;
  company_name: string;
  registered_address: string | null;
  company_vat_no: string | null;
  company_reg_no: string | null;
  contact_person_name: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;
  bank_name: string | null;
  account_number: string | null;
  iban_number: string | null;
  swift_code: string | null;
  notes: string | null;
  is_active: boolean;
  documents: Array<{
    type: string;
    filename: string;
    url: string;
    uploaded_at: string;
  }>;
  created_at: string;
  updated_at: string | null;
}

export default function EditThirdPartyPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [thirdParty, setThirdParty] = useState<ThirdParty | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company_name: "",
    country: "",
    company_type: "",
    registered_address: "",
    company_vat_no: "",
    company_reg_no: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    bank_name: "",
    account_number: "",
    iban_number: "",
    swift_code: "",
    notes: "",
    is_active: true,
  });

  // Workflow Configuration State
  const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig>({
    quote_sheet_applicable: false,
    cds_applicable: false,
    cost_sheet_applicable: false,
    work_order_applicable: false,
    proposal_applicable: false,
    cohf_applicable: false,
    contractor_contract_applicable: false,
    contractor_contract_provider: "",
    schedule_form_applicable: false,
    custom_fields: [],
  });

  const [addingCustomField, setAddingCustomField] = useState(false);
  const [newCustomField, setNewCustomField] = useState<CustomField>({
    field_name: "",
    value_type: "text",
    value: "",
    options: [""],
  });

  // Document upload state
  const [newDocuments, setNewDocuments] = useState<
    Array<{ file: File; type: string }>
  >([]);
  const [documentType, setDocumentType] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch third party data
  useEffect(() => {
    fetchThirdParty();
  }, [id]);

  const fetchThirdParty = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        router.push("/dashboard/third-parties");
        return;
      }

      const response = await fetch(
        API_ENDPOINTS.thirdPartyById(id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch third party");
      }

      const data = await response.json();
      setThirdParty(data);
      setFormData({
        company_name: data.company_name,
        country: data.country || "",
        company_type: data.company_type || "",
        registered_address: data.registered_address || "",
        company_vat_no: data.company_vat_no || "",
        company_reg_no: data.company_reg_no || "",
        contact_person_name: data.contact_person_name || "",
        contact_person_email: data.contact_person_email || "",
        contact_person_phone: data.contact_person_phone || "",
        bank_name: data.bank_name || "",
        account_number: data.account_number || "",
        iban_number: data.iban_number || "",
        swift_code: data.swift_code || "",
        notes: data.notes || "",
        is_active: data.is_active,
      });

      // Populate workflow config if it exists
      if (data.workflow_config) {
        setWorkflowConfig({
          quote_sheet_applicable: data.workflow_config.quote_sheet_applicable || false,
          cds_applicable: data.workflow_config.cds_applicable || false,
          cost_sheet_applicable: data.workflow_config.cost_sheet_applicable || false,
          work_order_applicable: data.workflow_config.work_order_applicable || false,
          proposal_applicable: data.workflow_config.proposal_applicable || false,
          cohf_applicable: data.workflow_config.cohf_applicable || false,
          contractor_contract_applicable: data.workflow_config.contractor_contract_applicable || false,
          contractor_contract_provider: data.workflow_config.contractor_contract_provider || "",
          schedule_form_applicable: data.workflow_config.schedule_form_applicable || false,
          custom_fields: data.workflow_config.custom_fields || [],
        });
      }
    } catch (err) {
      console.error("Error fetching third party:", err);
      alert("Failed to load third party data");
      router.push("/dashboard/third-parties");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowChange = (field: string, value: any) => {
    setWorkflowConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomField = () => {
    if (!newCustomField.field_name) {
      alert("Please enter a field name");
      return;
    }

    setWorkflowConfig((prev) => ({
      ...prev,
      custom_fields: [
        ...prev.custom_fields,
        {
          ...newCustomField,
          options: newCustomField.value_type === "radio" ? newCustomField.options.filter(opt => opt.trim() !== "") : [],
        },
      ],
    }));

    setNewCustomField({
      field_name: "",
      value_type: "text",
      value: "",
      options: [""],
    });
    setAddingCustomField(false);
  };

  const handleRemoveCustomField = (index: number) => {
    setWorkflowConfig((prev) => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((_, i) => i !== index),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!documentType) {
        alert("Please enter a document type/description first");
        e.target.value = ""; // Reset input
        return;
      }
      setNewDocuments([...newDocuments, { file, type: documentType }]);
      setDocumentType("");
      // Reset file input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const removeNewDocument = (index: number) => {
    setNewDocuments(newDocuments.filter((_, i) => i !== index));
  };

  const deleteExistingDocument = async (docIndex: number) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.thirdPartyById(id)}/documents/${docIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      alert("Document deleted successfully");
      fetchThirdParty();
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document");
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      // Validate form
      if (!formData.company_name) {
        alert("Please enter company name");
        return;
      }

      // Step 1: Update third party
      const payload = {
        ...formData,
        workflow_config: workflowConfig,
      };

      const response = await fetch(
        API_ENDPOINTS.thirdPartyById(id),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update third party");
      }

      // Step 2: Upload new documents if any
      if (newDocuments.length > 0) {
        setUploadingDocs(true);
        let uploadedCount = 0;
        for (const doc of newDocuments) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", doc.file);
          uploadFormData.append("document_type", doc.type);

          const uploadResponse = await fetch(
            `${API_ENDPOINTS.thirdPartyById(id)}/upload-document`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: uploadFormData,
            }
          );

          if (uploadResponse.ok) {
            uploadedCount++;
          } else {
            console.error("Failed to upload document:", doc.file.name);
          }
        }
        setUploadingDocs(false);
        setNewDocuments([]);

        if (uploadedCount > 0) {
          alert(`${formData.company_name} updated successfully! ${uploadedCount} document(s) uploaded.`);
        }
      } else {
        alert(`${formData.company_name} updated successfully!`);
      }

      // Refresh the data to show newly uploaded documents
      await fetchThirdParty();
      router.push("/dashboard/third-parties");
    } catch (err: any) {
      console.error("Error updating third party:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
      setUploadingDocs(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading third party data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!thirdParty) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Third party not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-4"
        >
          <ArrowLeft size={20} />
          Back to Third Parties
        </button>
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Edit Third Party Company
        </h1>
        <p className="text-gray-400 mt-2">
          Update company details and manage documents
        </p>
      </div>

      {/* Main Form */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-sm p-6 space-y-8`}
      >
        {/* Company Information */}
        <div>
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
              }}
            >
              <Building2 size={20} className="text-white" />
              <span>Company Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Registered Address
              </label>
              <input
                type="text"
                placeholder="Enter registered address"
                value={formData.registered_address}
                onChange={(e) =>
                  setFormData({ ...formData, registered_address: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company Registration Number
                </label>
                <input
                  type="text"
                  placeholder="Enter registration number"
                  value={formData.company_reg_no}
                  onChange={(e) =>
                    setFormData({ ...formData, company_reg_no: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  VAT Number
                </label>
                <input
                  type="text"
                  placeholder="Enter VAT number"
                  value={formData.company_vat_no}
                  onChange={(e) =>
                    setFormData({ ...formData, company_vat_no: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Country & Workflow Configuration */}
        <div>
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
              }}
            >
              <Settings size={20} className="text-white" />
              <span>Country & Workflow Configuration</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company Type
                </label>
                <input
                  type="text"
                  placeholder="Enter company type"
                  value={formData.company_type}
                  onChange={(e) =>
                    setFormData({ ...formData, company_type: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>

            {/* Workflow Configuration */}
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Document Applicability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowConfig.quote_sheet_applicable}
                    onChange={(e) => handleWorkflowChange("quote_sheet_applicable", e.target.checked)}
                    className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Quote Sheet (QS)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowConfig.cds_applicable}
                    onChange={(e) => handleWorkflowChange("cds_applicable", e.target.checked)}
                    className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Contract Deal Sheet (CDS)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowConfig.cost_sheet_applicable}
                    onChange={(e) => handleWorkflowChange("cost_sheet_applicable", e.target.checked)}
                    className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Cost Sheet (CS)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowConfig.work_order_applicable}
                    onChange={(e) => handleWorkflowChange("work_order_applicable", e.target.checked)}
                    className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Work Order (WO)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowConfig.proposal_applicable}
                    onChange={(e) => handleWorkflowChange("proposal_applicable", e.target.checked)}
                    className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Proposal Form (PP)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowConfig.cohf_applicable}
                    onChange={(e) => handleWorkflowChange("cohf_applicable", e.target.checked)}
                    className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">Cost of Hire Form (COHF)</span>
                </label>
              </div>
            </div>

            {/* Contractor Contract Configuration */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={workflowConfig.contractor_contract_applicable}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setWorkflowConfig(prev => ({
                      ...prev,
                      contractor_contract_applicable: isChecked,
                      contractor_contract_provider: isChecked ? prev.contractor_contract_provider : "",
                      schedule_form_applicable: !isChecked ? prev.schedule_form_applicable : false,
                    }));
                  }}
                  className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <span className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Contractor Contract (CC)
                </span>
              </div>

              {workflowConfig.contractor_contract_applicable && (
                <div className="ml-8 mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Who provides the contractor contract?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={workflowConfig.contractor_contract_provider === "Aventus"}
                        onChange={() => handleWorkflowChange("contractor_contract_provider", "Aventus")}
                        className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                      <span className="text-gray-400">Aventus</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={workflowConfig.contractor_contract_provider === "Third Party"}
                        onChange={() => handleWorkflowChange("contractor_contract_provider", "Third Party")}
                        className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                      <span className="text-gray-400">Third Party</span>
                    </label>
                  </div>
                </div>
              )}

              {!workflowConfig.contractor_contract_applicable && (
                <div className="ml-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workflowConfig.schedule_form_applicable}
                      onChange={(e) => handleWorkflowChange("schedule_form_applicable", e.target.checked)}
                      className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                    />
                    <span className="text-gray-400">Schedule Form (SF)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Custom Fields */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Custom Fields
                </h3>
                {!addingCustomField && (
                  <button
                    onClick={() => setAddingCustomField(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg transition-all text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Custom Field
                  </button>
                )}
              </div>

              {/* Display existing custom fields */}
              {workflowConfig.custom_fields.length > 0 && (
                <div className="space-y-2 mb-4">
                  {workflowConfig.custom_fields.map((field, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {field.field_name}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-400">
                            {field.value_type}
                          </span>
                        </div>
                        {field.value_type === "radio" && field.options.length > 0 && (
                          <div className="text-sm text-gray-400">
                            Options: {field.options.join(", ")}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveCustomField(index)}
                        className="text-red-500 hover:text-red-400 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new custom field form */}
              {addingCustomField && (
                <div className={`p-4 rounded-lg border-2 border-[#FF6B00] ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Field Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter field name"
                        value={newCustomField.field_name}
                        onChange={(e) =>
                          setNewCustomField({ ...newCustomField, field_name: e.target.value })
                        }
                        className={`w-full px-4 py-2 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Field Type
                      </label>
                      <select
                        value={newCustomField.value_type}
                        onChange={(e) =>
                          setNewCustomField({
                            ...newCustomField,
                            value_type: e.target.value as "text" | "radio",
                            value: e.target.value === "radio" ? "" : newCustomField.value,
                            options: e.target.value === "radio" ? [""] : [],
                          })
                        }
                        className={`w-full px-4 py-2 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-900 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      >
                        <option value="text">Text</option>
                        <option value="radio">Radio Button</option>
                      </select>
                    </div>

                    {newCustomField.value_type === "radio" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {newCustomField.options.map((option, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newCustomField.options];
                                  newOptions[idx] = e.target.value;
                                  setNewCustomField({ ...newCustomField, options: newOptions });
                                }}
                                className={`flex-1 px-4 py-2 rounded-lg border transition-all outline-none ${
                                  theme === "dark"
                                    ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                              />
                              {newCustomField.options.length > 1 && (
                                <button
                                  onClick={() => {
                                    const newOptions = newCustomField.options.filter((_, i) => i !== idx);
                                    setNewCustomField({ ...newCustomField, options: newOptions });
                                  }}
                                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setNewCustomField({
                                ...newCustomField,
                                options: [...newCustomField.options, ""],
                              });
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#FF6B00] hover:bg-[#FF6B00]/10 rounded-lg transition-all"
                          >
                            <Plus size={14} />
                            Add Option
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddCustomField}
                        className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white py-2 rounded-lg transition-all font-medium"
                      >
                        Add Field
                      </button>
                      <button
                        onClick={() => {
                          setAddingCustomField(false);
                          setNewCustomField({
                            field_name: "",
                            value_type: "text",
                            value: "",
                            options: [""],
                          });
                        }}
                        className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                          theme === "dark"
                            ? "bg-gray-900 hover:bg-gray-700 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
              }}
            >
              <Mail size={20} className="text-white" />
              <span>Contact Person</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="Enter contact person name"
                value={formData.contact_person_name}
                onChange={(e) =>
                  setFormData({ ...formData, contact_person_name: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.contact_person_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person_email: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contact_person_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person_phone: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div>
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
              }}
            >
              <CreditCard size={20} className="text-white" />
              <span>Banking Details</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="Enter bank name"
                value={formData.bank_name}
                onChange={(e) =>
                  setFormData({ ...formData, bank_name: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={formData.account_number}
                  onChange={(e) =>
                    setFormData({ ...formData, account_number: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  IBAN Number
                </label>
                <input
                  type="text"
                  placeholder="Enter IBAN number"
                  value={formData.iban_number}
                  onChange={(e) =>
                    setFormData({ ...formData, iban_number: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                SWIFT Code
              </label>
              <input
                type="text"
                placeholder="Enter SWIFT code"
                value={formData.swift_code}
                onChange={(e) =>
                  setFormData({ ...formData, swift_code: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>
        </div>

        {/* Documents Management */}
        <div>
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
              }}
            >
              <FileText size={20} className="text-white" />
              <span>Documents</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          {/* Existing Documents */}
          {thirdParty.documents && thirdParty.documents.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-400 mb-3">
                Existing Documents ({thirdParty.documents.length})
              </p>
              <div className="space-y-2">
                {thirdParty.documents.map((doc, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-green-500" />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {doc.filename}
                        </p>
                        <p className="text-xs text-gray-400">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-all text-sm font-medium"
                      >
                        <Eye size={14} />
                        View
                      </a>
                      <a
                        href={doc.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all text-sm font-medium"
                      >
                        <Download size={14} />
                        Download
                      </a>
                      <button
                        onClick={() => deleteExistingDocument(index)}
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
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-400">Upload New Documents</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Document Type/Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Trade License, VAT Certificate"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Upload Document
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="doc-upload-edit"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="doc-upload-edit"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                      documentType
                        ? "border-[#FF6B00] hover:border-[#FF6B00] bg-[#FF6B00]/5"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <Upload size={20} className={documentType ? "text-[#FF6B00]" : "text-gray-400"} />
                    <span className={documentType ? "text-[#FF6B00]" : "text-gray-400"}>
                      {documentType ? "Click to select file" : "Enter document type first"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* New Documents to Upload List */}
            {newDocuments.length > 0 && (
              <div className="space-y-2 p-4 rounded-lg border-2 border-[#FF6B00] bg-[#FF6B00]/5">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#FF6B00]" />
                  <p className="text-sm font-semibold text-[#FF6B00]">
                    {newDocuments.length} document{newDocuments.length > 1 ? "s" : ""} ready to upload
                  </p>
                </div>
                <div className="space-y-2">
                  {newDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-500" />
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {doc.file.name}
                          </p>
                          <p className="text-xs text-gray-400">{doc.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeNewDocument(index)}
                        className="text-red-500 hover:text-red-400 transition-all"
                        title="Remove from upload queue"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Click "Update Third Party" to save changes and upload documents
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
              }}
            >
              <FileText size={20} className="text-white" />
              <span>Additional Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Notes
              </label>
              <textarea
                rows={4}
                placeholder="Enter any additional notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                value={formData.is_active ? "active" : "inactive"}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.value === "active" })
                }
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.back()}
          disabled={submitting || uploadingDocs}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          } disabled:opacity-50`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || uploadingDocs}
          className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploadingDocs ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading Documents...
            </>
          ) : submitting ? (
            "Updating..."
          ) : (
            "Update Third Party"
          )}
        </button>
      </div>
    </DashboardLayout>
  );
}
