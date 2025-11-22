"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit2,
  FileDown,
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

export default function TemplateViewPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const templateId = params?.id as string;

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    template_type: "",
    description: "",
    content: "",
    country: "",
    is_active: true,
  });

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/templates/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }

      const data = await response.json();
      setFormData({
        name: data.name,
        template_type: data.template_type,
        description: data.description || "",
        content: data.content,
        country: data.country || "",
        is_active: data.is_active,
      });
    } catch (err: any) {
      console.error("Error fetching template:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
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

      const response = await fetch(
        `${getApiUrl()}/api/v1/templates/${templateId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update template");
      }

      alert("Template updated successfully!");
      setMode("view");
      fetchTemplate();
    } catch (err: any) {
      console.error("Error updating template:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    // Create a blob with the template content
    const blob = new Blob([formData.content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.name.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-400">Loading template...</p>
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
          <p className="text-gray-600 mt-1 text-sm">
            {mode === "view" ? "Template Preview" : "Edit Template"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mode === "view" ? (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                <FileDown size={18} />
                Export
              </button>
              <button
                onClick={() => setMode("edit")}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-lg transition-all"
              >
                <Edit2 size={18} />
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMode("view");
                  fetchTemplate();
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-lg transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto">
        {mode === "view" ? (
          // View Mode
          <div className="space-y-6">
            {/* Template Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {TEMPLATE_TYPES.find((t) => t.value === formData.template_type)
                    ?.label || formData.template_type}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Country</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.country || "All Countries"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.is_active ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-gray-500">Inactive</span>
                  )}
                </p>
              </div>
            </div>

            {formData.description && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700">{formData.description}</p>
              </div>
            )}

            {/* Template Content Preview */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-4">
                Template Content
              </p>
              <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 max-h-[600px] overflow-y-auto">
                <div
                  className="prose max-w-none text-sm text-gray-900"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
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
                    {TEMPLATE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
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
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={25}
                  className="w-full px-4 py-3 border-none bg-white text-gray-900 focus:ring-0 outline-none font-mono text-sm"
                ></textarea>
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
