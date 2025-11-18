"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { API_ENDPOINTS } from "@/lib/config";
import {
  ArrowLeft,
  Building2,
  User,
  CreditCard,
  FileText,
  Settings,
  Plus,
  X,
} from "lucide-react";

interface CustomField {
  field_name: string;
  value_type: "text" | "radio";
  value: string;
  options: string[];
}

export default function AddThirdPartyPage() {
  const { theme } = useTheme();
  const router = useRouter();

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
  const [workflowConfig, setWorkflowConfig] = useState({
    quote_sheet_applicable: false,
    cds_applicable: false,
    cost_sheet_applicable: false,
    work_order_applicable: false,
    proposal_applicable: false,
    cohf_applicable: false,
    contractor_contract_applicable: false,
    contractor_contract_provider: "" as "Aventus" | "Third Party" | "",
    schedule_form_applicable: false,
    custom_fields: [] as CustomField[],
  });

  const [addingCustomField, setAddingCustomField] = useState(false);
  const [newCustomField, setNewCustomField] = useState<CustomField>({
    field_name: "",
    value_type: "text",
    value: "",
    options: [""],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      const payload = {
        ...formData,
        workflow_config: workflowConfig,
      };

      const response = await fetch(API_ENDPOINTS.thirdParties, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create third party");
      }

      alert("Third party created successfully!");
      router.push("/dashboard/third-parties");
    } catch (err: any) {
      console.error("Error creating third party:", err);
      setError(err.message || "Failed to create third party");
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
            Add Third Party Company
          </h1>
          <p className="text-gray-400 mt-2">Create a new third party company profile</p>
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
              <Building2 size={20} className="text-white" />
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
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select country</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="UAE">UAE</option>
                <option value="Qatar">Qatar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Type *
              </label>
              <select
                name="company_type"
                value={formData.company_type}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select type</option>
                <option value="3rd Party">3rd Party</option>
                <option value="3rd Party Payroll">3rd Party Payroll</option>
              </select>
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
                placeholder="Full address"
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="VAT number"
              />
            </div>
          </div>

          {/* Contact Person */}
          <div className="mb-6 mt-8">
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
                placeholder="Contact person name"
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="+971 XX XXX XXXX"
              />
            </div>
          </div>

          {/* Banking Details */}
          <div className="mb-6 mt-8">
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
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
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="SWIFT code"
              />
            </div>
          </div>

          {/* Workflow Configuration */}
          <div className="mb-6 mt-8">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <Settings size={20} className="text-white" />
              <span>Workflow Configuration</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          {/* Document Applicability Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={workflowConfig.quote_sheet_applicable}
                onChange={(e) => handleWorkflowChange("quote_sheet_applicable", e.target.checked)}
                className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-300">Quote Sheet (QS)</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={workflowConfig.cds_applicable}
                onChange={(e) => handleWorkflowChange("cds_applicable", e.target.checked)}
                className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-300">Contract Deal Sheet (CDS)</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={workflowConfig.cost_sheet_applicable}
                onChange={(e) => handleWorkflowChange("cost_sheet_applicable", e.target.checked)}
                className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-300">Cost Sheet (CS)</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={workflowConfig.work_order_applicable}
                onChange={(e) => handleWorkflowChange("work_order_applicable", e.target.checked)}
                className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-300">Work Order (WO)</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={workflowConfig.proposal_applicable}
                onChange={(e) => handleWorkflowChange("proposal_applicable", e.target.checked)}
                className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-300">Proposal Form (PP)</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={workflowConfig.cohf_applicable}
                onChange={(e) => handleWorkflowChange("cohf_applicable", e.target.checked)}
                className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-300">Cost of Hire Form (COHF)</span>
            </label>
          </div>

          {/* Contractor Contract Configuration */}
          <div className="mb-6">
            <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={workflowConfig.contractor_contract_applicable}
                onChange={(e) => {
                  handleWorkflowChange("contractor_contract_applicable", e.target.checked);
                  if (!e.target.checked) {
                    handleWorkflowChange("contractor_contract_provider", "");
                  }
                }}
                className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-300">Contractor Contract (CC)</span>
            </label>

            {/* If CC is applicable, show provider selection */}
            {workflowConfig.contractor_contract_applicable && (
              <div className="mt-4 ml-8">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Contract Provider *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contractor_contract_provider"
                      value="Aventus"
                      checked={workflowConfig.contractor_contract_provider === "Aventus"}
                      onChange={(e) => handleWorkflowChange("contractor_contract_provider", e.target.value)}
                      className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <span className="text-gray-400">Aventus</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contractor_contract_provider"
                      value="Third Party"
                      checked={workflowConfig.contractor_contract_provider === "Third Party"}
                      onChange={(e) => handleWorkflowChange("contractor_contract_provider", e.target.value)}
                      className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <span className="text-gray-400">Third Party</span>
                  </label>
                </div>
              </div>
            )}

            {/* If CC is NOT applicable, show schedule form option */}
            {!workflowConfig.contractor_contract_applicable && (
              <div className="mt-4 ml-8">
                <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-all ${
                  theme === "dark" ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-300 hover:bg-gray-100"
                }`}>
                  <input
                    type="checkbox"
                    checked={workflowConfig.schedule_form_applicable}
                    onChange={(e) => handleWorkflowChange("schedule_form_applicable", e.target.checked)}
                    className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                  />
                  <span className="text-sm font-medium text-gray-300">Schedule Form (SF)</span>
                </label>
              </div>
            )}
          </div>

          {/* Custom Fields */}
          <div className="mb-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Custom Fields</h3>
              <button
                type="button"
                onClick={() => setAddingCustomField(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg transition-all"
              >
                <Plus size={18} />
                <span>Add Custom Field</span>
              </button>
            </div>

            {/* Existing Custom Fields */}
            {workflowConfig.custom_fields.length > 0 && (
              <div className="space-y-3 mb-4">
                {workflowConfig.custom_fields.map((field, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-300">{field.field_name}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            field.value_type === "text" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                          }`}>
                            {field.value_type}
                          </span>
                        </div>
                        {field.value_type === "text" && (
                          <p className="text-sm text-gray-500">Value: {field.value || "(empty)"}</p>
                        )}
                        {field.value_type === "radio" && field.options && field.options.length > 0 && (
                          <p className="text-sm text-gray-500">Options: {field.options.join(", ")}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(index)}
                        className="p-2 hover:bg-red-500/20 rounded transition-all"
                      >
                        <X size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Field Form */}
            {addingCustomField && (
              <div className={`p-4 border-2 border-[#FF6B00] rounded-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
                <h4 className="text-md font-semibold text-gray-300 mb-4">New Custom Field</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Field Name *
                    </label>
                    <input
                      type="text"
                      value={newCustomField.field_name}
                      onChange={(e) => setNewCustomField(prev => ({ ...prev, field_name: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      placeholder="Enter field name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Value Type *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="text"
                          checked={newCustomField.value_type === "text"}
                          onChange={(e) => setNewCustomField(prev => ({ ...prev, value_type: "text", options: [""] }))}
                          className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                        />
                        <span className="text-gray-400">Text</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="radio"
                          checked={newCustomField.value_type === "radio"}
                          onChange={(e) => setNewCustomField(prev => ({ ...prev, value_type: "radio", value: "" }))}
                          className="w-4 h-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                        />
                        <span className="text-gray-400">Radio Buttons</span>
                      </label>
                    </div>
                  </div>

                  {newCustomField.value_type === "text" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Field Value
                      </label>
                      <input
                        type="text"
                        value={newCustomField.value}
                        onChange={(e) => setNewCustomField(prev => ({ ...prev, value: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                        placeholder="Enter value"
                      />
                    </div>
                  )}

                  {newCustomField.value_type === "radio" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Radio Button Options
                      </label>
                      {newCustomField.options.map((option, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newCustomField.options];
                              newOptions[idx] = e.target.value;
                              setNewCustomField(prev => ({ ...prev, options: newOptions }));
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg border transition-all outline-none ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                            placeholder={`Option ${idx + 1}`}
                          />
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newOptions = newCustomField.options.filter((_, i) => i !== idx);
                                setNewCustomField(prev => ({ ...prev, options: newOptions }));
                              }}
                              className="p-2 hover:bg-red-500/20 rounded transition-all"
                            >
                              <X size={18} className="text-red-500" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setNewCustomField(prev => ({ ...prev, options: [...prev.options, ""] }))}
                        className="text-sm text-[#FF6B00] hover:underline"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddCustomField}
                      className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg transition-all"
                    >
                      Add Field
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingCustomField(false);
                        setNewCustomField({
                          field_name: "",
                          value_type: "text",
                          value: "",
                          options: [""],
                        });
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
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
              placeholder="Any additional notes about this third party..."
            />
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
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Third Party"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
