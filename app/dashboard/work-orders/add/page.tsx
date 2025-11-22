"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl } from "@/lib/config";
import {
  ArrowLeft,
  FileText,
  User,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Upload,
  X,
  CheckCircle,
} from "lucide-react";

interface Contractor {
  id: string;
  first_name: string;
  last_name: string;
}

interface ThirdParty {
  id: string;
  company_name: string;
}

interface DocumentToUpload {
  file: File;
  type: string;
}

export default function AddWorkOrderPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contractor_id: "",
    third_party_id: "",
    location: "",
    start_date: "",
    end_date: "",
    hourly_rate: "",
    fixed_price: "",
    estimated_hours: "",
    status: "draft",
    notes: "",
  });

  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [documentsToUpload, setDocumentsToUpload] = useState<DocumentToUpload[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch contractors and third parties on mount
  useEffect(() => {
    fetchContractors();
    fetchThirdParties();
  }, []);

  const fetchContractors = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) return;

      const response = await fetch("${getApiUrl()}/api/v1/contractors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setContractors(data);
      }
    } catch (err) {
      console.error("Error fetching contractors:", err);
    }
  };

  const fetchThirdParties = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) return;

      const response = await fetch("${getApiUrl()}/api/v1/third-parties", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setThirdParties(data);
      }
    } catch (err) {
      console.error("Error fetching third parties:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && documentType) {
      const newDocs: DocumentToUpload[] = [];
      for (let i = 0; i < files.length; i++) {
        newDocs.push({ file: files[i], type: documentType });
      }
      setDocumentsToUpload((prev) => [...prev, ...newDocs]);
      setDocumentType("");
      e.target.value = "";
    }
  };

  const removeDocument = (index: number) => {
    setDocumentsToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      // Prepare work order data
      const workOrderData: any = {
        title: formData.title,
        contractor_id: formData.contractor_id,
        start_date: new Date(formData.start_date).toISOString(),
        status: formData.status,
      };

      if (formData.description) workOrderData.description = formData.description;
      if (formData.third_party_id) workOrderData.third_party_id = formData.third_party_id;
      if (formData.location) workOrderData.location = formData.location;
      if (formData.end_date) workOrderData.end_date = new Date(formData.end_date).toISOString();
      if (formData.hourly_rate) workOrderData.hourly_rate = parseFloat(formData.hourly_rate);
      if (formData.fixed_price) workOrderData.fixed_price = parseFloat(formData.fixed_price);
      if (formData.estimated_hours) workOrderData.estimated_hours = parseFloat(formData.estimated_hours);
      if (formData.notes) workOrderData.notes = formData.notes;

      // Create work order
      const response = await fetch("${getApiUrl()}/api/v1/work-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workOrderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create work order");
      }

      const createdWorkOrder = await response.json();

      // Upload documents if any
      if (documentsToUpload.length > 0) {
        for (const doc of documentsToUpload) {
          const formData = new FormData();
          formData.append("file", doc.file);
          formData.append("document_type", doc.type);

          await fetch(`${getApiUrl()}/api/v1/work-orders/${createdWorkOrder.id}/upload-document`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        }
      }

      alert("Work order created successfully!");
      router.push("/dashboard/work-orders");
    } catch (err: any) {
      console.error("Error creating work order:", err);
      setError(err.message || "Failed to create work order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-800 rounded-lg transition-all"
        >
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Add Work Order
          </h1>
          <p className="text-gray-400 mt-2">Create a new work order</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm mb-6`}
        >
          {/* Work Order Information */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <FileText size={20} className="text-white" />
              <span>Work Order Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., Website Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Describe the work order..."
              />
            </div>
          </div>

          {/* Assignment Information */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <User size={20} className="text-white" />
              <span>Assignment</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Contractor *
              </label>
              <select
                name="contractor_id"
                value={formData.contractor_id}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select Contractor</option>
                {contractors.map((contractor) => (
                  <option key={contractor.id} value={contractor.id}>
                    {contractor.first_name} {contractor.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Third Party (Optional)
              </label>
              <select
                name="third_party_id"
                value={formData.third_party_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select Third Party</option>
                {thirdParties.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  placeholder="Work location"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <Calendar size={20} className="text-white" />
              <span>Timeline</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <DollarSign size={20} className="text-white" />
              <span>Financial Details</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Hourly Rate
              </label>
              <input
                type="number"
                step="0.01"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Fixed Price
              </label>
              <input
                type="number"
                step="0.01"
                name="fixed_price"
                value={formData.fixed_price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                step="0.5"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="0"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <Upload size={20} className="text-white" />
              <span>Documents</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Document Type
              </label>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., Contract, SOW, Invoice"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                disabled={!documentType}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Documents to Upload */}
          {documentsToUpload.length > 0 && (
            <div className="mb-6 p-4 border-2 border-[#FF6B00] rounded-lg bg-[#FF6B00]/5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-[#FF6B00]" size={20} />
                <span className="text-sm font-semibold text-gray-400">
                  {documentsToUpload.length} document{documentsToUpload.length !== 1 ? "s" : ""} ready to upload
                </span>
              </div>
              <div className="space-y-2">
                {documentsToUpload.map((doc, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-[#FF6B00]" />
                      <div>
                        <p className="text-sm font-medium text-gray-300">
                          {doc.file.name}
                        </p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <FileText size={20} className="text-white" />
              <span>Additional Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              placeholder="Any additional notes..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Work Order"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
