"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import CountrySelect from "@/components/CountrySelect";
import {
  Search,
  Plus,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive" | "pending";
  projectsCount: number;
  contractorsCount: number;
  industry: string;
  contactPerson: string;
  joinDate: string;
  projects: string[];
}

export default function ClientsPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedClient, setExpandedClient] = useState<number | null>(null);
  const [projects, setProjects] = useState<string[]>([""]);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Load clients from API
  React.useEffect(() => {
    const loadClients = async () => {
      try {
        // TODO: Replace with actual API endpoint when backend is ready
        // const token = localStorage.getItem("aventus-auth-token");
        // const response = await fetch("http://localhost:8000/api/v1/clients", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const data = await response.json();
        // setClientsData(data);

        // For now, set empty array until backend API is implemented
        setClientsData([]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading clients:", error);
        setClientsData([]);
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const addProject = () => {
    setProjects([...projects, ""]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = value;
    setProjects(updatedProjects);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setProjects([""]);  // Reset projects when closing
  };

  // Filter clients
  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || client.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 flex items-center gap-1">
            <CheckCircle size={12} />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500 flex items-center gap-1">
            <Clock size={12} />
            Pending
          </span>
        );
      case "inactive":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 flex items-center gap-1">
            <XCircle size={12} />
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const stats = React.useMemo(() => ({
    total: clientsData.length,
    active: clientsData.filter((c) => c.status === "active").length,
    pending: clientsData.filter((c) => c.status === "pending").length,
    inactive: clientsData.filter((c) => c.status === "inactive").length,
  }), [clientsData]);

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
            Clients
          </h1>
          <p className="text-gray-400 mt-2">
            Manage client companies and their projects
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Clients</p>
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-[#FF6B00]/10 rounded-lg">
              <Building className="text-[#FF6B00]" size={24} />
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active</p>
              <p className="text-3xl font-bold text-green-500">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Inactive</p>
              <p className="text-3xl font-bold text-gray-500">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-gray-500/10 rounded-lg">
              <XCircle className="text-gray-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-6 shadow-sm mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search clients by name, email, location or contact person..."
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
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-sm p-12`}>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
          </div>
        </div>
      )}

      {/* Clients Table */}
      {!loading && (
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-sm overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  theme === "dark" ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-50"
                }`}
              >
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Client Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Contact Person
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Email & Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Projects
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <React.Fragment key={client.id}>
                  <tr
                    className={`border-b ${
                      theme === "dark"
                        ? "border-gray-800 hover:bg-gray-800"
                        : "border-gray-100 hover:bg-gray-50"
                    } transition-all`}
                  >
                    {/* Client Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF6B00] rounded-lg flex items-center justify-center text-white font-semibold">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {client.name}
                          </p>
                          <p className="text-xs text-gray-400">{client.industry}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {client.contactPerson}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <p className="text-sm text-gray-400">{client.location}</p>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <p className="text-xs text-gray-400">{client.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <p className="text-xs text-gray-400">{client.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Projects - Now Clickable */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="text-center">
                          <p
                            className={`text-lg font-bold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {client.projectsCount}
                          </p>
                          <p className="text-xs text-gray-400">Projects</p>
                        </div>
                        <div className="text-center">
                          <p
                            className={`text-lg font-bold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {client.contractorsCount}
                          </p>
                          <p className="text-xs text-gray-400">Contractors</p>
                        </div>
                        {expandedClient === client.id ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(client.status)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className={`p-2 rounded-lg transition-all ${
                            theme === "dark"
                              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-all ${
                            theme === "dark"
                              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Projects Row */}
                  {expandedClient === client.id && (
                    <tr
                      className={`${
                        theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                      }`}
                    >
                      <td colSpan={7} className="px-6 py-4">
                        <div className="pl-16">
                          <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                            <Briefcase size={16} className="text-[#FF6B00]" />
                            Active Projects ({client.projects.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {client.projects.map((project, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  theme === "dark"
                                    ? "bg-gray-900 border-gray-700"
                                    : "bg-white border-gray-200"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-[#FF6B00] rounded-full"></div>
                                  <p className={`text-sm font-medium ${
                                    theme === "dark" ? "text-white" : "text-gray-900"
                                  }`}>
                                    {project}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <h3
              className={`text-lg font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {searchQuery || selectedStatus !== "all" ? "No Clients Found" : "No Clients Yet"}
            </h3>
            <p className="text-gray-400">
              {searchQuery || selectedStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Click 'Add Client' to create your first client"
              }
            </p>
          </div>
        )}
      </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add New Client
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="Company name"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Technology, Finance"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
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
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@company.com"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
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
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>

              {/* Address Details */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Address Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      placeholder="Street address"
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      placeholder="Building, floor, suite (optional)"
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="Postal code"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Country
                      </label>
                      <CountrySelect theme={theme} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Projects
                  </h3>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#FF8533] text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Project
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={project}
                        onChange={(e) => updateProject(index, e.target.value)}
                        placeholder={`Project ${index + 1}`}
                        className={`flex-1 px-4 py-3 rounded-lg border transition-all outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                      />
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Status
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={closeModal}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle form submission here
                  alert("Client added successfully!");
                  closeModal();
                }}
                className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 rounded-lg transition-all"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
