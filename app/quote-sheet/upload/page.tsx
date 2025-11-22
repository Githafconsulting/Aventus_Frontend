"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getApiUrl } from "@/lib/config";

export default function QuoteSheetUploadPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [quoteSheetInfo, setQuoteSheetInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form data
  const [file, setFile] = useState<File | null>(null);
  const [proposedRate, setProposedRate] = useState("");
  const [currency, setCurrency] = useState("AED");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (token) {
      fetchQuoteSheetInfo();
    } else {
      setError("Invalid upload link");
      setLoading(false);
    }
  }, [token]);

  const fetchQuoteSheetInfo = async () => {
    try {
      const response = await fetch(
        `${getApiUrl()}/api/v1/quote-sheets/public/${token}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch quote sheet info");
      }

      const data = await response.json();
      setQuoteSheetInfo(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to load quote sheet information");
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (proposedRate) formData.append("proposed_rate", proposedRate);
      formData.append("currency", currency);
      if (paymentTerms) formData.append("payment_terms", paymentTerms);
      if (notes) formData.append("notes", notes);

      const response = await fetch(
        `${getApiUrl()}/api/v1/quote-sheets/upload/${token}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload quote sheet");
      }

      setSuccess(true);
      setUploading(false);
    } catch (err: any) {
      setError(err.message || "Failed to upload quote sheet");
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B00] mx-auto mb-4"></div>
          <p className="text-gray-900 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !quoteSheetInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h1>
          <p className="text-gray-600">Your quote sheet has been submitted successfully.</p>
          <p className="text-gray-600 mt-2">You can now close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/av-logo.png"
              alt="Aventus Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Sheet Upload</h1>
          <p className="text-gray-600">Upload your quote sheet for contractor placement</p>
        </div>

        {/* Quote Sheet Info Card */}
        <div
          className="mb-8 p-6 bg-gradient-to-br from-[#FF6B00]/10 to-[#FF8C00]/5 border border-[#FF6B00]/30"
          style={{
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Contractor Name</p>
              <p className="text-gray-900 font-semibold">{quoteSheetInfo?.contractor_name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Your Company</p>
              <p className="text-gray-900 font-semibold">{quoteSheetInfo?.third_party_company_name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Request Date</p>
              <p className="text-gray-900 font-semibold">
                {new Date(quoteSheetInfo?.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Link Expires</p>
              <p className="text-gray-900 font-semibold">
                {new Date(quoteSheetInfo?.token_expiry).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div
          className="p-8 bg-white border border-gray-200 shadow-lg"
          style={{
            clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Sheet Document <span className="text-red-500">*</span>
              </label>
              <div
                className="border-2 border-dashed border-gray-300 hover:border-[#FF6B00]/50 transition-all p-6 text-center bg-gray-50"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-3"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    {file ? (
                      <span className="text-[#FF6B00] font-medium">{file.name}</span>
                    ) : (
                      <>
                        <span className="text-[#FF6B00] font-medium">Click to upload</span> or drag and drop
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (max 10MB)</p>
                </label>
              </div>
            </div>

            {/* Proposed Rate */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Rate</label>
                <input
                  type="number"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                  placeholder="Enter proposed rate"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                </select>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#FF6B00] transition-colors"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
                placeholder="e.g., Net 30, Net 60"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#FF6B00] transition-colors resize-none"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
                placeholder="Any additional information or comments..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading || !file}
                className="px-8 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                }}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Submit Quote Sheet"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>This is a secure upload link provided by Aventus</p>
          <p className="mt-1">If you have any questions, please contact your Aventus consultant</p>
        </div>
      </div>
    </div>
  );
}
