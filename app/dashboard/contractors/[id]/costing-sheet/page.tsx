"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, DollarSign, Upload, FileText, Loader2, Plus, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/config";

interface ExpenseItem {
  category: string;
  description: string;
  amount: string;
  currency: string;
  receipt?: File;
  receiptName?: string;
}

export default function CostingSheetPage() {
  const params = useParams();
  const router = useRouter();
  const contractorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contractor, setContractor] = useState<any>(null);
  const [error, setError] = useState("");

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { category: "Flight", description: "", amount: "", currency: "AED" }
  ]);

  const [costingDocuments, setCostingDocuments] = useState<File[]>([]);
  const [notes, setNotes] = useState("");

  const expenseCategories = [
    "Flight",
    "Hotel/Accommodation",
    "Phone Bills",
    "Transportation",
    "Visa Fees",
    "Medical Insurance",
    "Meals",
    "Equipment",
    "Training",
    "Other"
  ];

  useEffect(() => {
    fetchContractor();
  }, [contractorId]);

  const fetchContractor = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      const response = await fetch(
        API_ENDPOINTS.contractorById(contractorId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contractor");
      }

      const data = await response.json();
      setContractor(data);

      // Check if contractor has completed CDS
      // You can add validation here if needed
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpenseRow = () => {
    setExpenses([
      ...expenses,
      { category: "Other", description: "", amount: "", currency: "AED" }
    ]);
  };

  const removeExpenseRow = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleExpenseChange = (index: number, field: keyof ExpenseItem, value: string) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    setExpenses(updated);
  };

  const handleReceiptUpload = (index: number, file: File | null) => {
    const updated = [...expenses];
    if (file) {
      updated[index].receipt = file;
      updated[index].receiptName = file.name;
    } else {
      delete updated[index].receipt;
      delete updated[index].receiptName;
    }
    setExpenses(updated);
  };

  const handleCostingDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCostingDocuments(Array.from(e.target.files));
    }
  };

  const removeCostingDocument = (index: number) => {
    setCostingDocuments(costingDocuments.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate expenses (optional - some contractors may not have expenses)
      const validExpenses = expenses.filter(exp => exp.amount && parseFloat(exp.amount) > 0);

      const token = localStorage.getItem("aventus-auth-token");

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("expenses", JSON.stringify(validExpenses.map(({ receipt, receiptName, ...exp }) => exp)));
      formData.append("notes", notes);
      formData.append("total_amount", validExpenses.length > 0 ? calculateTotal().toString() : "0");

      // Add costing documents
      costingDocuments.forEach((file, index) => {
        formData.append(`costing_documents`, file);
      });

      // Add individual receipts
      validExpenses.forEach((expense, index) => {
        if (expense.receipt) {
          formData.append(`receipt_${index}`, expense.receipt);
        }
      });

      const response = await fetch(
        API_ENDPOINTS.contractorCostingSheet(contractorId),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit costing sheet");
      }

      alert("Costing sheet submitted successfully! The contractor is now pending review.");
      router.push("/dashboard/contractors");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/contractors/complete-cds/${contractorId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to CDS Form</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contractor Expenses & Costing Sheet
          </h1>
          <p className="text-gray-600">
            Record expenses incurred by{" "}
            <span className="font-semibold text-gray-900">
              {contractor?.first_name} {contractor?.surname}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expenses Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="text-[#FF6B00]" size={24} />
                  Expense Items
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add all expenses the contractor has incurred
                </p>
              </div>
              <button
                type="button"
                onClick={addExpenseRow}
                className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF8533] text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={16} />
                Add Expense
              </button>
            </div>

            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  {/* Category */}
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={expense.category}
                      onChange={(e) => handleExpenseChange(index, "category", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm text-gray-900 bg-white"
                      required
                    >
                      {expenseCategories.map(cat => (
                        <option key={cat} value={cat} className="text-gray-900">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => handleExpenseChange(index, "description", e.target.value)}
                      placeholder="e.g., Round trip Dubai-Riyadh"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm text-gray-900 bg-white placeholder-gray-400"
                    />
                  </div>

                  {/* Amount */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={expense.amount}
                      onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm text-gray-900 bg-white placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Currency */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={expense.currency}
                      onChange={(e) => handleExpenseChange(index, "currency", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm text-gray-900 bg-white"
                    >
                      <option value="AED" className="text-gray-900">AED</option>
                      <option value="SAR" className="text-gray-900">SAR</option>
                      <option value="USD" className="text-gray-900">USD</option>
                      <option value="EUR" className="text-gray-900">EUR</option>
                      <option value="GBP" className="text-gray-900">GBP</option>
                    </select>
                  </div>

                  {/* Receipt Upload & Remove */}
                  <div className="col-span-1 flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action
                    </label>
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleReceiptUpload(index, e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <div className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all" title="Upload receipt">
                          <Upload size={16} />
                        </div>
                      </label>
                      {expenses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExpenseRow(index)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                          title="Remove expense"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {expense.receiptName && (
                      <span className="text-xs text-green-600 truncate" title={expense.receiptName}>
                        ✓ {expense.receiptName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Expenses</span>
                <span className="text-2xl font-bold text-[#FF6B00]">
                  {calculateTotal().toFixed(2)} AED
                </span>
              </div>
            </div>
          </div>

          {/* Costing Documents Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <FileText className="text-[#FF6B00]" size={24} />
                Supporting Documents
              </h2>
              <p className="text-sm text-gray-600">
                Upload invoices, receipts, or other supporting documents
              </p>
            </div>

            <div>
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#FF6B00] hover:bg-orange-50 transition-all">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={handleCostingDocuments}
                  className="hidden"
                />
                <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PDF, Images, Documents (Max 10MB each)
                </p>
              </label>

              {costingDocuments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {costingDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="text-[#FF6B00]" size={20} />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCostingDocument(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add any additional information about these expenses..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Step 3 of 3: Final Submission
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Record contractor expenses if any were incurred (flights, accommodation, phone bills, etc.). This section is optional - if the contractor has no expenses, you can submit without adding any. When you click 'Submit for Review', the complete contractor profile will be sent to admin/superadmin for approval.
            </p>
            <p className="text-sm font-semibold text-blue-900 mb-1">What happens after submission:</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Admin/superadmin reviews all contractor details and expenses</li>
              <li>Admin approves or requests changes</li>
              <li>Upon approval, a contract is generated and sent to the contractor</li>
              <li>After contract signing, admin activates the contractor account</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href={`/dashboard/contractors/complete-cds/${contractorId}`}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all"
            >
              Back to CDS Form
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#FF6B00] hover:bg-[#FF8533] text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Submit for Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
