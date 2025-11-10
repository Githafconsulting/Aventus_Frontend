"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Mail,
  Phone,
  MapPin,
  User,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Briefcase,
  Clock,
  Globe,
  CreditCard,
  Receipt,
  Wallet,
  Banknote,
  PiggyBank,
  Plane,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/config";

export default function ReviewContractorPage() {
  const params = useParams();
  const router = useRouter();
  const contractorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contractor, setContractor] = useState<any>(null);
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState("");

  useEffect(() => {
    fetchContractor();
  }, [contractorId]);

  const fetchContractor = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        API_ENDPOINTS.contractorById(contractorId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contractor");
      }

      const data = await response.json();
      setContractor(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (
      !confirm(
        "Are you sure you want to approve this contractor? A contract email will be sent."
      )
    ) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        `${API_ENDPOINTS.contractors}/${contractorId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            approved: true,
            notes: "",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to approve contractor");
      }

      alert("Contractor approved successfully! Contract email sent.");
      router.push("/dashboard/contractors");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        `${API_ENDPOINTS.contractors}/${contractorId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            approved: false,
            notes: rejectionNotes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to reject contractor");
      }

      setShowRejectModal(false);
      alert("Contractor rejected successfully.");
      router.push("/dashboard/contractors");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const viewDocument = (documentUrl: string) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  // Section Header Component with Parallelogram Design
  const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <div
          className="relative bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white px-4 py-2 font-bold text-xs uppercase tracking-wide"
          style={{
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <Icon size={14} />
            {title}
          </div>
        </div>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[#FF6B00]/30 to-transparent"></div>
      </div>
    </div>
  );

  // Compact List Item Component
  const ListItem = ({
    icon: Icon,
    label,
    value,
    iconColor = "text-[#FF6B00]"
  }: {
    icon: any;
    label: string;
    value: string | React.ReactNode;
    iconColor?: string;
  }) => (
    <div className="grid grid-cols-[auto_120px_1fr] gap-3 items-start py-2.5 border-b last:border-b-0 border-gray-100">
      <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
        <Icon size={16} />
      </div>
      <div className="flex-shrink-0">
        <p className="text-xs text-gray-500 font-semibold">{label}</p>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {value || <span className="text-gray-400">Not provided</span>}
        </p>
      </div>
    </div>
  );

  // Compact Document Row Component
  const DocumentRow = ({
    label,
    documentUrl,
  }: {
    label: string;
    documentUrl: string | null;
  }) => {
    if (!documentUrl) return null;

    return (
      <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B00]/10 rounded flex items-center justify-center">
            <FileText className="text-[#FF6B00]" size={14} />
          </div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
        </div>
        <button
          onClick={() => viewDocument(documentUrl)}
          className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#FF8533] text-white rounded text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye size={12} />
          View
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!contractor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Contractor not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/contractors")}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Contractors
        </button>

        {/* Compact Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {contractor.first_name.charAt(0)}{contractor.surname.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {contractor.first_name} {contractor.surname}
                </h1>
                <p className="text-gray-500 text-sm">
                  {contractor.role || "Not specified"} {contractor.client_name && `at ${contractor.client_name}`}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500">
              <Clock size={14} />
              {contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1).replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Contact & Personal Information */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Contact & Personal Info" icon={User} />
              <div>
                <ListItem icon={Mail} label="Email" value={contractor.email} />
                <ListItem icon={Phone} label="Phone" value={contractor.phone} />
                {contractor.candidate_mobile && <ListItem icon={Phone} label="Mobile" value={contractor.candidate_mobile} />}
                <ListItem icon={Calendar} label="Date of Birth" value={contractor.dob} />
                <ListItem icon={Globe} label="Nationality" value={contractor.nationality} />
                <ListItem icon={User} label="Gender" value={contractor.gender} />
                <ListItem icon={MapPin} label="Home Address" value={contractor.home_address} />
                {contractor.current_location && <ListItem icon={MapPin} label="Current Location" value={contractor.current_location} />}
              </div>
            </div>

            {/* Placement Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Placement Details" icon={Briefcase} />
              <div>
                <ListItem icon={Building2} label="Client" value={contractor.client_name} />
                <ListItem icon={Briefcase} label="Role" value={contractor.role} />
                <ListItem icon={MapPin} label="Location" value={contractor.location} />
                <ListItem icon={Calendar} label="Start Date" value={contractor.start_date} />
                <ListItem icon={Calendar} label="End Date" value={contractor.end_date} />
                <ListItem icon={Clock} label="Duration" value={contractor.duration} />
              </div>
            </div>

            {/* Management Company */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Management Company" icon={Building2} />
              <div>
                <ListItem icon={Building2} label="Route" value={contractor.business_type} />
                <ListItem icon={Building2} label="Company" value={contractor.umbrella_company_name} />
                <ListItem icon={Building2} label="Registered" value={contractor.company_name} />
                <ListItem icon={MapPin} label="Address" value={contractor.registered_address} />
                <ListItem icon={FileText} label="VAT No" value={contractor.company_vat_no} />
                <ListItem icon={FileText} label="Reg No" value={contractor.company_reg_no} />
                <ListItem icon={CreditCard} label="Account" value={contractor.account_number} />
                <ListItem icon={CreditCard} label="IBAN" value={contractor.iban_number} />
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Financial Details" icon={CreditCard} />
              <div>
                <ListItem icon={DollarSign} label="Currency" value={contractor.currency || "AED"} iconColor="text-blue-500" />
                <ListItem icon={DollarSign} label="Client Charge" value={contractor.client_charge_rate ? `${contractor.currency} ${contractor.client_charge_rate}/mo` : null} iconColor="text-[#FF6B00]" />
                <ListItem icon={DollarSign} label="Candidate Pay" value={contractor.candidate_pay_rate ? `${contractor.currency} ${contractor.candidate_pay_rate}/mo` : null} iconColor="text-[#FF6B00]" />
                <ListItem icon={DollarSign} label="Basic Salary" value={contractor.candidate_basic_salary ? `${contractor.currency} ${contractor.candidate_basic_salary}` : null} iconColor="text-blue-500" />
                <ListItem icon={DollarSign} label="Gross Margin" value={(contractor.client_charge_rate && contractor.candidate_pay_rate) ? `${contractor.currency} ${parseFloat(contractor.client_charge_rate || 0) - parseFloat(contractor.candidate_pay_rate || 0)}/mo` : null} iconColor="text-green-500" />
                <ListItem icon={DollarSign} label="Contractor Costs" value={contractor.contractor_costs ? `${contractor.currency} ${contractor.contractor_costs}` : null} iconColor="text-red-500" />
              </div>
            </div>

            {/* Monthly Costs & Provisions */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Monthly Costs & Provisions" icon={Banknote} />
              <div>
                <ListItem icon={DollarSign} label="Mgmt Charges" value={contractor.management_company_charges ? `${contractor.currency} ${contractor.management_company_charges}` : null} />
                <ListItem icon={DollarSign} label="Taxes" value={contractor.taxes ? `${contractor.currency} ${contractor.taxes}` : null} />
                <ListItem icon={DollarSign} label="Bank Fees" value={contractor.bank_fees ? `${contractor.currency} ${contractor.bank_fees}` : null} />
                <ListItem icon={DollarSign} label="FX" value={contractor.fx ? `${contractor.currency} ${contractor.fx}` : null} />
                <ListItem icon={DollarSign} label="Nationalisation" value={contractor.nationalisation ? `${contractor.currency} ${contractor.nationalisation}` : null} />
                <ListItem icon={DollarSign} label="EOSB" value={contractor.eosb ? `${contractor.currency} ${contractor.eosb}` : null} iconColor="text-purple-500" />
                <ListItem icon={DollarSign} label="Vacation Pay" value={contractor.vacation_pay ? `${contractor.currency} ${contractor.vacation_pay}` : null} iconColor="text-purple-500" />
                <ListItem icon={DollarSign} label="Sick Leave" value={contractor.sick_leave ? `${contractor.currency} ${contractor.sick_leave}` : null} iconColor="text-purple-500" />
                <ListItem icon={DollarSign} label="Other Provision" value={contractor.other_provision ? `${contractor.currency} ${contractor.other_provision}` : null} iconColor="text-purple-500" />
              </div>
            </div>

            {/* One Time Costs */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="One Time Costs" icon={Plane} />
              <div>
                <ListItem icon={Plane} label="Flights" value={contractor.flights ? `${contractor.currency} ${contractor.flights}` : null} />
                <ListItem icon={FileText} label="Visa" value={contractor.visa ? `${contractor.currency} ${contractor.visa}` : null} />
                <ListItem icon={FileCheck} label="Medical Insurance" value={contractor.medical_insurance ? `${contractor.currency} ${contractor.medical_insurance}` : null} />
                <ListItem icon={DollarSign} label="Family Costs" value={contractor.family_costs ? `${contractor.currency} ${contractor.family_costs}` : null} />
                <ListItem icon={DollarSign} label="Other Costs" value={contractor.other_one_time_costs ? `${contractor.currency} ${contractor.other_one_time_costs}` : null} />
              </div>
            </div>

            {/* Costing Sheet */}
            {contractor.costing_sheet_data && contractor.costing_sheet_data.expenses && contractor.costing_sheet_data.expenses.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <SectionHeader title="Costing Sheet" icon={Receipt} />
                <div>
                  {contractor.costing_sheet_data.expenses.map((expense: any, index: number) => (
                    <div key={index} className="flex justify-between items-start py-2 border-b last:border-b-0 border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.category}</p>
                        {expense.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{expense.description}</p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900">{expense.currency} {expense.amount}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2.5 bg-[#FF6B00]/5 -mx-4 px-4 mt-2 rounded">
                    <p className="text-sm font-bold text-gray-900">Total Amount</p>
                    <p className="text-lg font-bold text-[#FF6B00]">
                      {contractor.costing_sheet_data.expenses[0]?.currency || "AED"} {contractor.costing_sheet_data.total_amount || 0}
                    </p>
                  </div>
                  {contractor.costing_sheet_data.notes && (
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Notes</p>
                      <p className="text-sm text-gray-900">{contractor.costing_sheet_data.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Aventus Deal */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Aventus Deal" icon={Briefcase} />
              <div>
                <ListItem icon={User} label="Consultant" value={contractor.consultant} />
                <ListItem icon={FileText} label="Any Splits?" value={contractor.any_splits} />
                <ListItem icon={User} label="Resourcer" value={contractor.resourcer} />
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Invoice Details" icon={Receipt} />
              <div>
                <ListItem icon={FileCheck} label="Timesheet Required?" value={contractor.timesheet_required} />
                <ListItem icon={User} label="Timesheet Approver" value={contractor.timesheet_approver_name} />
                <ListItem icon={Mail} label="Invoice Email" value={contractor.invoice_email} />
                <ListItem icon={User} label="Client Contact" value={contractor.client_contact} />
                <ListItem icon={MapPin} label="Address Line 1" value={contractor.invoice_address_line1} />
                <ListItem icon={MapPin} label="Address Line 2" value={contractor.invoice_address_line2} />
                <ListItem icon={MapPin} label="Address Line 3" value={contractor.invoice_address_line3} />
                <ListItem icon={MapPin} label="Address Line 4" value={contractor.invoice_address_line4} />
                <ListItem icon={Mail} label="PO Box" value={contractor.invoice_po_box} />
                <ListItem icon={FileText} label="Tax Number" value={contractor.invoice_tax_number} />
                <ListItem icon={Calendar} label="Contractor Pay Frequency" value={contractor.contractor_pay_frequency} />
                <ListItem icon={Calendar} label="Client Invoice Frequency" value={contractor.client_invoice_frequency} />
                <ListItem icon={FileText} label="Client Payment Terms" value={contractor.client_payment_terms} />
                <ListItem icon={FileText} label="Invoicing Preferences" value={contractor.invoicing_preferences} />
                <ListItem icon={FileCheck} label="Supporting Docs Required?" value={contractor.supporting_docs_required} />
                <ListItem icon={FileCheck} label="PO Required?" value={contractor.po_required} />
                <ListItem icon={FileText} label="PO Number" value={contractor.po_number} />
                {contractor.invoice_instructions && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Invoice Instructions</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{contractor.invoice_instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pay Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Pay Details" icon={Wallet} />
              <div>
                <ListItem icon={Building2} label="Umbrella or Direct?" value={contractor.umbrella_or_direct} />
                <ListItem icon={CreditCard} label="Bank Details" value={contractor.candidate_bank_details} />
                <ListItem icon={CreditCard} label="IBAN" value={contractor.candidate_iban} />
              </div>
            </div>

            {/* Additional Information */}
            {(contractor.upfront_invoices || contractor.security_deposit || contractor.laptop_provider || contractor.other_notes) && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <SectionHeader title="Additional Information" icon={FileText} />
                <div>
                  {contractor.upfront_invoices && <ListItem icon={FileText} label="Upfront Invoices" value={contractor.upfront_invoices} />}
                  {contractor.security_deposit && <ListItem icon={DollarSign} label="Security Deposit" value={`${contractor.currency} ${contractor.security_deposit}`} />}
                  {contractor.laptop_provider && <ListItem icon={Building2} label="Laptop Provider" value={contractor.laptop_provider} />}
                  {contractor.other_notes && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Other Notes</p>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{contractor.other_notes}</p>
                    </div>
                  )}
                  {contractor.invoice_instructions && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Invoice Instructions</p>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{contractor.invoice_instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <SectionHeader title="Uploaded Documents" icon={FileText} />
              <div>
                <DocumentRow label="Passport" documentUrl={contractor.passport_document} />
                <DocumentRow label="Photo" documentUrl={contractor.photo_document} />
                <DocumentRow label="Visa Page" documentUrl={contractor.visa_page_document} />
                <DocumentRow label="Emirates ID" documentUrl={contractor.emirates_id_document} />
                <DocumentRow label="Degree Certificate" documentUrl={contractor.degree_document} />

                {!contractor.passport_document &&
                  !contractor.photo_document &&
                  !contractor.visa_page_document &&
                  !contractor.emirates_id_document &&
                  !contractor.degree_document && (
                    <div className="text-center py-8">
                      <FileText className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm font-medium text-gray-700">No documents uploaded</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Full Width */}
        {contractor.status === "pending_review" && (
          <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Review Decision</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please review all information above before approving. A contract will be sent to the contractor.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={submitting}
                className="px-5 py-2.5 border-2 border-red-200 rounded-lg font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                <XCircle size={18} />
                Reject Application
              </button>

              <button
                onClick={handleApprove}
                disabled={submitting}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ml-auto text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Approve & Send Contract
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Application</h3>
            </div>

            <p className="text-gray-600 mb-4">Please provide a reason for rejection (optional):</p>

            <textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4 text-gray-900"
              placeholder="Enter rejection notes..."
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Rejecting...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
