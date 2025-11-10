"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, Type, Eraser, X } from "lucide-react";

interface SignatureComponentProps {
  onSignatureComplete: (signature: { type: "typed" | "drawn"; data: string }) => void;
  contractorName?: string;
}

export default function SignatureComponent({
  onSignatureComplete,
  contractorName = "",
}: SignatureComponentProps) {
  const { theme } = useTheme();
  const [signatureType, setSignatureType] = useState<"typed" | "drawn">("typed");
  const [typedSignature, setTypedSignature] = useState(contractorName);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && signatureType === "drawn") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas background
        ctx.fillStyle = theme === "dark" ? "#1F2937" : "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set drawing style
        ctx.strokeStyle = theme === "dark" ? "#FFFFFF" : "#000000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [signatureType, theme]);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Touch support for mobile
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx && e.touches[0]) {
        ctx.beginPath();
        ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      }
    }
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx && e.touches[0]) {
        ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = theme === "dark" ? "#1F2937" : "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    }
  };

  const handleSubmitSignature = () => {
    if (signatureType === "typed") {
      if (typedSignature.trim()) {
        onSignatureComplete({ type: "typed", data: typedSignature.trim() });
      } else {
        alert("Please enter your name to sign.");
      }
    } else {
      if (hasDrawn && canvasRef.current) {
        const signatureData = canvasRef.current.toDataURL("image/png");
        onSignatureComplete({ type: "drawn", data: signatureData });
      } else {
        alert("Please draw your signature before submitting.");
      }
    }
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
      <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Sign Your Contract
      </h3>

      {/* Signature Type Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSignatureType("typed")}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            signatureType === "typed"
              ? "bg-[#FF6B00] text-white"
              : theme === "dark"
              ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Type size={18} />
          Type Signature
        </button>
        <button
          onClick={() => setSignatureType("drawn")}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            signatureType === "drawn"
              ? "bg-[#FF6B00] text-white"
              : theme === "dark"
              ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Pencil size={18} />
          Draw Signature
        </button>
      </div>

      {/* Typed Signature */}
      {signatureType === "typed" && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Type your full name
          </label>
          <input
            type="text"
            value={typedSignature}
            onChange={(e) => setTypedSignature(e.target.value)}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
          />
          {typedSignature && (
            <div className="mt-4 p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Signature Preview:</p>
              <p className={`text-4xl font-signature italic ${theme === "dark" ? "text-white" : "text-gray-900"}`} style={{ fontFamily: 'cursive' }}>
                {typedSignature}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Drawn Signature */}
      {signatureType === "drawn" && (
        <div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawingTouch}
              onTouchMove={drawTouch}
              onTouchEnd={stopDrawing}
              className={`w-full border-2 border-dashed ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              } rounded-lg cursor-crosshair touch-none`}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-400 text-sm">Draw your signature here</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={clearCanvas}
            className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            <Eraser size={16} />
            Clear Signature
          </button>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmitSignature}
        className="w-full mt-6 px-6 py-4 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-lg transition-all"
      >
        Submit Signed Contract
      </button>
    </div>
  );
}
