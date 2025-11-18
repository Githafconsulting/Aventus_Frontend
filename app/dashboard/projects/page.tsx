"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  Plus,
  Briefcase,
  Building,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  client: string;
  clientId: number;
  status: "active" | "completed" | "on-hold" | "cancelled";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  contractors: number;
  manager: string;
  description: string;
  progress: number;
  contractorsList: string[];
}

// Sample projects data
const projectsData: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform",
    client: "Tech Corp Inc.",
    clientId: 1,
    status: "active",
    startDate: "2024-01-15",
    endDate: "2025-03-30",
    budget: 500000,
    spent: 320000,
    contractors: 8,
    manager: "Sarah Johnson",
    description: "Building a comprehensive e-commerce platform with advanced features including AI-powered recommendations, real-time inventory management, and multi-vendor support.",
    progress: 64,
    contractorsList: ["John Smith", "Emma Wilson", "Michael Brown", "Sarah Davis", "Tom Anderson", "Lisa Chen", "David Martinez", "Jane Cooper"],
  },
  {
    id: 2,
    name: "Mobile App",
    client: "Tech Corp Inc.",
    clientId: 1,
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-12-31",
    budget: 300000,
    spent: 180000,
    contractors: 5,
    manager: "Mike Johnson",
    description: "Native iOS and Android mobile application with offline capabilities, push notifications, and seamless cloud synchronization.",
    progress: 60,
    contractorsList: ["John Smith", "Emma Wilson", "Sarah Davis", "Tom Anderson", "Lisa Chen"],
  },
  {
    id: 3,
    name: "Cloud Migration",
    client: "Tech Corp Inc.",
    clientId: 1,
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-11-30",
    budget: 400000,
    spent: 350000,
    contractors: 6,
    manager: "Sarah Johnson",
    description: "Migrating legacy infrastructure to cloud-based solutions with zero downtime and enhanced security protocols.",
    progress: 87,
    contractorsList: ["Michael Brown", "David Martinez", "Jane Cooper", "Tom Anderson", "Lisa Chen", "Sarah Davis"],
  },
  {
    id: 4,
    name: "Brand Redesign",
    client: "Design Studio Ltd.",
    clientId: 2,
    status: "completed",
    startDate: "2023-11-01",
    endDate: "2024-02-28",
    budget: 150000,
    spent: 145000,
    contractors: 4,
    manager: "Emily Davis",
    description: "Complete brand identity redesign including logo, color palette, typography, and brand guidelines.",
    progress: 100,
    contractorsList: ["Emma Wilson", "Sarah Davis", "Lisa Chen", "Jane Cooper"],
  },
  {
    id: 5,
    name: "Trading Platform",
    client: "Global Finance Group",
    clientId: 3,
    status: "active",
    startDate: "2024-01-10",
    endDate: "2025-06-30",
    budget: 800000,
    spent: 420000,
    contractors: 12,
    manager: "James Brown",
    description: "High-frequency trading platform with real-time data processing, advanced analytics, and multi-exchange connectivity.",
    progress: 52,
    contractorsList: ["John Smith", "Michael Brown", "David Martinez", "Tom Anderson", "Lisa Chen", "Sarah Davis", "Jane Cooper", "Emma Wilson", "Alex Johnson", "Chris Lee", "Maria Garcia", "Robert Kim"],
  },
  {
    id: 6,
    name: "Patient Portal",
    client: "HealthCare Solutions",
    clientId: 4,
    status: "on-hold",
    startDate: "2024-10-15",
    endDate: "2025-04-30",
    budget: 250000,
    spent: 50000,
    contractors: 3,
    manager: "Sarah Johnson",
    description: "Secure patient portal for accessing medical records, scheduling appointments, and communicating with healthcare providers.",
    progress: 20,
    contractorsList: ["John Smith", "Sarah Davis", "Lisa Chen"],
  },
  {
    id: 7,
    name: "Inventory Management System",
    client: "Retail Innovations",
    clientId: 5,
    status: "cancelled",
    startDate: "2023-09-01",
    endDate: "2024-03-31",
    budget: 200000,
    spent: 80000,
    contractors: 4,
    manager: "Mike Johnson",
    description: "Comprehensive inventory management system with barcode scanning, real-time stock tracking, and automated reordering.",
    progress: 40,
    contractorsList: ["Michael Brown", "Tom Anderson", "David Martinez", "Jane Cooper"],
  },
];

