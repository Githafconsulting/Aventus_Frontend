"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Briefcase,
  CreditCard,
  Globe,
  Image,
  Plane,
  GraduationCap,
  IdCard,
  File,
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

interface Contractor {
  id: string;
  status: string;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  dob: string;
  nationality: string;
  gender: string;
  home_address: string;
  role: string;
  client_name: string;
  start_date: string;
  end_date: string;
  location: string;
  duration: string;
  currency: string;
  candidate_pay_rate: number;
  client_charge_rate: number;
  umbrella_company_name: string;
  signed_date: string | null;
  activated_date: string | null;
  documents_uploaded_date: string | null;
  cds_form_data: any;
}

interface Document {
  document_name: string;
  document_type: string;
  document_url: string;
  uploaded_date: string | null;
}

export default function ContractorDetailPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const contractorId = params?.id as string;

  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contractorId) return;

    const loadContractor = async () => {
      try {
        const token = localStorage.getItem("aventus-auth-token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(
          API_ENDPOINTS.contractorById(contractorId),
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("aventus-auth-token");
          router.push("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch contractor");
        }

        const data = await response.json();
        setContractor(data);
      } catch (err) {
        console.error("Error loading contractor:", err);
        setError("Contractor Not Found");
      } finally {
        setLoading(false);
      }
    };

    loadContractor();
  }, [contractorId, router]);

  // Load documents
  useEffect(() => {
    if (!contractorId) return;

    const loadDocuments = async () => {
      setDocumentsLoading(true);
      try {
        const token = localStorage.getItem("aventus-auth-token");

        if (!token) {
          return;
        }

        const response = await fetch(
          API_ENDPOINTS.contractorDocuments(contractorId),
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        }
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setDocumentsLoading(false);
      }
    };

    loadDocuments();
  }, [contractorId]);

  const handleViewContract = async () => {
    if (!contractor) return;

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        API_ENDPOINTS.contractorSignedContract(contractor.id),
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        alert("Unable to view contract. It may not be signed yet.");
      }
    } catch (error) {
      console.error("Error viewing contract:", error);
      alert("Failed to load contract");
    }
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
      active: { bg: "bg-green-500/10", text: "text-green-500", icon: CheckCircle },
      signed: { bg: "bg-blue-500/10", text: "text-blue-500", icon: CheckCircle },
      pending_signature: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: Clock },
      documents_uploaded: { bg: "bg-cyan-500/10", text: "text-cyan-500", icon: Clock },
      pending_documents: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: AlertCircle },
      pending_review: { bg: "bg-orange-500/10", text: "text-orange-500", icon: Clock },
      approved: { bg: "bg-purple-500/10", text: "text-purple-500", icon: CheckCircle },
      draft: { bg: "bg-gray-500/10", text: "text-gray-500", icon: Clock },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        <Icon size={16} />
        {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
      </span>
    );
  };

  const getDocumentIcon = (docType: string) => {
    const icons: Record<string, any> = {
      passport: IdCard,
      photo: Image,
      visa: Plane,
      emirates_id: IdCard,
      degree: GraduationCap,
      contract: FileText,
      other: File,
    };
    return icons[docType] || File;
  };

  // Section Header Component with Parallelogram Design
  const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div
          className="relative bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white px-6 py-2.5 font-bold text-sm uppercase tracking-wide"
          style={{
            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <Icon size={16} />
            {title}
          </div>
        </div>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[#FF6B00]/30 to-transparent"></div>
      </div>
    </div>
  );

  // List Item Component - Table-like alignment
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
    <div className={`grid grid-cols-[auto_200px_1fr] gap-4 items-center py-3.5 border-b last:border-b-0 ${
      theme === "dark" ? "border-gray-800" : "border-gray-100"
    }`}>
      <div className={`${iconColor} flex-shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="flex-shrink-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
      </div>
      <div className="flex-1">
        <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  // Document Row Component - Table-like
  const DocumentRow = ({ doc }: { doc: Document }) => {
    const DocIcon = getDocumentIcon(doc.document_type);

    return (
      <div
        className={`grid grid-cols-[auto_1fr_200px_auto] gap-4 items-center py-3.5 border-b last:border-b-0 ${
          theme === "dark" ? "border-gray-800 hover:bg-gray-800/50" : "border-gray-100 hover:bg-gray-50"
        } transition-colors cursor-pointer group`}
        onClick={() => handleViewDocument(doc.document_url)}
      >
        {/* Icon */}
        <div className="flex-shrink-0 pl-2">
          <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
            <DocIcon className="text-[#FF6B00]" size={20} />
          </div>
        </div>

        {/* Document Name */}
        <div>
          <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {doc.document_name}
          </p>
        </div>

        {/* Upload Date */}
        <div>
          <p className="text-sm text-gray-400">
            {doc.uploaded_date
              ? new Date(doc.uploaded_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Upload date unknown"}
          </p>
        </div>

        {/* View Button */}
        <div className="pr-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDocument(doc.document_url);
            }}
            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF8533] text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100"
          >
            <Eye size={16} />
            View
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
            <p className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-lg`}>Loading contractor details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contractor) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h1 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {error || "Contractor Not Found"}
            </h1>
            <button
              onClick={() => router.push("/dashboard/contractors")}
              className="px-6 py-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg transition-all"
            >
              Back to Contractors
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/contractors")}
        className={`flex items-center gap-2 mb-6 ${
          theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
        } transition-colors`}
      >
        <ArrowLeft size={20} />
        Back to Contractors
      </button>

      {/* Header Section */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-8 shadow-sm mb-6`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Contractor Info */}
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg flex-shrink-0">
              {contractor.first_name.charAt(0)}{contractor.surname.charAt(0)}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {contractor.first_name} {contractor.surname}
              </h1>
              <p className="text-gray-400 text-lg mb-4">
                {contractor.role || "Not specified"} {contractor.client_name && `at ${contractor.client_name}`}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(contractor.status)}
                {contractor.documents_uploaded_date && (
                  <span className="text-sm text-gray-400">
                    <Calendar size={14} className="inline mr-1" />
                    Documents uploaded {new Date(contractor.documents_uploaded_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {(contractor.status === "signed" || contractor.status === "active") && (
              <button
                onClick={handleViewContract}
                className={`${
                  theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                } text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2`}
              >
                <FileText size={18} />
                View Contract
              </button>
            )}
            {contractor.status === "signed" && (
              <button
                onClick={async () => {
                  if (confirm(`Are you sure you want to activate ${contractor.first_name} ${contractor.surname}?`)) {
                    try {
                      const token = localStorage.getItem("aventus-auth-token");
                      const response = await fetch(
                        API_ENDPOINTS.contractorActivate(contractor.id),
                        {
                          method: "POST",
                          headers: {
                            "Authorization": `Bearer ${token}`,
                          },
                        }
                      );
                      if (response.ok) {
                        alert("Contractor activated successfully!");
                        window.location.reload();
                      } else {
                        throw new Error("Failed to activate");
                      }
                    } catch (error: any) {
                      alert(`Failed to activate contractor: ${error.message}`);
                    }
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Activate Contractor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Information Section */}
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-6 shadow-sm`}>
            <SectionHeader title="Contact Information" icon={Mail} />
            <div>
              <ListItem icon={Mail} label="Email Address" value={contractor.email} />
              <ListItem icon={Phone} label="Phone Number" value={contractor.phone} />
              <ListItem icon={MapPin} label="Home Address" value={contractor.home_address} />
            </div>
          </div>

          {/* Personal Information Section */}
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-6 shadow-sm`}>
            <SectionHeader title="Personal Information" icon={User} />
            <div>
              <ListItem icon={Calendar} label="Date of Birth" value={contractor.dob} />
              <ListItem icon={Globe} label="Nationality" value={contractor.nationality} />
              <ListItem icon={User} label="Gender" value={contractor.gender} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Employment Details Section */}
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-6 shadow-sm`}>
            <SectionHeader title="Employment Details" icon={Briefcase} />
            <div>
              <ListItem icon={Building2} label="Client Company" value={contractor.client_name} />
              <ListItem icon={Briefcase} label="Job Role" value={contractor.role} />
              <ListItem icon={MapPin} label="Work Location" value={contractor.location} />
              <ListItem icon={Calendar} label="Start Date" value={contractor.start_date} />
              <ListItem icon={Calendar} label="End Date" value={contractor.end_date} />
              <ListItem icon={Clock} label="Contract Duration" value={contractor.duration} />
            </div>
          </div>

          {/* Financial Details Section */}
          {contractor.candidate_pay_rate && (
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-6 shadow-sm`}>
              <SectionHeader title="Financial Details" icon={CreditCard} />
              <div>
                <ListItem
                  icon={DollarSign}
                  label="Currency"
                  value={contractor.currency || "AED"}
                  iconColor="text-blue-500"
                />
                <ListItem
                  icon={DollarSign}
                  label="Candidate Pay Rate"
                  value={contractor.candidate_pay_rate ? `${contractor.currency} ${contractor.candidate_pay_rate.toFixed(2)}` : "N/A"}
                  iconColor="text-green-500"
                />
                <ListItem
                  icon={DollarSign}
                  label="Client Charge Rate"
                  value={contractor.client_charge_rate ? `${contractor.currency} ${contractor.client_charge_rate.toFixed(2)}` : "N/A"}
                  iconColor="text-orange-500"
                />
                {contractor.umbrella_company_name && (
                  <ListItem
                    icon={Building2}
                    label="Umbrella Company"
                    value={contractor.umbrella_company_name}
                    iconColor="text-purple-500"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents Section - Full Width */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-6 shadow-sm`}>
        <SectionHeader title="Uploaded Documents" icon={FileText} />

        {documentsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B00]"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-3" size={48} />
            <p className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              No documents uploaded yet
            </p>
            <p className="text-sm text-gray-400">
              Documents will appear here once the contractor uploads them
            </p>
          </div>
        ) : (
          <div>
            {documents.map((doc, index) => (
              <DocumentRow key={index} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
