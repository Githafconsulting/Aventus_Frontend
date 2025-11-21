"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";

type UserRole = "superadmin" | "admin" | "consultant" | "client" | "contractor";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isFirstLogin?: boolean;
  contractor_id?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; isFirstLogin: boolean }>;
  logout: () => void;
  resetPassword: (newPassword: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for login
const USERS = [
  {
    id: "0",
    name: "Super Admin",
    email: "superadmin@aventus.com",
    password: "superadmin123",
    role: "superadmin" as UserRole,
    isFirstLogin: false,
  },
  {
    id: "1",
    name: "Admin User",
    email: "admin@aventus.com",
    password: "admin123",
    role: "admin" as UserRole,
    isFirstLogin: false,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "manager@aventus.com",
    password: "manager123",
    role: "manager" as UserRole,
    isFirstLogin: false,
  },
  {
    id: "3",
    name: "John Doe",
    email: "contractor@aventus.com",
    password: "contractor123",
    role: "contractor" as UserRole,
    isFirstLogin: false,
  },
  // Example: New contractor with temporary password (first-time login)
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.w@example.com",
    password: "TempPass123!",
    role: "contractor" as UserRole,
    isFirstLogin: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage and validate token on mount
    const validateSession = async () => {
      const savedUser = localStorage.getItem("aventus-user");
      const token = localStorage.getItem("aventus-auth-token");

      if (savedUser && token) {
        try {
          // Validate token by calling /me endpoint
          const response = await fetch(`${getApiUrl()}/api/v1/auth/me`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            // Token is valid, set user
            setUser(JSON.parse(savedUser));
          } else {
            // Token is invalid/expired, clear session
            console.log("Session expired, clearing auth data");
            localStorage.removeItem("aventus-user");
            localStorage.removeItem("aventus-auth-token");
            setUser(null);
            // Redirect to login if not already on login page
            if (window.location.pathname !== "/" && !window.location.pathname.startsWith("/contract/") && !window.location.pathname.startsWith("/documents/")) {
              router.push("/");
            }
          }
        } catch (error) {
          console.error("Session validation error:", error);
          // On network error, keep user logged in to allow offline-ish behavior
          setUser(JSON.parse(savedUser));
        }
      }
    };

    validateSession();
  }, [router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; isFirstLogin: boolean }> => {
    try {
      console.log("Attempting login with:", email);

      // Call backend API for login
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        return { success: false, isFirstLogin: false };
      }

      const data = await response.json();
      console.log("Login successful, got token");

      // Save JWT token
      localStorage.setItem("aventus-auth-token", data.access_token);

      // Get user details
      const userResponse = await fetch(`${getApiUrl()}/api/v1/auth/me`, {
        headers: {
          "Authorization": `Bearer ${data.access_token}`,
        },
      });

      console.log("User details response status:", userResponse.status);

      if (!userResponse.ok) {
        console.error("Failed to get user details");
        return { success: false, isFirstLogin: false };
      }

      const userData = await userResponse.json();
      console.log("Got user data:", userData);

      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isFirstLogin: userData.is_first_login,
        contractor_id: userData.contractor_id,
      };

      setUser(user);
      localStorage.setItem("aventus-user", JSON.stringify(user));

      // Store temporary password if first login (needed for password reset)
      if (userData.is_first_login) {
        setTempPassword(password);
      }

      return { success: true, isFirstLogin: userData.is_first_login || false };

    } catch (error) {
      console.error("Login error:", error);
      alert(`Login Error: ${error}`);
      return { success: false, isFirstLogin: false };
    }
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    if (!user || !tempPassword) {
      console.error("Cannot reset password: user or temporary password not found");
      return false;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        console.error("No auth token found");
        return false;
      }

      // Call backend to reset password
      const response = await fetch(`${getApiUrl()}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: tempPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Password reset failed:", errorData);
        alert(`Password reset failed: ${errorData.detail || "Unknown error"}`);
        return false;
      }

      // Update user's isFirstLogin flag locally
      const updatedUser = { ...user, isFirstLogin: false };
      setUser(updatedUser);
      localStorage.setItem("aventus-user", JSON.stringify(updatedUser));

      // Clear temporary password
      setTempPassword(null);

      console.log("Password reset successful for user:", user.email);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      alert(`Password reset error: ${error}`);
      return false;
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email exists in our system
    const userExists = USERS.find(u => u.email === email);

    if (userExists) {
      // In a real app, this would:
      // 1. Generate a unique reset token
      // 2. Store the token with expiration time in database
      // 3. Send email with reset link containing the token
      console.log("Password reset requested for:", email);
      return {
        success: true,
        message: "Password reset instructions sent to your email"
      };
    } else {
      // For security reasons, you might want to return success even if email doesn't exist
      // to prevent email enumeration attacks
      return {
        success: true,
        message: "If that email exists, password reset instructions have been sent"
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aventus-user");
    localStorage.removeItem("aventus-auth-token");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, resetPassword, requestPasswordReset, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
