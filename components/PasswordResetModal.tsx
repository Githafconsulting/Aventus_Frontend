"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Lock, Eye, EyeOff, CheckCircle, X, AlertCircle } from "lucide-react";

interface PasswordResetModalProps {
  userEmail: string;
  onPasswordReset: (newPassword: string) => void;
  onClose: () => void;
}

export default function PasswordResetModal({
  userEmail,
  onPasswordReset,
  onClose,
}: PasswordResetModalProps) {
  const { theme } = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    const validationErrors = validatePassword(newPassword);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    setErrors([]);
    onPasswordReset(newPassword);
  };

  const passwordStrength = (password: string): {
    strength: "weak" | "medium" | "strong";
    color: string;
  } => {
    const errors = validatePassword(password);

    if (errors.length === 0) {
      return { strength: "strong", color: "bg-green-500" };
    } else if (errors.length <= 2) {
      return { strength: "medium", color: "bg-yellow-500" };
    } else {
      return { strength: "weak", color: "bg-red-500" };
    }
  };

  const strength = newPassword ? passwordStrength(newPassword) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg max-w-md w-full`}
      >
        {/* Modal Header */}
        <div className="bg-[#FF6B00] p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={24} className="text-white" />
              <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div
            className={`${
              theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50"
            } border ${
              theme === "dark" ? "border-yellow-500/20" : "border-yellow-200"
            } rounded-lg p-4 mb-6`}
          >
            <p
              className={`text-sm ${
                theme === "dark" ? "text-yellow-300" : "text-yellow-800"
              }`}
            >
              <strong>First Time Login:</strong> You are required to change your
              temporary password before accessing your dashboard.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Account:</p>
            <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {userEmail}
            </p>
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && strength && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all`}
                      style={{
                        width:
                          strength.strength === "strong"
                            ? "100%"
                            : strength.strength === "medium"
                            ? "66%"
                            : "33%",
                      }}
                    />
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      strength.strength === "strong"
                        ? "text-green-500"
                        : strength.strength === "medium"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {strength.strength.toUpperCase()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div
              className={`${
                theme === "dark" ? "bg-red-500/10" : "bg-red-50"
              } border ${
                theme === "dark" ? "border-red-500/20" : "border-red-200"
              } rounded-lg p-4 mb-6`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  {errors.map((error, index) => (
                    <p
                      key={index}
                      className={`text-sm ${
                        theme === "dark" ? "text-red-300" : "text-red-800"
                      }`}
                    >
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Password Requirements */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-gray-50"
            } rounded-lg p-4 mb-6`}
          >
            <p className="text-sm font-medium text-gray-400 mb-2">
              Password Requirements:
            </p>
            <ul className="space-y-1">
              <RequirementItem
                met={newPassword.length >= 8}
                text="At least 8 characters"
                theme={theme}
              />
              <RequirementItem
                met={/[A-Z]/.test(newPassword)}
                text="One uppercase letter"
                theme={theme}
              />
              <RequirementItem
                met={/[a-z]/.test(newPassword)}
                text="One lowercase letter"
                theme={theme}
              />
              <RequirementItem
                met={/[0-9]/.test(newPassword)}
                text="One number"
                theme={theme}
              />
              <RequirementItem
                met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)}
                text="One special character (!@#$%...)"
                theme={theme}
              />
            </ul>
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            className="w-full px-6 py-4 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-lg transition-all"
          >
            Reset Password & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

function RequirementItem({
  met,
  text,
  theme,
}: {
  met: boolean;
  text: string;
  theme: string;
}) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex-shrink-0" />
      )}
      <span className={met ? "text-green-500" : "text-gray-400"}>{text}</span>
    </li>
  );
}
