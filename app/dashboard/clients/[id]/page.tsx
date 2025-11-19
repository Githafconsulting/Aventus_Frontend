"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { API_ENDPOINTS } from "@/lib/config";
import {
  Building,
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
  DollarSign,
  User,
} from "lucide-react";

interface Project {
  name: string;
  description: string;
  status: string;
}

interface Client {
  id: string;
  company_name: string;
  industry: string | null;
  company_reg_no: string | null;
  company_vat_no: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_line3: string | null;
  address_line4: string | null;
  country: string | null;
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
  work_order_applicable: boolean;
  proposal_applicable: boolean;
  timesheet_required: boolean;
  timesheet_approver_name: string | null;
  po_required: boolean;
  po_number: string | null;
  contractor_pay_frequency: string | null;
  client_invoice_frequency: string | null;
  client_payment_terms: string | null;
  invoicing_preferences: string | null;
  invoice_delivery_method: string | null;
  invoice_instructions: string | null;
  supporting_documents_required: string[];
  projects: Project[];
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function ViewClientPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(API_ENDPOINTS.clientById(id), {
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
        throw new Error("Failed to fetch client");
      }

      const data = await response.json();
      setClient(data);
    } catch (err: any) {
      console.error("Error fetching client:", err);
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
          <p className="text-gray-400 mt-4">Loading client details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{error || "Client not found"}</p>
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
            onClick={() => router.push("/dashboard/clients")}
            className={`p-2 rounded-lg transition-all ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
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
              {client.company_name}
            </h1>
            <p className="text-gray-400 mt-2">Client company details</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/dashboard/clients/edit/${id}`)}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Edit2 size={20} />
          Edit Details
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-6">{getStatusBadge(client.is_active)}</div>

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
            <Building size={20} className="text-[#FF6B00]" />
            Company Information
          </h2>
          <div
            className={`divide-y ${
              theme === "dark" ? "divide-gray-800" : "divide-gray-200"
            }`}
          >
            <div className="pb-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider">
                Company Name
              </label>
              <p
                className={`text-sm font-medium mt-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {client.company_name}
              </p>
            </div>

            {client.industry && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Briefcase size={12} />
                  Industry
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.industry}
                </p>
              </div>
            )}

            {client.website && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Globe size={12} />
                  Website
                </label>
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors mt-1 block"
                >
                  {client.website}
                </a>
              </div>
            )}

            {(client.address_line1 ||
              client.address_line2 ||
              client.address_line3 ||
              client.address_line4) && (
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
                  {[
                    client.address_line1,
                    client.address_line2,
                    client.address_line3,
                    client.address_line4,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {client.country && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Country
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.country}
                </p>
              </div>
            )}

            {client.company_reg_no && (
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
                  {client.company_reg_no}
                </p>
              </div>
            )}

            {client.company_vat_no && (
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
                  {client.company_vat_no}
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
            <User size={20} className="text-[#FF6B00]" />
            Contact Person
          </h2>
          <div
            className={`divide-y ${
              theme === "dark" ? "divide-gray-800" : "divide-gray-200"
            }`}
          >
            {client.contact_person_name && (
              <div className="pb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Name
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.contact_person_name}
                </p>
              </div>
            )}

            {client.contact_person_title && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Job Title
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.contact_person_title}
                </p>
              </div>
            )}

            {client.contact_person_email && (
              <div className="py-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail size={12} />
                  Email
                </label>
                <a
                  href={`mailto:${client.contact_person_email}`}
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors mt-1 block"
                >
                  {client.contact_person_email}
                </a>
              </div>
            )}

            {client.contact_person_phone && (
              <div className="pt-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone size={12} />
                  Phone
                </label>
                <a
                  href={`tel:${client.contact_person_phone}`}
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors mt-1 block"
                >
                  {client.contact_person_phone}
                </a>
              </div>
            )}

            {!client.contact_person_name &&
              !client.contact_person_email &&
              !client.contact_person_phone &&
              !client.contact_person_title && (
                <p className="text-sm text-gray-400">
                  No contact information available
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Banking Details */}
      {(client.bank_name ||
        client.account_number ||
        client.iban_number ||
        client.swift_code) && (
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
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 ${
              theme === "dark" ? "divide-gray-800" : "divide-gray-200"
            }`}
          >
            {client.bank_name && (
              <div className="pb-4 md:pb-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Bank Name
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.bank_name}
                </p>
              </div>
            )}

            {client.account_number && (
              <div className="py-4 md:py-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Account Number
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.account_number}
                </p>
              </div>
            )}

            {client.iban_number && (
              <div className="py-4 md:py-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  IBAN Number
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.iban_number}
                </p>
              </div>
            )}

            {client.swift_code && (
              <div className="pt-4 md:pt-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  SWIFT Code
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.swift_code}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Terms */}
      {(client.contractor_pay_frequency ||
        client.client_invoice_frequency ||
        client.client_payment_terms ||
        client.invoicing_preferences ||
        client.invoice_delivery_method ||
        client.invoice_instructions) && (
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
            <DollarSign size={20} className="text-[#FF6B00]" />
            Payment Terms
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 ${
              theme === "dark" ? "divide-gray-800" : "divide-gray-200"
            }`}
          >
            {client.contractor_pay_frequency && (
              <div className="pb-4 md:pb-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Contractor Pay Frequency
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.contractor_pay_frequency}
                </p>
              </div>
            )}

            {client.client_invoice_frequency && (
              <div className="py-4 md:py-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Client Invoice Frequency
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.client_invoice_frequency}
                </p>
              </div>
            )}

            {client.client_payment_terms && (
              <div className="py-4 md:py-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Client Payment Terms
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.client_payment_terms}
                </p>
              </div>
            )}

            {client.invoicing_preferences && (
              <div className="py-4 md:py-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Invoicing Preferences
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.invoicing_preferences}
                </p>
              </div>
            )}

            {client.invoice_delivery_method && (
              <div className="pt-4 md:pt-0">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Invoice Delivery Method
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.invoice_delivery_method}
                </p>
              </div>
            )}

            {client.invoice_instructions && (
              <div className="pt-4 md:col-span-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Invoice Instructions
                </label>
                <p
                  className={`text-sm font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {client.invoice_instructions}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Supporting Documents Required */}
      {client.supporting_documents_required &&
        client.supporting_documents_required.length > 0 && (
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
              Supporting Documents Required
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {client.supporting_documents_required.map((doc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm text-gray-400">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Projects */}
      {client.projects && client.projects.length > 0 && (
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
            <Briefcase size={20} className="text-[#FF6B00]" />
            Projects
          </h2>
          <div className="space-y-4">
            {client.projects.map((project, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-800/50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {project.name}
                  </h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-400">
                    {project.status}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-400">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow & Configuration */}
      {(client.work_order_applicable ||
        client.proposal_applicable ||
        client.timesheet_required ||
        client.po_required) && (
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
            {client.work_order_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Work Order</span>
              </div>
            )}
            {client.proposal_applicable && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Proposal</span>
              </div>
            )}
            {client.timesheet_required && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">
                  Timesheet Required
                  {client.timesheet_approver_name &&
                    ` (${client.timesheet_approver_name})`}
                </span>
              </div>
            )}
            {client.po_required && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">
                  PO Required
                  {client.po_number && ` (${client.po_number})`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {client.notes && (
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
          <p className="text-sm text-gray-400">{client.notes}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
