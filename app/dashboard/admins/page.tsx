"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Plus,
  UserCog,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Calendar,
  Briefcase,
  Users,
  Building,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  role: "superadmin" | "admin" | "consultant" | "client" | "contractor";
  created_at: string;
  profile_photo: string | null;
  permissions: {
    [key: string]: boolean;
  } | null;
  is_active: boolean;
}

// Permission options for each role
const ADMIN_PERMISSIONS = [
  { key: "manage_contractors", label: "Manage Contractors" },
  { key: "manage_clients", label: "Manage Clients" },
  { key: "manage_projects", label: "Manage Projects" },
  { key: "view_reports", label: "View Reports" },
  { key: "manage_timesheets", label: "Manage Timesheets" },
  { key: "system_settings", label: "System Settings" },
];

const CONSULTANT_PERMISSIONS = [
  { key: "add_contractors", label: "Add Contractors" },
  { key: "send_documents_request", label: "Send Document Requests" },
  { key: "complete_cds_form", label: "Complete CDS Forms" },
  { key: "view_contractor_status", label: "View Contractor Status" },
];

const CLIENT_PERMISSIONS = [
  { key: "view_contractors", label: "View Their Contractors" },
  { key: "approve_timesheets", label: "Approve Timesheets" },
  { key: "view_invoices", label: "View Invoices" },
  { key: "view_reports", label: "View Reports" },
];

const CONTRACTOR_PERMISSIONS = [
  { key: "submit_timesheets", label: "Submit Timesheets" },
  { key: "track_expenses", label: "Track Expenses" },
  { key: "view_documents", label: "View Documents" },
  { key: "view_projects", label: "View Projects" },
];

