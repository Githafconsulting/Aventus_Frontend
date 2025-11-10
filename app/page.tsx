"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PasswordResetModal from "@/components/PasswordResetModal";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

export default function LandingPage() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();
  const { login, resetPassword } = useAuth();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!showForm && e.deltaY > 0) {
        // Scrolling down
        setShowForm(true);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [showForm]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (result.success) {
      if (result.isFirstLogin) {
        // Show password reset modal for first-time login
        setShowPasswordReset(true);
      } else {
        // Normal login, go to dashboard
        router.push("/dashboard");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    const success = await resetPassword(newPassword);
    if (success) {
      setShowPasswordReset(false);
      router.push("/dashboard");
    }
    // If failed, modal stays open with error already shown by resetPassword
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Initial Logo Section - Fixed overlay */}
      <div
        className={`fixed inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out bg-white z-50 ${
          showForm ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center">
          <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto animate-pulse">
            <Image
              src="/AV Logo.png"
              alt="Aventus Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-8 text-gray-600 text-lg">Scroll to continue</p>
        </div>
      </div>

      {/* Split Layout Section - Fades in */}
      <div
        className={`h-screen transition-all duration-1000 ease-in-out ${
          showForm ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid lg:grid-cols-2 h-screen">
          {/* Left Column - Login Form */}
          <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
            <div className="w-full max-w-md">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 mb-8">
                Sign in to access your dashboard
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all outline-none text-gray-900"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all outline-none text-gray-900"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00]"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#FF6B00] hover:text-[#FF6B00]/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Logo */}
          <div className="hidden lg:flex items-center justify-center p-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8533]">
            <div className="text-center">
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 mx-auto">
                <Image
                  src="/welcomelogo.png"
                  alt="Aventus Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
              <h2 className="mt-8 text-white text-3xl font-bold">
                Aventus HR System
              </h2>
              <p className="mt-4 text-white/90 text-lg">
                Streamline your workforce management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal for First-Time Login */}
      {showPasswordReset && (
        <PasswordResetModal
          userEmail={email}
          onPasswordReset={handlePasswordReset}
          onClose={() => {
            setShowPasswordReset(false);
            // Logout user if they close without resetting
            router.push("/");
          }}
        />
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
}
