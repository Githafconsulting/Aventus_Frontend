"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
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

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#FF6B00] mb-4">404</h1>
          <div className="h-1 w-32 bg-[#FF6B00] mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved or deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#FF6B00]/90 transition-all shadow-md hover:shadow-lg"
          >
            <Home size={20} />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all border border-gray-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>Error Code: 404 | Page Not Found</p>
        </div>
      </div>
    </div>
  );
}
