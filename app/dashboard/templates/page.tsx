"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Plus,
  FileText,
  Edit2,
  Maximize2,
  X,
  Save,
  Grid,
  List,
  Eye,
  Download,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  template_type: string;
  description: string | null;
  content: string;
  country: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

const TEMPLATE_TYPE_LABELS: Record<string, string> = {
  contract: "Contract",
  cds: "CDS (Client Deal Sheet)",
  costing_sheet: "Costing Sheet",
  work_order: "Work Order",
  proposal: "Proposal",
  cohf: "COHF (Cost of Hire Form)",
  schedule_form: "Schedule Form",
  quote_sheet: "Quote Sheet",
};

export default function TemplatesPage() {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<Template | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/templates?include_inactive=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const data = await response.json();
      setTemplates(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/templates/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      alert(`Template "${name}" deleted successfully!`);
      fetchTemplates();
    } catch (err: any) {
      console.error("Error deleting template:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDuplicateTemplate = async (id: string) => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/templates/${id}/duplicate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to duplicate template");
      }

      alert("Template duplicated successfully!");
      fetchTemplates();
    } catch (err: any) {
      console.error("Error duplicating template:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleExpandTemplate = (template: Template) => {
    setExpandedTemplate(template);
    setEditedContent(template.content);
    setEditedName(template.name);
    setEditedDescription(template.description || "");
    setIsEditing(false);
  };

  const handleSaveTemplate = async () => {
    if (!expandedTemplate) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/templates/${expandedTemplate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editedName,
            description: editedDescription,
            content: editedContent,
            template_type: expandedTemplate.template_type,
            country: expandedTemplate.country,
            is_active: expandedTemplate.is_active,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      alert("Template saved successfully!");
      setIsEditing(false);
      fetchTemplates();
      setExpandedTemplate(null);
    } catch (err: any) {
      console.error("Error saving template:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" || template.template_type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      {/* Header - Compact */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Templates
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage document templates for contracts, forms, and more
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {/* View Mode Toggle */}
          <div className={`flex items-center ${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-1 shadow-sm`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-[#FF6B00] text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Grid size={18} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-[#FF6B00] text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <List size={18} />
              List
            </button>
          </div>
          <button
            onClick={() => router.push("/dashboard/templates/add")}
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Add Template
          </button>
        </div>
      </div>

      {/* Filters - Compact */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-4 shadow-sm mb-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Search */}
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-all outline-none text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Template Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all outline-none text-sm ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Types</option>
              {Object.entries(TEMPLATE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400">No templates found</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } rounded-lg shadow-sm overflow-hidden group relative`}
            >
              {/* Header - Simple */}
              <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                <h3
                  className={`font-semibold text-sm ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {template.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExpandTemplate(template)}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title="Preview"
                  >
                    <Eye size={16} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleExpandTemplate(template)}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-green-400" />
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title="Export"
                  >
                    <Download size={16} className="text-[#FF6B00]" />
                  </button>
                </div>
              </div>

              {/* A4 Preview - Aspect ratio 1:1.414 (A4 proportions) */}
              <div
                className="relative bg-white cursor-pointer overflow-hidden"
                style={{ aspectRatio: "1 / 1.414" }}
                onClick={() => handleExpandTemplate(template)}
              >
                {/* Scrollable content preview */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="p-8 text-gray-900 text-xs leading-relaxed"
                    style={{
                      transform: "scale(0.6)",
                      transformOrigin: "top left",
                      width: "166.67%",
                      height: "166.67%",
                    }}
                    dangerouslySetInnerHTML={{ __html: template.content }}
                  />
                </div>

                {/* Hover overlay with expand button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center">
                    <Maximize2 size={40} className="text-white mx-auto mb-2" />
                    <p className="text-white font-medium text-sm">
                      Click to view full template
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg shadow-sm overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTemplates.map((template) => (
                  <tr
                    key={template.id}
                    className={`${
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {/* Template Name */}
                    <td className="px-6 py-3">
                      <p
                        className={`font-medium text-sm ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {template.name}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleExpandTemplate(template)}
                          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleExpandTemplate(template)}
                          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} className="text-green-400" />
                        </button>
                        <button
                          onClick={() => {}}
                          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                          title="Export"
                        >
                          <Download size={16} className="text-[#FF6B00]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expanded Template Modal */}
      {expandedTemplate && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className={`text-xl font-bold px-3 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              ) : (
                <h2
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {expandedTemplate.name}
                </h2>
              )}
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedContent(expandedTemplate.content);
                        setEditedName(expandedTemplate.name);
                        setEditedDescription(expandedTemplate.description || "");
                      }}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      disabled={saving}
                      className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save size={18} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setExpandedTemplate(null);
                    setIsEditing(false);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content - Large A4 */}
            <div className="flex-1 overflow-auto">
              <div className="bg-white w-full h-full overflow-auto p-8">
                <div
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (isEditing) {
                      setEditedContent(e.currentTarget.innerHTML);
                    }
                  }}
                  className={`text-gray-900 leading-relaxed max-w-4xl mx-auto ${
                    isEditing ? "outline-none border-2 border-[#FF6B00] rounded p-4" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: editedContent }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
