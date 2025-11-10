"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

interface ThirdParty {
  id: string;
  company_name: string;
  registered_address: string | null;
  company_vat_no: string | null;
  company_reg_no: string | null;
  contact_person_name: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;
  bank_name: string | null;
  account_number: string | null;
  iban_number: string | null;
  swift_code: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function ThirdPartiesPage() {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company_name: "",
    registered_address: "",
    company_vat_no: "",
    company_reg_no: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    bank_name: "",
    account_number: "",
    iban_number: "",
    swift_code: "",
    notes: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch third parties on mount
  useEffect(() => {
    fetchThirdParties();
  }, []);

  const fetchThirdParties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/third-parties?include_inactive=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch third parties");
      }

      const data = await response.json();
      setThirdParties(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching third parties:", err);
      setError("Failed to load third parties");
    } finally {
      setLoading(false);
    }
  };

  const handleAddThirdParty = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      // Validate form
      if (!formData.company_name) {
        alert("Please enter company name");
        return;
      }

      const response = await fetch("http://localhost:8000/api/v1/third-parties/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create third party");
      }

      // Success
      alert(`${formData.company_name} created successfully!`);
      setShowAddModal(false);
      resetForm();
      fetchThirdParties();
    } catch (err: any) {
      console.error("Error creating third party:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditThirdParty = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token || !editingId) {
        alert("Not authenticated");
        return;
      }

      // Validate form
      if (!formData.company_name) {
        alert("Please enter company name");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/third-parties/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update third party");
      }

      // Success
      alert(`${formData.company_name} updated successfully!`);
      setShowEditModal(false);
      setEditingId(null);
      resetForm();
      fetchThirdParties();
    } catch (err: any) {
      console.error("Error updating third party:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteThirdParty = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/third-parties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete third party");
      }

      alert("Third party deleted successfully");
      fetchThirdParties();
    } catch (err: any) {
      console.error("Error deleting third party:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const openEditModal = (thirdParty: ThirdParty) => {
    setEditingId(thirdParty.id);
    setFormData({
      company_name: thirdParty.company_name,
      registered_address: thirdParty.registered_address || "",
      company_vat_no: thirdParty.company_vat_no || "",
      company_reg_no: thirdParty.company_reg_no || "",
      contact_person_name: thirdParty.contact_person_name || "",
      contact_person_email: thirdParty.contact_person_email || "",
      contact_person_phone: thirdParty.contact_person_phone || "",
      bank_name: thirdParty.bank_name || "",
      account_number: thirdParty.account_number || "",
      iban_number: thirdParty.iban_number || "",
      swift_code: thirdParty.swift_code || "",
      notes: thirdParty.notes || "",
      is_active: thirdParty.is_active,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      registered_address: "",
      company_vat_no: "",
      company_reg_no: "",
      contact_person_name: "",
      contact_person_email: "",
      contact_person_phone: "",
      bank_name: "",
      account_number: "",
      iban_number: "",
      swift_code: "",
      notes: "",
      is_active: true,
    });
  };

  // Filter third parties
  const filteredThirdParties = thirdParties.filter((tp) => {
    const matchesSearch =
      tp.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tp.contact_person_name &&
        tp.contact_person_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tp.contact_person_email &&
        tp.contact_person_email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || (tp.is_active ? "active" : "inactive") === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (is_active: boolean) => {
    if (is_active) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 flex items-center gap-1 w-fit">
          <CheckCircle size={12} />
          Active
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 flex items-center gap-1 w-fit">
          <XCircle size={12} />
          Inactive
        </span>
      );
    }
  };

  const stats = {
    total: thirdParties.length,
    active: thirdParties.filter((tp) => tp.is_active).length,
    inactive: thirdParties.filter((tp) => !tp.is_active).length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Third Party Companies
          </h1>
          <p className="text-gray-400 mt-2">
            Manage third party companies and their details
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add Third Party
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Total</p>
          <p
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.total}
          </p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Active</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Inactive</p>
          <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-6 shadow-sm mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by company name, contact person or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading third parties...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Third Parties List */}
      {!loading && !error && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg shadow-sm overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Banking
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredThirdParties.map((tp) => (
                  <tr
                    key={tp.id}
                    className={`${
                      theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {/* Company */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {tp.company_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {tp.company_name}
                          </div>
                          {tp.registered_address && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <MapPin size={10} />
                              {tp.registered_address}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {tp.contact_person_name && (
                          <div className="font-medium mb-1">{tp.contact_person_name}</div>
                        )}
                        {tp.contact_person_email && (
                          <div className="flex items-center gap-2 mb-1">
                            <Mail size={12} />
                            <span className="truncate max-w-[180px]">
                              {tp.contact_person_email}
                            </span>
                          </div>
                        )}
                        {tp.contact_person_phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={12} />
                            <span>{tp.contact_person_phone}</span>
                          </div>
                        )}
                        {!tp.contact_person_name &&
                          !tp.contact_person_email &&
                          !tp.contact_person_phone && (
                            <span className="text-xs text-gray-500">No contact info</span>
                          )}
                      </div>
                    </td>

                    {/* Registration */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {tp.company_reg_no && (
                          <div className="flex items-center gap-2 mb-1">
                            <FileText size={12} />
                            <span>Reg: {tp.company_reg_no}</span>
                          </div>
                        )}
                        {tp.company_vat_no && (
                          <div className="flex items-center gap-2">
                            <FileText size={12} />
                            <span>VAT: {tp.company_vat_no}</span>
                          </div>
                        )}
                        {!tp.company_reg_no && !tp.company_vat_no && (
                          <span className="text-xs text-gray-500">No registration info</span>
                        )}
                      </div>
                    </td>

                    {/* Banking */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {tp.bank_name && (
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard size={12} />
                            <span>{tp.bank_name}</span>
                          </div>
                        )}
                        {tp.iban_number && (
                          <div className="text-xs">IBAN: {tp.iban_number}</div>
                        )}
                        {!tp.bank_name && !tp.iban_number && (
                          <span className="text-xs text-gray-500">No banking info</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(tp.is_active)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(tp)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all text-sm font-medium"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteThirdParty(tp.id, tp.company_name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          Delete
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

      {!loading && !error && filteredThirdParties.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3
            className={`text-lg font-semibold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            No Third Parties Found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Add Third Party Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add New Third Party Company
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Registered Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter registered address"
                      value={formData.registered_address}
                      onChange={(e) =>
                        setFormData({ ...formData, registered_address: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Company Registration Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter registration number"
                        value={formData.company_reg_no}
                        onChange={(e) =>
                          setFormData({ ...formData, company_reg_no: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        VAT Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter VAT number"
                        value={formData.company_vat_no}
                        onChange={(e) =>
                          setFormData({ ...formData, company_vat_no: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Contact Person
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter contact person name"
                      value={formData.contact_person_name}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_person_name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="contact@example.com"
                        value={formData.contact_person_email}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_person_email: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.contact_person_phone}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_person_phone: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Banking Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bank name"
                      value={formData.bank_name}
                      onChange={(e) =>
                        setFormData({ ...formData, bank_name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter account number"
                        value={formData.account_number}
                        onChange={(e) =>
                          setFormData({ ...formData, account_number: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        IBAN Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter IBAN number"
                        value={formData.iban_number}
                        onChange={(e) =>
                          setFormData({ ...formData, iban_number: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      SWIFT Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter SWIFT code"
                      value={formData.swift_code}
                      onChange={(e) =>
                        setFormData({ ...formData, swift_code: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter any additional notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active ? "active" : "inactive"}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.value === "active" })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={submitting}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddThirdParty}
                disabled={submitting}
                className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Third Party"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Third Party Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Edit Third Party Company
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Same form fields as Add Modal */}
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Registered Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter registered address"
                      value={formData.registered_address}
                      onChange={(e) =>
                        setFormData({ ...formData, registered_address: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Company Registration Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter registration number"
                        value={formData.company_reg_no}
                        onChange={(e) =>
                          setFormData({ ...formData, company_reg_no: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        VAT Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter VAT number"
                        value={formData.company_vat_no}
                        onChange={(e) =>
                          setFormData({ ...formData, company_vat_no: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Contact Person
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter contact person name"
                      value={formData.contact_person_name}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_person_name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="contact@example.com"
                        value={formData.contact_person_email}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_person_email: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.contact_person_phone}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_person_phone: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Banking Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bank name"
                      value={formData.bank_name}
                      onChange={(e) =>
                        setFormData({ ...formData, bank_name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter account number"
                        value={formData.account_number}
                        onChange={(e) =>
                          setFormData({ ...formData, account_number: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        IBAN Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter IBAN number"
                        value={formData.iban_number}
                        onChange={(e) =>
                          setFormData({ ...formData, iban_number: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      SWIFT Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter SWIFT code"
                      value={formData.swift_code}
                      onChange={(e) =>
                        setFormData({ ...formData, swift_code: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter any additional notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active ? "active" : "inactive"}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.value === "active" })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingId(null);
                  resetForm();
                }}
                disabled={submitting}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleEditThirdParty}
                disabled={submitting}
                className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Third Party"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
