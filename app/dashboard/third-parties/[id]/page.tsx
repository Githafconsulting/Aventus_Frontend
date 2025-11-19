"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { API_ENDPOINTS } from "@/lib/config";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Globe,
  ArrowLeft,
  Edit2,
  CheckCircle,
  XCircle,
  Briefcase,
} from "lucide-react";

interface WorkflowConfig {
  quote_sheet_applicable?: boolean;
  cds_applicable?: boolean;
  cost_sheet_applicable?: boolean;
  work_order_applicable?: boolean;
  proposal_applicable?: boolean;
  cohf_applicable?: boolean;
  contractor_contract_applicable?: boolean;
  contractor_contract_provider?: string | null;
  schedule_form_applicable?: boolean;
  custom_fields?: Array<{
    field_name: string;
    value_type: string;
    value?: string;
    options?: string[];
  }>;
}

interface ThirdParty {
  id: string;
  country: string | null;
  company_type: string | null;
  workflow_config: WorkflowConfig | null;
  company_name: string;
  address_line1: string | null;
  address_line2: string | null;
  address_line3: string | null;
  address_line4: string | null;
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
  created_at: string;
  updated_at: string | null;
  documents: Array<{
    type: string;
    filename: string;
    url: string;
    uploaded_at: string;
  }>;
}

export default function ViewThirdPartyPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const [thirdParty, setThirdParty] = useState<ThirdParty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchThirdParty();
    }
  }, [id]);

  const fetchThirdParty = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(API_ENDPOINTS.thirdPartyById(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("aventus-auth-token");
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch third party");
      }

      const data = await response.json();
      setThirdParty(data);
    } catch (err: any) {
      console.error("Error fetching third party:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading third party details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !thirdParty) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">
            {error || "Third party not found"}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (is_active: boolean) => {
    if (is_active) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 flex items-center gap-1 w-fit">
          <CheckCircle size={12} />
          Active
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 flex items-center gap-1 w-fit">
          <XCircle size={12} />
          Inactive
        </span>
      );
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/third-parties")}
            className={`p-2 rounded-lg transition-all ${
              theme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-gray-100"
            }`}
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {thirdParty.company_name}
            </h1>
            <p className="text-gray-400 mt-2">
              Third party company details
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/dashboard/third-parties/edit/${id}`)}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Edit2 size={20} />
          Edit Details
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-6">{getStatusBadge(thirdParty.is_active)}</div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Company Information */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <h2
            className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <Building2 size={20} className="text-[#FF6B00]" />
            Company Information
          </h2>
          <div className={`divide-y ${theme === "dark" ? "divide-gray-800" : "divide-gray-200"}`}>
            <div className="pb-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider">
                Company Name
              </label>
              <p
                className={`text-sm font-medium mt-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {thirdParty.company_name}
              </p>
            </div>

            {thirdParty.country && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Globe size={12} />
                  Country
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.country}
                </p>
              </div>
            )}

            {thirdParty.company_type && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Briefcase size={12} />
                  Company Type
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.company_type}
                </p>
              </div>
            )}

            {(thirdParty.address_line1 || thirdParty.address_line2 || thirdParty.address_line3 || thirdParty.address_line4) && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} />
                  Address
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {[thirdParty.address_line1, thirdParty.address_line2, thirdParty.address_line3, thirdParty.address_line4]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {thirdParty.company_reg_no && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} />
                  Registration Number
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.company_reg_no}
                </p>
              </div>
            )}

            {thirdParty.company_vat_no && (
              <div className="pt-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} />
                  VAT Number
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.company_vat_no}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <h2
            className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <Phone size={20} className="text-[#FF6B00]" />
            Contact Information
          </h2>
          <div className={`divide-y ${theme === "dark" ? "divide-gray-800" : "divide-gray-200"}`}>
            {thirdParty.contact_person_name && (
              <div className="pb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Contact Person
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.contact_person_name}
                </p>
              </div>
            )}

            {thirdParty.contact_person_email && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail size={12} />
                  Email
                </label>
                <a
                  href={`mailto:${thirdParty.contact_person_email}`}
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors mt-1 block"
                >
                  {thirdParty.contact_person_email}
                </a>
              </div>
            )}

            {thirdParty.contact_person_phone && (
              <div className="pt-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone size={12} />
                  Phone
                </label>
                <a
                  href={`tel:${thirdParty.contact_person_phone}`}
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors mt-1 block"
                >
                  {thirdParty.contact_person_phone}
                </a>
              </div>
            )}

            {!thirdParty.contact_person_name && !thirdParty.contact_person_email && !thirdParty.contact_person_phone && (
              <p className="text-sm text-gray-400">No contact information available</p>
            )}
          </div>
        </div>
      </div>

      {/* Banking Details */}
      {(thirdParty.bank_name || thirdParty.account_number || thirdParty.iban_number || thirdParty.swift_code) && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm mb-6`}
        >
          <h2
            className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <CreditCard size={20} className="text-[#FF6B00]" />
            Banking Details
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 ${theme === "dark" ? "divide-gray-800" : "divide-gray-200"}`}>
            {thirdParty.bank_name && (
              <div className="pb-4 md:pb-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Bank Name
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.bank_name}
                </p>
              </div>
            )}

            {thirdParty.account_number && (
              <div className="py-4 md:py-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Account Number
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.account_number}
                </p>
              </div>
            )}

            {thirdParty.iban_number && (
              <div className="py-4 md:py-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  IBAN Number
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.iban_number}
                </p>
              </div>
            )}

            {thirdParty.swift_code && (
              <div className="pt-4 md:pt-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  SWIFT Code
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {thirdParty.swift_code}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workflow Configuration */}
      {thirdParty.workflow_config && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm mb-6`}
        >
          <h2
            className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <FileText size={20} className="text-[#FF6B00]" />
            Workflow Configuration
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {thirdParty.workflow_config.quote_sheet_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Quote Sheet</span>
              </div>
            )}
            {thirdParty.workflow_config.cds_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">CDS</span>
              </div>
            )}
            {thirdParty.workflow_config.cost_sheet_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Cost Sheet</span>
              </div>
            )}
            {thirdParty.workflow_config.work_order_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Work Order</span>
              </div>
            )}
            {thirdParty.workflow_config.proposal_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Proposal</span>
              </div>
            )}
            {thirdParty.workflow_config.cohf_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">COHF</span>
              </div>
            )}
            {thirdParty.workflow_config.contractor_contract_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Contractor Contract</span>
              </div>
            )}
            {thirdParty.workflow_config.schedule_form_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Schedule Form</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {thirdParty.notes && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm mb-6`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Notes
          </h2>
          <p className="text-sm text-gray-400">{thirdParty.notes}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
