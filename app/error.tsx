"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/av-logo.png"
            alt="Aventus Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Something Went Wrong
          </h1>
          <div className="h-1 w-32 bg-[#FF6B00] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg mb-2">
            We're sorry, but an unexpected error has occurred.
          </p>
          <p className="text-gray-500 mb-4">
            Our team has been notified and is working to fix the issue.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#FF6B00]/90 transition-all shadow-md hover:shadow-lg"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all border border-gray-300 shadow-sm hover:shadow-md"
          >
            <Home size={20} />
            Go to Dashboard
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>
            If this problem persists, please contact support at{" "}
            <a
              href="mailto:support@aventus.com"
              className="text-[#FF6B00] hover:underline"
            >
              support@aventus.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
