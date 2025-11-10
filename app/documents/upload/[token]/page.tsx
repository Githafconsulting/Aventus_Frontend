"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

export default function DocumentUploadPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [contractor, setContractor] = useState<any>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [documents, setDocuments] = useState<{
    passport_document: File | null;
    photo_document: File | null;
    visa_page_document: File | null;
    emirates_id_document: File | null;
    degree_document: File | null;
  }>({
    passport_document: null,
    photo_document: null,
    visa_page_document: null,
    emirates_id_document: null,
    degree_document: null,
  });

  useEffect(() => {
    fetchContractor();
  }, [token]);

  const fetchContractor = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.contractorByDocumentToken(token)
      );

      if (!response.ok) {
        throw new Error("Invalid or expired document upload link");
      }

      const data = await response.json();
      setContractor(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file directly
    setDocuments((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      // Create FormData to send files
      const formData = new FormData();

      // Append all files
      if (documents.passport_document) {
        formData.append("passport_document", documents.passport_document);
      }
      if (documents.photo_document) {
        formData.append("photo_document", documents.photo_document);
      }
      if (documents.visa_page_document) {
        formData.append("visa_page_document", documents.visa_page_document);
      }
      if (documents.emirates_id_document) {
        formData.append("emirates_id_document", documents.emirates_id_document);
      }
      if (documents.degree_document) {
        formData.append("degree_document", documents.degree_document);
      }

      const response = await fetch(
        API_ENDPOINTS.uploadDocuments(token),
        {
          method: "POST",
          body: formData, // Send FormData (no Content-Type header needed, browser sets it automatically)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload documents");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF6B00] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !contractor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Link
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Documents Uploaded Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you, {contractor?.first_name}! Your documents have been
            received. Our team will review them and get back to you soon.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What's Next?
            </h3>
            <p className="text-sm text-blue-700">
              You'll receive an email once your application has been reviewed.
              This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AVENTUS<span className="text-[#FF6B00]">.</span>
          </h1>
          <p className="text-gray-600">Contractor Onboarding</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {contractor?.first_name} {contractor?.surname}!
          </h2>
          <p className="text-gray-600">
            Please upload the following documents to continue your onboarding
            process. All documents should be clear, readable, and in PDF, JPG,
            or PNG format.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Required Documents
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Passport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport (Photo Page) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "passport_document")}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
              </div>
              {documents.passport_document && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={16} /> File selected
                </p>
              )}
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recent Photo (Passport Size){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "photo_document")}
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#FF6B00] file:text-white
                  hover:file:bg-[#FF6B00]/90
                  file:cursor-pointer cursor-pointer"
              />
              {documents.photo_document && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={16} /> File selected
                </p>
              )}
            </div>

            {/* Visa Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visa Page <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "visa_page_document")}
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#FF6B00] file:text-white
                  hover:file:bg-[#FF6B00]/90
                  file:cursor-pointer cursor-pointer"
              />
              {documents.visa_page_document && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={16} /> File selected
                </p>
              )}
            </div>

            {/* Emirates ID / Karma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emirates ID or Karma <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "emirates_id_document")}
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#FF6B00] file:text-white
                  hover:file:bg-[#FF6B00]/90
                  file:cursor-pointer cursor-pointer"
              />
              {documents.emirates_id_document && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={16} /> File selected
                </p>
              )}
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree Certificate <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "degree_document")}
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#FF6B00] file:text-white
                  hover:file:bg-[#FF6B00]/90
                  file:cursor-pointer cursor-pointer"
              />
              {documents.degree_document && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={16} /> File selected
                </p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">
              Important Notes
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Ensure all documents are clear and readable</li>
              <li>Maximum file size: 10MB per document</li>
              <li>Accepted formats: PDF, JPG, PNG</li>
              <li>Make sure all information is visible and not cut off</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading Documents...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Documents
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Aventus HR. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
