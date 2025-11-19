import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        {/* Logo with pulse animation */}
        <div className="mb-8 flex justify-center animate-pulse">
          <Image
            src="/av-logo.png"
            alt="Aventus Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FF6B00] rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait</p>
      </div>
    </div>
  );
}
