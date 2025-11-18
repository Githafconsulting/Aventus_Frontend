"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import SignatureComponent from "@/components/SignatureComponent";
import { populateContractTemplate } from "@/types/contractTemplate";
import { CheckCircle, AlertCircle, FileText, Scroll } from "lucide-react";

export default function ContractPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<any>(null);
  const [contractText, setContractText] = useState("");
  const [error, setError] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [signed, setSigned] = useState(false);

  // Fetch contract data
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        // Fetch from backend API using new contracts endpoint
        const response = await fetch(
          `http://localhost:8000/api/v1/contracts/token/${token}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("This contract link is invalid or has expired.");
          } else if (response.status === 400) {
            setError("This contract link has expired.");
          } else {
            setError("Failed to load contract. Please try again later.");
          }
          setLoading(false);
          return;
        }

        const contract = await response.json();

        // Check if already signed
        if (contract.status === "signed" || contract.status === "validated" || contract.status === "activated") {
          setError("This contract has already been signed.");
          setSigned(true);
          setContractData(contract);
          setLoading(false);
          return;
        }

        setContractData(contract);

        // Use the contract content from the API directly (already populated)
        setContractText(contract.contract_content);
        setLoading(false);
      } catch (err) {
        setError("Failed to load contract. Please try again later.");
        setLoading(false);
      }
    };

    fetchContractData();
  }, [token]);

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${months} months`;
  };

  const handleSignatureComplete = async (signature: { type: "typed" | "drawn"; data: string }) => {
    try {
      setLoading(true);

      // Submit signature to backend using new contracts endpoint
      const response = await fetch(
        `http://localhost:8000/api/v1/contracts/token/${token}/sign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature_type: signature.type,
            signature_data: signature.data,
            notes: null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to sign contract");
      }

      const result = await response.json();
      setSigned(true);
    } catch (err: any) {
      setError(err.message || "Failed to sign contract. Please try again.");
    } finally {
      setLoading(false);
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
        <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-8 max-w-2xl w-full text-center`}>
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Contract Signed Successfully!
          </h1>
          <p className="text-gray-400 mb-6">
            Thank you for signing your employment contract. The admin team will now complete your onboarding
            and send you your login credentials via email shortly.
          </p>

          {/* Signature Display */}
          {contractData && (contractData.contractor_signature_type || contractData.aventus_signature_type) && (
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} rounded-lg p-6 mb-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Contract Signatures
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contractor Signature */}
                {contractData.contractor_signature_type && (
                  <div className="text-left">
                    <p className="text-sm text-gray-400 mb-2">Contractor Signature:</p>
                    <div className={`border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} rounded-lg p-4 bg-white`}>
                      {contractData.contractor_signature_type === "typed" ? (
                        <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "cursive" }}>
                          {contractData.contractor_signature_data}
                        </p>
                      ) : (
                        <img
                          src={contractData.contractor_signature_data}
                          alt="Contractor Signature"
                          className="max-h-24 mx-auto"
                        />
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {contractData.consultant_name}
                    </p>
                  </div>
                )}

                {/* Aventus Signature */}
                {contractData.aventus_signature_type && (
                  <div className="text-left">
                    <p className="text-sm text-gray-400 mb-2">Company Representative:</p>
                    <div className={`border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} rounded-lg p-4 bg-white`}>
                      {contractData.aventus_signature_type === "typed" ? (
                        <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "cursive" }}>
                          {contractData.aventus_signature_data}
                        </p>
                      ) : (
                        <img
                          src={contractData.aventus_signature_data}
                          alt="Company Signature"
                          className="max-h-24 mx-auto"
                        />
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      AVENTUS CONTRACTOR MANAGEMENT
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} rounded-lg p-4 text-left`}>
            <p className="text-sm text-gray-400 mb-2">What happens next?</p>
            <ol className={`list-decimal list-inside space-y-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <li>Admin reviews your signed contract</li>
              <li>Your account will be activated</li>
              <li>You receive login credentials via email</li>
              <li>Access your dashboard and view all your documents</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Format contract text to HTML (simple markdown-like rendering)
  const formatContractText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headings
        if (line.startsWith('# ')) {
          return <h1 key={index} className={`text-3xl font-bold mb-4 mt-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className={`text-2xl font-bold mb-3 mt-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{line.substring(3)}</h2>;
        }
        // Horizontal rule
        if (line.trim() === '---') {
          return <hr key={index} className="my-6 border-gray-700" />;
        }
        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className={`font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{line.replace(/\*\*/g, '')}</p>;
        }
        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }
        // Regular text
        return (
          <p key={index} className={`mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {line.split('**').map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      });
  };

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
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-4 mb-6 shadow-lg`}>
              <iframe
                src={`http://localhost:8000/api/v1/contracts/token/${token}/pdf`}
                className="w-full h-[900px] rounded-lg border-2 border-gray-200"
                title="Employment Contract PDF"
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
            contractorName={contractData ? contractData.consultant_name : ""}
          />
        )}
      </div>
    </div>
  );
}
