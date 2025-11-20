"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Check, Upload, Save } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";
import SignatureCanvas from "react-signature-canvas";

export default function SuperadminSignContractPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const contractorId = params.id as string;

  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [signatureType, setSignatureType] = useState<"saved" | "typed" | "drawn" | "upload">("saved");
  const [typedSignature, setTypedSignature] = useState("");
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [savedSignature, setSavedSignature] = useState<any>(null);
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  // Load contractor details and saved signature
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("aventus-auth-token");

        // Load contractor
        const contractorRes = await fetch(API_ENDPOINTS.contractorById(contractorId), {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!contractorRes.ok) throw new Error("Failed to load contractor");
        const contractorData = await contractorRes.json();
        setContractor(contractorData);

        // Load saved signature
        const sigRes = await fetch(API_ENDPOINTS.superadminSignature, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (sigRes.ok) {
          const sigData = await sigRes.json();
          setSavedSignature(sigData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load contractor data");
        router.push("/dashboard/contractors");
      }
    };

    loadData();
  }, [contractorId, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedSignature(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearDrawnSignature = () => {
    signatureCanvasRef.current?.clear();
  };

  const handleSignContract = async () => {
    if (submitting) return;

    // Validate signature
    let signatureData = "";
    let finalSignatureType = "";

    if (signatureType === "saved") {
      if (!savedSignature || !savedSignature.signature_data) {
        alert("No saved signature found. Please choose another signing method.");
        return;
      }
      signatureData = savedSignature.signature_data;
      finalSignatureType = savedSignature.signature_type;
    } else if (signatureType === "typed") {
      if (!typedSignature.trim()) {
        alert("Please enter your name");
        return;
      }
      signatureData = typedSignature;
      finalSignatureType = "typed";
    } else if (signatureType === "drawn") {
      if (signatureCanvasRef.current?.isEmpty()) {
        alert("Please draw your signature");
        return;
      }
      signatureData = signatureCanvasRef.current?.toDataURL() || "";
      finalSignatureType = "drawn";
    } else if (signatureType === "upload") {
      if (!uploadedSignature) {
        alert("Please upload a signature image");
        return;
      }
      signatureData = uploadedSignature;
      finalSignatureType = "drawn";
    }

    if (!confirm(`Are you sure you want to sign this contract for ${contractor.first_name} ${contractor.surname}?`)) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(API_ENDPOINTS.superadminSignContract(contractorId), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature_type: finalSignatureType,
          signature_data: signatureData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to sign contract" }));
        throw new Error(errorData.detail || "Failed to sign contract");
      }

      alert("Contract signed successfully!");
      router.push("/dashboard/contractors");
    } catch (error: any) {
      console.error("Error signing contract:", error);
      alert(`Failed to sign contract: ${error.message}`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
          <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Loading contract...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Review & Sign Contract
        </h1>
        <p className="text-gray-400 mt-2">
          Review the contractor's signed contract and add your signature
        </p>
      </div>

      {/* Contractor Info */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} card-parallelogram p-6 mb-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Contractor Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {contractor.first_name} {contractor.surname}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {contractor.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Role</p>
            <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {contractor.role || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Client</p>
            <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {contractor.client_name || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Contractor Signed Date</p>
          <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {contractor.signed_date ? new Date(contractor.signed_date).toLocaleString() : "Not signed"}
          </p>
        </div>
      </div>

      {/* Signature Options */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} card-parallelogram p-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Your Signature
        </h2>

        {/* Signature Type Selection */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {savedSignature && savedSignature.signature_data && (
            <button
              onClick={() => setSignatureType("saved")}
              className={`p-4 border-2 btn-parallelogram transition-all ${
                signatureType === "saved"
                  ? "border-[#FF6B00] bg-[#FF6B00]/10"
                  : theme === "dark"
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Save size={24} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Use Saved</p>
            </button>
          )}
          <button
            onClick={() => setSignatureType("typed")}
            className={`p-4 border-2 btn-parallelogram transition-all ${
              signatureType === "typed"
                ? "border-[#FF6B00] bg-[#FF6B00]/10"
                : theme === "dark"
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <FileText size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Type Name</p>
          </button>
          <button
            onClick={() => setSignatureType("drawn")}
            className={`p-4 border-2 btn-parallelogram transition-all ${
              signatureType === "drawn"
                ? "border-[#FF6B00] bg-[#FF6B00]/10"
                : theme === "dark"
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Check size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Draw</p>
          </button>
          <button
            onClick={() => setSignatureType("upload")}
            className={`p-4 border-2 btn-parallelogram transition-all ${
              signatureType === "upload"
                ? "border-[#FF6B00] bg-[#FF6B00]/10"
                : theme === "dark"
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Upload size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Upload Stamp</p>
          </button>
        </div>

        {/* Signature Input */}
        <div className="mb-6">
          {signatureType === "saved" && savedSignature && (
            <div className={`p-6 border-2 ${theme === "dark" ? "border-gray-700" : "border-gray-300"} btn-parallelogram`}>
              <p className="text-sm text-gray-400 mb-2">Saved Signature:</p>
              {savedSignature.signature_type === "typed" ? (
                <p className="text-3xl italic font-cursive">{savedSignature.signature_data}</p>
              ) : (
                <img src={savedSignature.signature_data} alt="Saved signature" className="max-h-24" />
              )}
            </div>
          )}

          {signatureType === "typed" && (
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            />
          )}

          {signatureType === "drawn" && (
            <div>
              <div className={`border-2 ${theme === "dark" ? "border-gray-700" : "border-gray-300"} btn-parallelogram`}>
                <SignatureCanvas
                  ref={signatureCanvasRef}
                  canvasProps={{
                    className: "w-full h-48 bg-white",
                  }}
                />
              </div>
              <button
                onClick={clearDrawnSignature}
                className="mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white btn-parallelogram transition-all text-sm"
              >
                Clear
              </button>
            </div>
          )}

          {signatureType === "upload" && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mb-4"
              />
              {uploadedSignature && (
                <div className={`p-6 border-2 ${theme === "dark" ? "border-gray-700" : "border-gray-300"} btn-parallelogram`}>
                  <img src={uploadedSignature} alt="Uploaded signature" className="max-h-24" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboard/contractors")}
            className={`px-6 py-3 btn-parallelogram transition-all ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSignContract}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing Contract..." : "Sign Contract"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
