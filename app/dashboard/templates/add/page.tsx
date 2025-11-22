"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react";
import { getApiUrl } from "@/lib/config";

const TEMPLATE_TYPES = [
  { value: "contract", label: "Contract" },
  { value: "cds", label: "CDS (Client Deal Sheet)" },
  { value: "costing_sheet", label: "Costing Sheet" },
  { value: "work_order", label: "Work Order" },
  { value: "proposal", label: "Proposal" },
  { value: "cohf", label: "COHF (Cost of Hire Form)" },
  { value: "schedule_form", label: "Schedule Form" },
  { value: "quote_sheet", label: "Quote Sheet" },
];

const COUNTRIES = ["Saudi Arabia", "UAE", "Qatar"];

export default function AddTemplatePage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    template_type: "",
    description: "",
    content: "",
    country: "",
    is_active: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      if (!formData.name || !formData.template_type || !formData.content) {
        alert("Please fill in all required fields");
        return;
      }

      const payload = {
        name: formData.name,
        template_type: formData.template_type,
        description: formData.description || null,
        content: formData.content,
        country: formData.country || null,
        is_active: formData.is_active,
      };

      const response = await fetch("${getApiUrl()}/api/v1/templates/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create template");
      }

      alert(`Template "${formData.name}" created successfully!`);
      router.push("/dashboard/templates");
    } catch (err: any) {
      console.error("Error creating template:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
        >
          <ArrowLeft size={20} className="text-white" />
          <span className="text-white text-sm font-medium">Back</span>
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Template
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Create a reusable template for documents
          </p>
        </div>

        <div className="w-[100px]"></div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Template Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Template Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Standard Employment Contract"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Type *
                </label>
                <select
                  value={formData.template_type}
                  onChange={(e) =>
                    setFormData({ ...formData, template_type: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                >
                  <option value="">Select Type</option>
                  {TEMPLATE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country (Optional)
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Brief description of this template..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Template Content */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Template Content *
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Use placeholders like{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {"{{contractor_name}}"}
              </code>
              ,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {"{{client_name}}"}
              </code>
              ,{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {"{{start_date}}"}
              </code>{" "}
              for dynamic content
            </p>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={20}
                placeholder="Enter template content here with placeholders..."
                className="w-full px-4 py-3 border-none bg-white text-gray-900 focus:ring-0 outline-none font-mono text-sm"
              ></textarea>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Available Placeholders
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Common: {"{{contractor_name}}"}, {"{{client_name}}"},{"{{company_name}}"}, {"{{position}}"}, {"{{start_date}}"},{"{{salary}}"}, {"{{location}}"}, {"{{manager_name}}"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              <span className="text-sm font-medium text-gray-700">
                Set as Active Template
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? "Creating..." : "Create Template"}
              <Check size={20} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
