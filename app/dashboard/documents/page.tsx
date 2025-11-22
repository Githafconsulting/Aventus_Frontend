"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getApiUrl } from "@/lib/config";
import {
  FileText,
  Download,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  File,
  Building2,
  Shield,
  FolderOpen,
} from "lucide-react";

interface Document {
  document_name: string;
  document_type: string;
  document_url: string;
  uploaded_date: string | null;
}

interface DocumentsResponse {
  contractor_id: string;
  documents: Document[];
  total: number;
}

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [documentsData, setDocumentsData] = useState<DocumentsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      // Fetch fresh user data from /me endpoint to get latest contractor_id
      const userResponse = await fetch("${getApiUrl()}/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const user = await userResponse.json();

      // Update localStorage with fresh user data
      localStorage.setItem("aventus-user", JSON.stringify(user));

      // Check if user is a contractor and has contractor_id
      if (!user.contractor_id) {
        throw new Error("This page is only accessible to contractors. Please login with a contractor account.");
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/contractors/${user.contractor_id}/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to fetch documents");
      }

      const data = await response.json();
      setDocumentsData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = (documentUrl: string, documentName: string) => {
    if (documentUrl) {
      // If it's a base64 string, open in new tab
      if (documentUrl.startsWith("data:")) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(
            `<html><head><title>${documentName}</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6;"><img src="${documentUrl}" style="max-width:100%;max-height:100vh;"/></body></html>`
          );
        }
      } else if (documentUrl.startsWith("/api/")) {
        // API endpoint - fetch and open
        const token = localStorage.getItem("aventus-auth-token");
        window.open(`${getApiUrl()}${documentUrl}?token=${token}`, "_blank");
      } else {
        window.open(documentUrl, "_blank");
      }
    }
  };

  const downloadDocument = (documentUrl: string, documentName: string) => {
    if (documentUrl) {
      const link = document.createElement("a");
      if (documentUrl.startsWith("/api/")) {
        const token = localStorage.getItem("aventus-auth-token");
        link.href = `${getApiUrl()}${documentUrl}?token=${token}`;
      } else {
        link.href = documentUrl;
      }
      link.download = documentName;
      link.click();
    }
  };

  const getDocumentIcon = (docType: string) => {
    switch (docType) {
      case "passport":
        return { icon: <File className="text-purple-600" size={24} />, bg: "bg-purple-100" };
      case "photo":
        return { icon: <File className="text-blue-600" size={24} />, bg: "bg-blue-100" };
      case "visa":
        return { icon: <File className="text-green-600" size={24} />, bg: "bg-green-100" };
      case "emirates_id":
      case "id_front":
      case "id_back":
        return { icon: <File className="text-orange-600" size={24} />, bg: "bg-orange-100" };
      case "degree":
        return { icon: <File className="text-red-600" size={24} />, bg: "bg-red-100" };
      case "third_party":
        return { icon: <Building2 className="text-indigo-600" size={24} />, bg: "bg-indigo-100" };
      case "contract":
        return { icon: <FileText className="text-green-600" size={24} />, bg: "bg-green-100" };
      case "other":
        return { icon: <File className="text-gray-600" size={24} />, bg: "bg-gray-100" };
      default:
        return { icon: <File className="text-gray-600" size={24} />, bg: "bg-gray-100" };
    }
  };

  const categorizeDocuments = () => {
    if (!documentsData) return { personal: [], thirdParty: [], contracts: [], other: [] };

    const personal: Document[] = [];
    const thirdParty: Document[] = [];
    const contracts: Document[] = [];
    const other: Document[] = [];

    documentsData.documents.forEach((doc) => {
      if (["passport", "photo", "visa", "emirates_id", "id_front", "id_back", "degree"].includes(doc.document_type)) {
        personal.push(doc);
      } else if (doc.document_type === "third_party") {
        thirdParty.push(doc);
      } else if (doc.document_type === "contract") {
        contracts.push(doc);
      } else {
        other.push(doc);
      }
    });

    return { personal, thirdParty, contracts, other };
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-red-50 border border-red-200 card-parallelogram p-8 text-center">
            <div className="w-16 h-16 bg-red-100 btn-parallelogram flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Documents
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="px-6 py-2.5 bg-[#FF6B00] hover:bg-[#FF8C00] text-white btn-parallelogram font-medium transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { personal, thirdParty, contracts, other } = categorizeDocuments();
  const totalDocuments = documentsData?.total || 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">
            View and download all your documents including uploaded files, contracts, and third-party documents
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 stats-parallelogram p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Documents</p>
                <p className="text-3xl font-bold mt-1">{totalDocuments}</p>
              </div>
              <FolderOpen size={40} className="text-blue-100 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 stats-parallelogram p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Personal</p>
                <p className="text-3xl font-bold mt-1">{personal.length}</p>
              </div>
              <File size={40} className="text-purple-100 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 stats-parallelogram p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Contracts</p>
                <p className="text-3xl font-bold mt-1">{contracts.length}</p>
              </div>
              <FileText size={40} className="text-green-100 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] stats-parallelogram p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Third Party</p>
                <p className="text-3xl font-bold mt-1">{thirdParty.length}</p>
              </div>
              <Building2 size={40} className="text-orange-100 opacity-80" />
            </div>
          </div>
        </div>

        {/* Personal Documents */}
        {personal.length > 0 && (
          <div className="bg-white card-parallelogram shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 btn-parallelogram flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personal.map((doc, index) => {
                const iconInfo = getDocumentIcon(doc.document_type);
                return (
                  <div key={index} className="border border-gray-200 card-parallelogram p-4 hover:border-[#FF6B00] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${iconInfo.bg} btn-parallelogram flex items-center justify-center`}>
                          {iconInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.document_name}</h3>
                          <p className="text-sm text-gray-500">
                            {doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString() : "No date"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewDocument(doc.document_url, doc.document_name)}
                        className="flex-1 px-3 py-2 border border-gray-300 btn-parallelogram text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => downloadDocument(doc.document_url, doc.document_name)}
                        className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Third Party Documents */}
        {thirdParty.length > 0 && (
          <div className="bg-white card-parallelogram shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 btn-parallelogram flex items-center justify-center">
                <Building2 className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Third Party Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {thirdParty.map((doc, index) => {
                const iconInfo = getDocumentIcon(doc.document_type);
                return (
                  <div key={index} className="border border-gray-200 card-parallelogram p-4 hover:border-[#FF6B00] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${iconInfo.bg} btn-parallelogram flex items-center justify-center`}>
                          {iconInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.document_name}</h3>
                          <p className="text-sm text-gray-500">
                            {doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString() : "No date"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewDocument(doc.document_url, doc.document_name)}
                        className="flex-1 px-3 py-2 border border-gray-300 btn-parallelogram text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => downloadDocument(doc.document_url, doc.document_name)}
                        className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Signed Contracts */}
        {contracts.length > 0 && (
          <div className="bg-white card-parallelogram shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 btn-parallelogram flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Signed Contracts
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {contracts.map((doc, index) => (
                <div key={index} className="border border-gray-200 card-parallelogram p-6 hover:border-[#FF6B00] transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-green-100 btn-parallelogram flex items-center justify-center">
                        <FileText className="text-green-600" size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doc.document_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {doc.uploaded_date ? `Signed on ${new Date(doc.uploaded_date).toLocaleDateString()}` : "No date"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => viewDocument(doc.document_url, doc.document_name)}
                      className="flex-1 px-4 py-3 border border-gray-300 btn-parallelogram font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={20} />
                      View Contract
                    </button>
                    <button
                      onClick={() => downloadDocument(doc.document_url, doc.document_name)}
                      className="flex-1 px-4 py-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Download Contract
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Documents */}
        {other.length > 0 && (
          <div className="bg-white card-parallelogram shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 btn-parallelogram flex items-center justify-center">
                <FolderOpen className="text-gray-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Other Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {other.map((doc, index) => {
                const iconInfo = getDocumentIcon(doc.document_type);
                return (
                  <div key={index} className="border border-gray-200 card-parallelogram p-4 hover:border-[#FF6B00] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${iconInfo.bg} btn-parallelogram flex items-center justify-center`}>
                          {iconInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.document_name}</h3>
                          <p className="text-sm text-gray-500">
                            {doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString() : "No date"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewDocument(doc.document_url, doc.document_name)}
                        className="flex-1 px-3 py-2 border border-gray-300 btn-parallelogram text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => downloadDocument(doc.document_url, doc.document_name)}
                        className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Documents Message */}
        {totalDocuments === 0 && (
          <div className="bg-gray-50 border border-gray-200 card-parallelogram p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Documents Yet
            </h3>
            <p className="text-gray-600">
              Your documents will appear here once uploaded and processed.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
