"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import SignatureComponent from "@/components/SignatureComponent";
import { CheckCircle, AlertCircle, Scroll } from "lucide-react";
import { getApiUrl } from "@/lib/config";

export default function ContractSignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<any>(null);
  const [error, setError] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [signed, setSigned] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Fetch contract data from backend
  useEffect(() => {
    const fetchContractData = async () => {
      if (!token) {
        setError("No contract token provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${getApiUrl()}/api/v1/contractors/token/${token}`);

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.detail || "This contract link is invalid or has expired.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Contract data fetched:", data);
        setContractData(data);

        // Set PDF URL
        setPdfUrl(`${getApiUrl()}/api/v1/contractors/token/${token}/pdf`);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching contract:", err);
        setError("Failed to load contract. Please try again later.");
        setLoading(false);
      }
    };

    fetchContractData();
  }, [token]);

  const handleSignatureComplete = async (signature: { type: "typed" | "drawn"; data: string }) => {
    console.log("Signature submitted:", signature);

    try {
      const response = await fetch(`${getApiUrl()}/api/v1/contractors/sign/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature_type: signature.type,
          signature_data: signature.data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to sign contract: ${errorData.detail || "Unknown error"}`);
        return;
      }

      const result = await response.json();
      console.log("Contract signed successfully:", result);
      setSigned(true);
    } catch (err) {
      console.error("Error signing contract:", err);
      alert("Failed to sign contract. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto mb-4"></div>
          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"} flex items-center justify-center p-4`}>
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-8 max-w-md text-center`}>
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Contract Not Found
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"} flex items-center justify-center p-4`}>
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-8 max-w-md text-center`}>
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Contract Signed Successfully!
          </h1>
          <p className="text-gray-400">
            Thank you for signing your employment contract.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"} py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
          <div className="flex items-center gap-4 mb-4">
            <Scroll size={32} className="text-[#FF6B00]" />
            <div>
              <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Employment Contract
              </h1>
              <p className="text-gray-400 mt-1">
                Please review all terms carefully before signing
              </p>
            </div>
          </div>

          <div className={`${theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50"} border ${theme === "dark" ? "border-yellow-500/20" : "border-yellow-200"} rounded-lg p-4 mt-4`}>
            <p className={`text-sm ${theme === "dark" ? "text-yellow-300" : "text-yellow-800"}`}>
              <strong>Important:</strong> This contract is read-only. If you notice any errors,
              please contact AVENTUS before signing.
            </p>
          </div>
        </div>

        {/* Contract PDF Viewer */}
        {!showSignature ? (
          <>
            {/* PDF Viewer */}
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-4 mb-6 shadow-lg`}>
              <iframe
                src={pdfUrl}
                className="w-full h-[900px] rounded-lg border-2 border-gray-200"
                title="Employment Contract PDF"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Declaration */}
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
              <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} rounded-lg p-6 mb-6`}>
                <h3 className={`font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Declaration
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                  I hereby confirm that I have read and understood all the terms and conditions outlined in this
                  employment contract. I acknowledge that all the information provided above is accurate to the
                  best of my knowledge. By signing this contract, I agree to abide by the company policies and
                  fulfill my duties as per the agreed terms.
                </p>
              </div>
              <button
                onClick={() => setShowSignature(true)}
                className="w-full px-6 py-4 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-lg transition-all"
              >
                Proceed to Sign Contract
              </button>
            </div>
          </>
        ) : (
          <SignatureComponent
            onSignatureComplete={handleSignatureComplete}
            contractorName={contractData ? `${contractData.first_name} ${contractData.surname}` : ""}
          />
        )}
      </div>
    </div>
  );
}
