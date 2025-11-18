"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { X, DollarSign, Save } from "lucide-react";

interface CostOfHireData {
  recruitment_cost: string;
  onboarding_cost: string;
  equipment_cost: string;
  administrative_cost: string;
  relocation_cost: string;
  total_cost_of_hire: string;
  cost_of_hire_notes: string;
}

interface CostOfHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractorId: string;
  initialData?: Partial<CostOfHireData>;
  onSave: () => void;
}

export default function CostOfHireModal({
  isOpen,
  onClose,
  contractorId,
  initialData,
  onSave,
}: CostOfHireModalProps) {
  const { theme } = useTheme();

  const [formData, setFormData] = useState<CostOfHireData>({
    recruitment_cost: initialData?.recruitment_cost || "",
    onboarding_cost: initialData?.onboarding_cost || "",
    equipment_cost: initialData?.equipment_cost || "",
    administrative_cost: initialData?.administrative_cost || "",
    relocation_cost: initialData?.relocation_cost || "",
    total_cost_of_hire: initialData?.total_cost_of_hire || "",
    cost_of_hire_notes: initialData?.cost_of_hire_notes || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate total
  useEffect(() => {
    const costs = [
      parseFloat(formData.recruitment_cost) || 0,
      parseFloat(formData.onboarding_cost) || 0,
      parseFloat(formData.equipment_cost) || 0,
      parseFloat(formData.administrative_cost) || 0,
      parseFloat(formData.relocation_cost) || 0,
    ];

    const total = costs.reduce((sum, cost) => sum + cost, 0);
    setFormData((prev) => ({
      ...prev,
      total_cost_of_hire: total > 0 ? total.toFixed(2) : "",
    }));
  }, [
    formData.recruitment_cost,
    formData.onboarding_cost,
    formData.equipment_cost,
    formData.administrative_cost,
    formData.relocation_cost,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`http://localhost:8000/api/v1/contractors/${contractorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update Cost of Hire");
      }

      alert("Cost of Hire updated successfully!");
      onSave();
      onClose();
    } catch (err: any) {
      console.error("Error updating Cost of Hire:", err);
      setError(err.message || "Failed to update Cost of Hire");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <DollarSign className="text-[#FF6B00]" size={24} />
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Manage Cost of Hire
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Recruitment Cost (AED)
              </label>
              <input
                type="number"
                step="0.01"
                name="recruitment_cost"
                value={formData.recruitment_cost}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., 15000.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Advertising, recruiter fees, job posting costs
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Onboarding Cost (AED)
              </label>
              <input
                type="number"
                step="0.01"
                name="onboarding_cost"
                value={formData.onboarding_cost}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., 5000.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Training, orientation, onboarding materials
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Equipment Cost (AED)
              </label>
              <input
                type="number"
                step="0.01"
                name="equipment_cost"
                value={formData.equipment_cost}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., 8000.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Laptop, phone, software licenses, tools
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Administrative Cost (AED)
              </label>
              <input
                type="number"
                step="0.01"
                name="administrative_cost"
                value={formData.administrative_cost}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., 3000.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Background checks, legal fees, contracts
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Relocation Cost (AED)
              </label>
              <input
                type="number"
                step="0.01"
                name="relocation_cost"
                value={formData.relocation_cost}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., 12000.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Moving expenses, temporary housing, flights
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Total Cost of Hire (AED)
              </label>
              <input
                type="text"
                name="total_cost_of_hire"
                value={formData.total_cost_of_hire}
                readOnly
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700 text-green-500"
                    : "bg-gray-100 border-gray-300 text-green-600"
                } font-bold text-lg`}
                placeholder="Auto-calculated"
              />
              <p className="text-xs text-green-500 mt-1">
                Automatically calculated from above costs
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Additional Notes
            </label>
            <textarea
              name="cost_of_hire_notes"
              value={formData.cost_of_hire_notes}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              placeholder="Any additional information about hiring costs..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Cost of Hire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