export default function ProjectsPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  // Filter projects
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;

    const matchesClient =
      selectedClient === "all" || project.client === selectedClient;

    return matchesSearch && matchesStatus && matchesClient;
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
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 flex items-center gap-1">
            <CheckCircle size={12} />
            Completed
          </span>
        );
      case "on-hold":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500 flex items-center gap-1">
            <AlertCircle size={12} />
            On Hold
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 flex items-center gap-1">
            <XCircle size={12} />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: projectsData.length,
    active: projectsData.filter((p) => p.status === "active").length,
    completed: projectsData.filter((p) => p.status === "completed").length,
    onHold: projectsData.filter((p) => p.status === "on-hold").length,
    totalBudget: projectsData.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projectsData.reduce((sum, p) => sum + p.spent, 0),
  };

  const uniqueClients = Array.from(
    new Set(projectsData.map((p) => p.client))
  ).sort();

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
            Projects
          </h1>
          <p className="text-gray-400 mt-2">
            Manage client projects and track progress
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Projects</p>
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-[#FF6B00]/10 rounded-lg">
              <Briefcase className="text-[#FF6B00]" size={24} />
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
              <p className="text-gray-400 text-sm mb-1">Total Budget</p>
              <p className="text-3xl font-bold text-blue-500">
                ${(stats.totalBudget / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <DollarSign className="text-blue-500" size={24} />
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
              <p className="text-gray-400 text-sm mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-purple-500">
                ${(stats.totalSpent / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <TrendingUp className="text-purple-500" size={24} />
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
                placeholder="Search projects by name, client or manager..."
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
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Client Filter */}
          <div>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Clients</option>
              {uniqueClients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-sm overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-gray-50"
              } border-b ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Project Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Manager
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Progress
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Team
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Budget
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const budgetPercentage = (project.spent / project.budget) * 100;
                const isExpanded = expandedProject === project.id;

                return (
                  <React.Fragment key={project.id}>
                    <tr
                      className={`border-b ${
                        theme === "dark" ? "border-gray-800" : "border-gray-200"
                      } ${
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      } transition-all`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {project.name.charAt(0)}
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {project.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(project.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              →{" "}
                              {new Date(project.endDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-400 text-sm">{project.client}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {project.manager}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-sm font-semibold mb-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {project.progress}%
                          </span>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-[#FF6B00] h-1.5 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p
                          className={`font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {project.contractors}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ${(project.budget / 1000).toFixed(0)}K
                          </p>
                          <p
                            className={`text-xs font-semibold ${
                              budgetPercentage > 90
                                ? "text-red-500"
                                : budgetPercentage > 75
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            ${(project.spent / 1000).toFixed(0)}K spent
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setExpandedProject(isExpanded ? null : project.id)
                            }
                            className={`p-2 rounded-lg transition-all ${
                              theme === "dark"
                                ? "bg-gray-800 hover:bg-gray-700 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                            }`}
                            title={isExpanded ? "Hide Details" : "View Details"}
                          >
                            {isExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                          <button
                            className={`p-2 rounded-lg transition-all ${
                              theme === "dark"
                                ? "bg-gray-800 hover:bg-gray-700 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                            }`}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <tr
                        className={`border-b ${
                          theme === "dark" ? "border-gray-800" : "border-gray-200"
                        }`}
                      >
                        <td colSpan={8} className={`px-6 py-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                          <div className="space-y-6">
                            {/* Description */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">
                                Project Description
                              </h4>
                              <p className="text-sm text-gray-400">
                                {project.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Team Members */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-400 mb-3">
                                  Team Members ({project.contractorsList.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.contractorsList.map((contractor, index) => (
                                    <span
                                      key={index}
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        theme === "dark"
                                          ? "bg-gray-700 text-white"
                                          : "bg-gray-200 text-gray-900"
                                      }`}
                                    >
                                      {contractor}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Budget Breakdown */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-400 mb-3">
                                  Budget Overview
                                </h4>
                                <div className="grid grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">Total Budget</p>
                                    <p
                                      className={`font-bold ${
                                        theme === "dark" ? "text-white" : "text-gray-900"
                                      }`}
                                    >
                                      ${project.budget.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">Spent</p>
                                    <p className="font-bold text-purple-500">
                                      ${project.spent.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">Remaining</p>
                                    <p className="font-bold text-green-500">
                                      ${(project.budget - project.spent).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">
                                      Budget Utilization
                                    </span>
                                    <span className="text-xs font-semibold text-gray-400">
                                      {budgetPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        budgetPercentage > 90
                                          ? "bg-red-500"
                                          : budgetPercentage > 75
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h3
            className={`text-lg font-semibold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            No Projects Found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Add Project Modal */}
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
                  Add New Project
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
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
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Client
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  >
                    <option value="">Select client</option>
                    {uniqueClients.map((client) => (
                      <option key={client} value={client}>
                        {client}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Budget
                  </label>
                  <input
                    type="number"
                    placeholder="Enter budget amount"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Project Manager
                  </label>
                  <input
                    type="text"
                    placeholder="Assign project manager"
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
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter project description"
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
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 rounded-lg transition-all">
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
