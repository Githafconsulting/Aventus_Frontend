"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Download, Check } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

export default function SignWorkOrderPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [signatureType, setSignatureType] = useState<"typed" | "drawn">("typed");
  const [typedName, setTypedName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    fetchWorkOrder();
  }, [token]);

  useEffect(() => {
    if (canvasRef.current && signatureType === "drawn") {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        setCanvasContext(ctx);
      }
    }
  }, [signatureType]);

  const fetchWorkOrder = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.apiUrl}/api/v1/work-orders/public/by-token/${token}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Work order not found or link has expired");
        }
        throw new Error("Failed to load work order");
      }

      const data = await response.json();
      setWorkOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas || !canvasContext) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    canvasContext.lineTo(x, y);
    canvasContext.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && canvasContext) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSubmit = async () => {
    let signatureData = "";

    if (signatureType === "typed") {
      if (!typedName.trim()) {
        alert("Please enter your name");
        return;
      }
      signatureData = typedName.trim();
    } else {
      const canvas = canvasRef.current;
      if (!canvas) {
        alert("Signature canvas not found");
        return;
      }

      const imageData = canvasContext?.getImageData(0, 0, canvas.width, canvas.height);
      const isCanvasEmpty = !imageData?.data.some(channel => channel !== 0);

      if (isCanvasEmpty) {
        alert("Please draw your signature");
        return;
      }

      signatureData = canvas.toDataURL("image/png");
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_ENDPOINTS.apiUrl}/api/v1/work-orders/public/sign/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature_type: signatureType,
            signature_data: signatureData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to sign work order");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    window.open(
      `${API_ENDPOINTS.apiUrl}/api/v1/work-orders/public/pdf/${token}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  if (error && !workOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Work Order
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Work Order Signed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for signing the work order. We'll proceed with the next steps.
          </p>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
          >
            <Download size={18} />
            Download Signed Work Order
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* A4 Work Order Document */}
        <div className="bg-white shadow-xl rounded-lg" style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-12" style={{ fontSize: '11pt', lineHeight: '1.6' }}>
            {/* Header with Logo */}
            <div className="text-center mb-6">
              <img
                src="/av-logo.png"
                alt="Aventus Logo"
                className="mx-auto mb-4"
                style={{ height: '50px', width: 'auto' }}
              />
              <p className="text-sm text-gray-700 mb-1">Appendix "1"</p>
              <h1 className="text-2xl font-bold text-[#FF6B00] mb-4">CONTRACTOR WORK ORDER</h1>
              <p className="text-sm text-gray-700">Work Order Number: <span className="font-semibold">{workOrder.work_order_number}</span></p>
              <hr className="border-gray-300 mb-6" />
            </div>

            {/* Details and Definitions */}
            <h2 className="text-base font-bold text-gray-900 mb-4">Details and Definitions</h2>

            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-900">Contractor:</span> {workOrder.contractor_name}
            </p>
            <p className="text-gray-800 mb-4">
              <span className="font-semibold text-gray-900">Location:</span> {workOrder.location}, or such other site as may be agreed from time to time by parties
            </p>

            <hr className="border-gray-200 my-4" />

            {/* Assignment Term */}
            <p className="font-semibold text-gray-900 mb-2">Assignment Term:</p>
            <p className="text-gray-800 mb-1">
              <span className="font-semibold text-gray-900">From:</span> {formatDate(workOrder.start_date)}
            </p>
            <p className="text-gray-800 mb-1">
              <span className="font-semibold text-gray-900">To:</span> {formatDate(workOrder.end_date)}
            </p>
            <p className="text-gray-800 mb-4">
              <span className="font-semibold text-gray-900">Duration:</span> {workOrder.duration} month(s)
            </p>

            {/* Position */}
            <p className="text-gray-800 mb-4">
              <span className="font-semibold text-gray-900">Position:</span> {workOrder.role}
            </p>

            <hr className="border-gray-200 my-4" />

            {/* Assignment Details */}
            <p className="font-semibold text-gray-900 mb-2">Assignment details:</p>
            {workOrder.project_name && (
              <p className="text-gray-800 mb-1">{workOrder.project_name}</p>
            )}
            <p className="text-sm text-gray-500 italic mb-4">(Include the type of work to be carried out)</p>

            <hr className="border-gray-200 my-4" />

            {/* Other Details */}
            <p className="text-gray-800 mb-2"><span className="font-semibold text-gray-900">Overtime:</span> N/A</p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-900">Charge Rate:</span> {workOrder.charge_rate} {workOrder.currency} per professional month worked
            </p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-900">Currency:</span> {workOrder.currency}
            </p>
            <p className="text-gray-800 mb-2"><span className="font-semibold text-gray-900">Termination Notice Period:</span> TBC</p>
            <p className="text-gray-800 mb-2"><span className="font-semibold text-gray-900">Payment terms:</span> As per agreement, from date of invoice</p>
            <p className="text-gray-800 mb-6"><span className="font-semibold text-gray-900">Expenses:</span> All expenses approved in writing by the Client either to the Contractor or to Aventus</p>

            <hr className="border-gray-300 my-6" />

            {/* Signature Section */}
            <div className="mb-6">
              <p className="font-bold text-gray-900 mb-3">CLIENT ACKNOWLEDGMENT:</p>

              {/* Signature Type Selection */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setSignatureType("typed")}
                  className={`flex-1 py-2 px-3 rounded border-2 transition-all text-sm ${
                    signatureType === "typed"
                      ? "border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-semibold"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  Type Signature
                </button>
                <button
                  onClick={() => setSignatureType("drawn")}
                  className={`flex-1 py-2 px-3 rounded border-2 transition-all text-sm ${
                    signatureType === "drawn"
                      ? "border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-semibold"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  Draw Signature
                </button>
              </div>

              {/* Typed Signature */}
              {signatureType === "typed" && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type your full name here"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                  />
                  {typedName && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Preview:</p>
                      <p className="text-2xl font-signature text-gray-900">{typedName}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Drawn Signature */}
              {signatureType === "drawn" && (
                <div className="mb-4">
                  <div className="border-2 border-gray-300 rounded bg-white mb-2">
                    <canvas
                      ref={canvasRef}
                      width={700}
                      height={150}
                      className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing...
                    </>
                  ) : (
                    "Sign Work Order"
                  )}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded font-medium transition-all flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Footer */}
            <div className="text-center text-xs text-gray-600 mt-4">
              <p className="font-semibold text-gray-700">AVENTUS CONTRACTOR MANAGEMENT</p>
              <p>Email: contact@aventus.com</p>
              <p className="italic mt-1">This is a legally binding agreement. Please read carefully before signing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
