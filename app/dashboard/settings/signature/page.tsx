"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  Save,
  Loader2,
  Type,
  Pen,
  Trash2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function SignatureManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [signatureType, setSignatureType] = useState<"typed" | "drawn">(
    "typed"
  );
  const [typedSignature, setTypedSignature] = useState("");
  const [currentSignature, setCurrentSignature] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchSignature();
  }, []);

  const fetchSignature = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        "http://localhost:8000/api/v1/contractors/superadmin/signature",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentSignature(data);
        if (data.signature_type) {
          setSignatureType(data.signature_type);
          if (data.signature_type === "typed") {
            setTypedSignature(data.signature_data || "");
          } else if (data.signature_type === "drawn" && data.signature_data) {
            // Load drawn signature onto canvas
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              const img = new Image();
              img.onload = () => {
                ctx?.drawImage(img, 0, 0);
              };
              img.src = data.signature_data;
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch signature:", err);
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      let signatureData = "";

      if (signatureType === "typed") {
        if (!typedSignature.trim()) {
          throw new Error("Please enter your signature");
        }
        signatureData = typedSignature.trim();
      } else {
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error("Canvas not found");
        }

        // Check if canvas is empty
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const isEmpty = !imageData.data.some((channel) => channel !== 0);

        if (isEmpty) {
          throw new Error("Please draw your signature");
        }

        signatureData = canvas.toDataURL("image/png");
      }

      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        "http://localhost:8000/api/v1/contractors/superadmin/signature",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            signature_type: signatureType,
            signature_data: signatureData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save signature");
      }

      setSuccess(true);
      fetchSignature();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Settings</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Signature Management
          </h1>
          <p className="text-gray-600">
            Set your default signature for contractor contracts. This signature
            will be automatically added when contractors sign their contracts.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-600 text-sm">
              Signature saved successfully!
            </p>
          </div>
        )}

        {/* Current Signature */}
        {currentSignature?.signature_type && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Current Signature
            </h2>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              {currentSignature.signature_type === "typed" ? (
                <p
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "cursive" }}
                >
                  {currentSignature.signature_data}
                </p>
              ) : (
                <img
                  src={currentSignature.signature_data}
                  alt="Current Signature"
                  className="max-h-32"
                />
              )}
            </div>
          </div>
        )}

        {/* Signature Type Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Signature Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSignatureType("typed")}
              className={`p-4 border-2 rounded-lg transition-all ${
                signatureType === "typed"
                  ? "border-[#FF6B00] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    signatureType === "typed"
                      ? "bg-[#FF6B00] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Type size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">Typed</h3>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Type your name as your signature
              </p>
            </button>

            <button
              onClick={() => setSignatureType("drawn")}
              className={`p-4 border-2 rounded-lg transition-all ${
                signatureType === "drawn"
                  ? "border-[#FF6B00] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    signatureType === "drawn"
                      ? "bg-[#FF6B00] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Pen size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">Draw</h3>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Draw your signature using your mouse or touch
              </p>
            </button>
          </div>
        </div>

        {/* Signature Input */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {signatureType === "typed" ? "Type Your Signature" : "Draw Your Signature"}
          </h2>

          {signatureType === "typed" ? (
            <div>
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Enter your full name"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] text-lg mb-4"
              />
              {typedSignature && (
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <p
                    className="text-4xl font-bold text-gray-900"
                    style={{ fontFamily: "cursive" }}
                  >
                    {typedSignature}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="border-2 border-gray-300 rounded-lg bg-white mb-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear Canvas
              </button>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-end gap-4">
            <Link
              href="/dashboard/settings"
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Signature
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            How it works
          </h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Your signature will be automatically added to all contracts when contractors sign</li>
            <li>Both your signature and the contractor's signature will appear on the final document</li>
            <li>You can update your signature at any time</li>
            <li>Changes will apply to all future contract signings</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
