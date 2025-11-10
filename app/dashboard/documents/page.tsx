"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  FileText,
  Download,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  File,
} from "lucide-react";

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const userStr = localStorage.getItem("aventus-user");

      if (!userStr) {
        throw new Error("User not found");
      }

      const user = JSON.parse(userStr);

      const response = await fetch(
        `http://localhost:8000/api/v1/contractors/${user.contractor_id}/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      setDocuments(data);
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
      } else {
        window.open(documentUrl, "_blank");
      }
    }
  };

  const downloadDocument = (documentUrl: string, documentName: string) => {
    if (documentUrl) {
      const link = document.createElement("a");
      link.href = documentUrl;
      link.download = documentName;
      link.click();
    }
  };

  const getDocumentStatus = () => {
    if (!documents) return null;

    if (documents.status === "active") {
      return {
        icon: <CheckCircle className="text-green-600" size={24} />,
        text: "All documents verified",
        color: "green",
      };
    } else if (documents.status === "signed") {
      return {
        icon: <CheckCircle className="text-blue-600" size={24} />,
        text: "Contract signed - Pending activation",
        color: "blue",
      };
    } else if (documents.status === "documents_uploaded") {
      return {
        icon: <Clock className="text-yellow-600" size={24} />,
        text: "Documents under review",
        color: "yellow",
      };
    } else {
      return {
        icon: <Clock className="text-gray-600" size={24} />,
        text: "Processing",
        color: "gray",
      };
    }
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
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const status = getDocumentStatus();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">
            View and download your uploaded documents and signed contracts
          </p>
        </div>

        {/* Status Card */}
        {status && (
          <div
            className={`bg-${status.color}-50 border border-${status.color}-200 rounded-lg p-4 mb-6 flex items-center gap-3`}
          >
            {status.icon}
            <p className={`text-${status.color}-700 font-medium`}>
              {status.text}
            </p>
          </div>
        )}

        {/* Personal Documents */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Documents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Passport */}
            {documents?.passport_document && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#FF6B00] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <File className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Passport</h3>
                      <p className="text-sm text-gray-500">Photo Page</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      viewDocument(
                        documents.passport_document,
                        "Passport.pdf"
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() =>
                      downloadDocument(
                        documents.passport_document,
                        "Passport.pdf"
                      )
                    }
                    className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Photo */}
            {documents?.photo_document && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#FF6B00] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <File className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Photo</h3>
                      <p className="text-sm text-gray-500">Passport Size</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      viewDocument(documents.photo_document, "Photo.jpg")
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() =>
                      downloadDocument(documents.photo_document, "Photo.jpg")
                    }
                    className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Visa Page */}
            {documents?.visa_page_document && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#FF6B00] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <File className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Visa Page</h3>
                      <p className="text-sm text-gray-500">Valid Visa</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      viewDocument(
                        documents.visa_page_document,
                        "VisaPage.pdf"
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() =>
                      downloadDocument(
                        documents.visa_page_document,
                        "VisaPage.pdf"
                      )
                    }
                    className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Emirates ID */}
            {documents?.emirates_id_document && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#FF6B00] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <File className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Emirates ID / Karma
                      </h3>
                      <p className="text-sm text-gray-500">Identification</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      viewDocument(
                        documents.emirates_id_document,
                        "EmiratesID.pdf"
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() =>
                      downloadDocument(
                        documents.emirates_id_document,
                        "EmiratesID.pdf"
                      )
                    }
                    className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Degree */}
            {documents?.degree_document && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#FF6B00] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <File className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Degree Certificate
                      </h3>
                      <p className="text-sm text-gray-500">
                        Educational Qualification
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      viewDocument(documents.degree_document, "Degree.pdf")
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() =>
                      downloadDocument(documents.degree_document, "Degree.pdf")
                    }
                    className="flex-1 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signed Contract */}
        {documents?.signed_contract && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Signed Contract
              </h2>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:border-[#FF6B00] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-green-600" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Employment Contract
                    </h3>
                    <p className="text-sm text-gray-500">
                      Signed on {new Date(documents.signed_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    viewDocument(
                      documents.signed_contract,
                      "Employment_Contract.pdf"
                    )
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={20} />
                  View Contract
                </button>
                <button
                  onClick={() =>
                    downloadDocument(
                      documents.signed_contract,
                      "Employment_Contract.pdf"
                    )
                  }
                  className="flex-1 px-4 py-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Contract
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Documents Message */}
        {!documents?.passport_document &&
          !documents?.photo_document &&
          !documents?.visa_page_document &&
          !documents?.emirates_id_document &&
          !documents?.degree_document &&
          !documents?.signed_contract && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
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