export default function AdminsPage() {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "admin",
    is_active: true,
    profile_photo: "",
    permissions: {} as { [key: string]: boolean },
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch("http://localhost:8000/api/v1/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      // Validate form
      if (!formData.name || !formData.email) {
        alert("Please fill in all required fields");
        return;
      }

      const response = await fetch("http://localhost:8000/api/v1/auth/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create user");
      }

      // Success
      const roleLabel = getRoleLabel(formData.role);
      alert(`${roleLabel} created successfully! An email with login credentials has been sent.`);
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      console.error("Error creating user:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone_number: user.phone_number || "",
      role: user.role,
      is_active: user.is_active,
      profile_photo: user.profile_photo || "",
      permissions: user.permissions || {},
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      // Validate form
      if (!formData.name || !formData.email) {
        alert("Please fill in all required fields");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/auth/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update user");
      }

      // Success
      const roleLabel = getRoleLabel(formData.role);
      alert(`${roleLabel} updated successfully!`);
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      console.error("Error updating user:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string, userRole: string) => {
    const roleLabel = getRoleLabel(userRole);
    if (!confirm(`Are you sure you want to delete ${userName} (${roleLabel})?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete user");
      }

      alert("User deleted successfully");
      fetchUsers();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      role: "admin",
      is_active: true,
      profile_photo: "",
      permissions: {},
    });
  };

  const handlePermissionChange = (key: string, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: checked,
      },
    });
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      superadmin: "Super Admin",
      admin: "Admin",
      consultant: "Consultant",
      client: "Client",
      contractor: "Contractor",
    };
    return labels[role] || role;
  };

  const getRoleBadge = (role: string) => {
    const badges: { [key: string]: { icon: any; label: string; color: string } } = {
      superadmin: { icon: Shield, label: "Super Admin", color: "red" },
      admin: { icon: UserCog, label: "Admin", color: "purple" },
      consultant: { icon: Briefcase, label: "Consultant", color: "blue" },
      client: { icon: Building, label: "Client", color: "green" },
      contractor: { icon: Users, label: "Contractor", color: "orange" },
    };

    const badge = badges[role] || badges.contractor;
    const Icon = badge.icon;

    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Icon size={14} />
        <span>{badge.label}</span>
      </div>
    );
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      superadmin: "from-red-500 to-red-600",
      admin: "from-purple-500 to-purple-600",
      consultant: "from-blue-500 to-blue-600",
      client: "from-green-500 to-green-600",
      contractor: "from-orange-500 to-orange-600",
    };
    return colors[role] || colors.contractor;
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Hide superadmin accounts from the list entirely
    if (user.role === "superadmin") {
      return false;
    }

    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone_number && user.phone_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || (user.is_active ? "active" : "inactive") === selectedStatus;

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (is_active: boolean) => {
    if (is_active) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 flex items-center gap-1">
          <CheckCircle size={12} />
          Active
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 flex items-center gap-1">
          <XCircle size={12} />
          Inactive
        </span>
      );
    }
  };

  const stats = {
    total: users.filter((u) => u.role !== "superadmin").length,
    active: users.filter((u) => u.is_active && u.role !== "superadmin").length,
    inactive: users.filter((u) => !u.is_active && u.role !== "superadmin").length,
    admins: users.filter((u) => u.role === "admin").length,
    consultants: users.filter((u) => u.role === "consultant").length,
    clients: users.filter((u) => u.role === "client").length,
    contractors: users.filter((u) => u.role === "contractor").length,
  };

  const getAvatar = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getPermissionsList = () => {
    switch (formData.role) {
      case "admin":
        return ADMIN_PERMISSIONS;
      case "consultant":
        return CONSULTANT_PERMISSIONS;
      case "client":
        return CLIENT_PERMISSIONS;
      case "contractor":
        return CONTRACTOR_PERMISSIONS;
      default:
        return [];
    }
  };

  const permissionsList = getPermissionsList();

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
            User Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage all system users and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 btn-parallelogram transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } stats-parallelogram p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Total</p>
          <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {stats.total}
          </p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } stats-parallelogram p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Admins</p>
          <p className="text-2xl font-bold text-purple-500">{stats.admins}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } stats-parallelogram p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Consultants</p>
          <p className="text-2xl font-bold text-blue-500">{stats.consultants}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } stats-parallelogram p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Clients</p>
          <p className="text-2xl font-bold text-green-500">{stats.clients}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } stats-parallelogram p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Contractors</p>
          <p className="text-2xl font-bold text-orange-500">{stats.contractors}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } stats-parallelogram p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Active</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } stats-parallelogram p-4 shadow-sm`}
        >
          <p className="text-gray-400 text-xs mb-1">Inactive</p>
          <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } card-parallelogram p-6 shadow-sm mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="consultant">Consultant</option>
              <option value="client">Client</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
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
          <p className="text-gray-400 mt-4">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Users List (Table) */}
      {!loading && !error && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } card-parallelogram shadow-sm overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`${
                      theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(
                            user.role
                          )} rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {getAvatar(user.name)}
                        </div>
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail size={12} />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                        {user.phone_number && (
                          <div className="flex items-center gap-2">
                            <Phone size={12} />
                            <span>{user.phone_number}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.is_active)}
                    </td>

                    {/* Permissions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {user.permissions && Object.keys(user.permissions).length > 0 ? (
                          <>
                            {Object.entries(user.permissions)
                              .filter(([_, value]) => value)
                              .slice(0, 2)
                              .map(([key, _], index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400"
                                >
                                  {key.replace(/_/g, " ")}
                                </span>
                              ))}
                            {Object.values(user.permissions).filter((v) => v).length > 2 && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
                                +{Object.values(user.permissions).filter((v) => v).length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 btn-parallelogram bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all text-sm font-medium"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name, user.role)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 btn-parallelogram bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all text-sm font-medium"
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

      {!loading && !error && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserCog size={48} className="mx-auto text-gray-400 mb-4" />
          <h3
            className={`text-lg font-semibold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            No Users Found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } card-parallelogram max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add New {getRoleLabel(formData.role)}
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

            <div className="p-6 space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value, permissions: {} })
                  }
                  className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="admin">Admin</option>
                  <option value="consultant">Consultant</option>
                  <option value="client">Client</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
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
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
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

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Profile Photo URL (optional)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profile_photo}
                  onChange={(e) =>
                    setFormData({ ...formData, profile_photo: e.target.value })
                  }
                  className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              {permissionsList.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Permissions for {getRoleLabel(formData.role)}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {permissionsList.map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions[permission.key] || false}
                          onChange={(e) =>
                            handlePermissionChange(permission.key, e.target.checked)
                          }
                          className="w-4 h-4 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00]"
                        />
                        <span className="text-sm text-gray-400">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                  📧 A temporary password will be automatically generated and sent to the user's email address. They will be required to change it on first login.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={submitting}
                className={`flex-1 py-3 btn-parallelogram font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={submitting}
                className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 btn-parallelogram transition-all disabled:opacity-50"
              >
                {submitting ? "Adding..." : `Add ${getRoleLabel(formData.role)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } card-parallelogram max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Edit {getRoleLabel(formData.role)}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value, permissions: {} })
                  }
                  className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="admin">Admin</option>
                  <option value="consultant">Consultant</option>
                  <option value="client">Client</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
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
                    className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
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

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Profile Photo URL (optional)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profile_photo}
                  onChange={(e) =>
                    setFormData({ ...formData, profile_photo: e.target.value })
                  }
                  className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                />
              </div>

              {permissionsList.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Permissions for {getRoleLabel(formData.role)}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {permissionsList.map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions[permission.key] || false}
                          onChange={(e) =>
                            handlePermissionChange(permission.key, e.target.checked)
                          }
                          className="w-4 h-4 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00]"
                        />
                        <span className="text-sm text-gray-400">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  resetForm();
                }}
                disabled={submitting}
                className={`flex-1 py-3 btn-parallelogram font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={submitting}
                className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 btn-parallelogram transition-all disabled:opacity-50"
              >
                {submitting ? "Updating..." : `Update ${getRoleLabel(formData.role)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
