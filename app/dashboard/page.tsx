"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  DollarSign,
  UserCog,
  Building,
  Briefcase,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/config";

export default function Dashboard() {
  const { user } = useAuth();

  // Super Admin Dashboard
  const SuperAdminDashboard = () => {
    const [stats, setStats] = React.useState({
      contractors: 0,
      admins: 0,
      clients: 0,
      projects: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const loadStats = async () => {
        try {
          const token = localStorage.getItem("aventus-auth-token");
          if (!token) return;

          // Fetch contractors
          const contractorsResponse = await fetch(API_ENDPOINTS.contractors, {
            headers: { "Authorization": `Bearer ${token}` },
          });

          if (contractorsResponse.ok) {
            const contractors = await contractorsResponse.json();
            setStats(prev => ({ ...prev, contractors: contractors.length }));
          }

          // Fetch admins
          const adminsResponse = await fetch(API_ENDPOINTS.admins, {
            headers: { "Authorization": `Bearer ${token}` },
          });

          if (adminsResponse.ok) {
            const admins = await adminsResponse.json();
            setStats(prev => ({ ...prev, admins: admins.length }));
          }
        } catch (error) {
          console.error("Error loading stats:", error);
        } finally {
          setLoading(false);
        }
      };

      loadStats();
    }, []);

    return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Full system overview and control panel
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Admins */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">System Admins</p>
              <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.admins}</p>
              <p className="text-purple-100 text-sm mt-2">Active admins</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <UserCog size={24} />
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Clients</p>
              <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.clients}</p>
              <p className="text-blue-100 text-sm mt-2">Coming soon</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Building size={24} />
            </div>
          </div>
        </div>

        {/* Total Projects */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Projects</p>
              <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.projects}</p>
              <p className="text-green-100 text-sm mt-2">Coming soon</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase size={24} />
            </div>
          </div>
        </div>

        {/* Total Contractors */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Contractors</p>
              <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.contractors}</p>
              <p className="text-orange-100 text-sm mt-2">All statuses</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats - Hidden for now */}
      {false && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Revenue */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">Coming Soon</p>
              <p className="text-gray-500 text-sm mt-2">Feature in development</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        {/* Active Managers */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Managers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">Coming Soon</p>
              <p className="text-gray-500 text-sm mt-2">Feature in development</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <UserCog className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admin Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-gray-400 text-sm mt-1">Activity will appear here once admins start managing the system</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                href="/dashboard/admins"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all block text-center flex items-center justify-center gap-2"
              >
                <UserCog size={18} />
                Manage Admins
              </Link>
              <Link
                href="/dashboard/system-settings"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all block text-center flex items-center justify-center gap-2"
              >
                <Shield size={18} />
                System Settings
              </Link>
              <Link
                href="/dashboard/contractors"
                className="w-full font-medium py-3 px-4 rounded-lg transition-all block text-center bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                View Contractors
              </Link>
              <Link
                href="/dashboard/clients"
                className="w-full font-medium py-3 px-4 rounded-lg transition-all block text-center bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                View Clients
              </Link>
              <Link
                href="/dashboard/projects"
                className="w-full font-medium py-3 px-4 rounded-lg transition-all block text-center bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => {
    const [contractors, setContractors] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const loadContractors = async () => {
        try {
          const token = localStorage.getItem("aventus-auth-token");
          if (!token) return;

          const response = await fetch(API_ENDPOINTS.contractors, {
            headers: { "Authorization": `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setContractors(data);
          }
        } catch (error) {
          console.error("Error loading contractors:", error);
        } finally {
          setLoading(false);
        }
      };

      loadContractors();
    }, []);

    return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Contractors */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Contractors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "..." : contractors.length}
              </p>
              <p className="text-gray-500 text-sm mt-2">All contractors</p>
            </div>
            <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
              <Users className="text-[#FF6B00]" size={24} />
            </div>
          </div>
        </div>

        {/* Pending Documents */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Documents</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "..." : contractors.filter(c => c.status === "PENDING_DOCUMENTS" || c.status === "pending_documents").length}
              </p>
              <p className="text-yellow-500 text-sm mt-2">Awaiting upload</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        {/* Documents Uploaded */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Documents Uploaded</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "..." : contractors.filter(c => c.status === "DOCUMENTS_UPLOADED" || c.status === "documents_uploaded").length}
              </p>
              <p className="text-blue-500 text-sm mt-2">Need CDS form</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        {/* Active Contractors */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "..." : contractors.filter(c => c.status === "ACTIVE" || c.status === "active").length}
              </p>
              <p className="text-green-500 text-sm mt-2">Working</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="text-green-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Contractors
            </h3>
            <Link
              href="/dashboard/contractors"
              className="text-[#FF6B00] hover:text-[#FF6B00]/80 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
              </div>
            ) : contractors.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No contractors yet</p>
                <p className="text-gray-400 text-sm mt-1">Start by onboarding your first contractor</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contractors.slice(0, 5).map((contractor, index) => (
                  <Link
                    key={index}
                    href={`/dashboard/contractors/${contractor.id}`}
                    className="flex items-center justify-between p-4 rounded-lg transition-all bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold">
                        {contractor.first_name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {contractor.first_name} {contractor.surname}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {contractor.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contractor.status === "ACTIVE" || contractor.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : contractor.status === "PENDING_DOCUMENTS" || contractor.status === "pending_documents"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : contractor.status === "DOCUMENTS_UPLOADED" || contractor.status === "documents_uploaded"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {contractor.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                href="/dashboard/contractors/add"
                className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-4 rounded-lg transition-all block text-center"
              >
                Add New Contractor
              </Link>
              <Link
                href="/dashboard/managers/add"
                className="w-full font-medium py-3 px-4 rounded-lg transition-all block text-center bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                Add Manager
              </Link>
              <Link
                href="/dashboard/timesheets"
                className="w-full font-medium py-3 px-4 rounded-lg transition-all block text-center bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                View All Timesheets
              </Link>
              <Link
                href="/dashboard/reports"
                className="w-full font-medium py-3 px-4 rounded-lg transition-all block text-center bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                Generate Report
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
    );
  };

  // Manager Dashboard - Timesheets coming soon
  const ManagerDashboard = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manager Dashboard
        </h1>
        <p className="text-gray-600">
          Timesheet management coming soon
        </p>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-12">
        <div className="text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Timesheet Management
          </h3>
          <p className="text-gray-500 mb-4">
            Review and approve contractor timesheets
          </p>
          <p className="text-gray-400 text-sm">
            This feature is currently in development
          </p>
        </div>
      </div>
    </>
  );

  // Contractor Dashboard - Timesheets coming soon
  const ContractorDashboard = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contractor Dashboard
        </h1>
        <p className="text-gray-600">
          Timesheet submission coming soon
        </p>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-12">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Timesheet Submission
          </h3>
          <p className="text-gray-500 mb-4">
            Submit and track your working hours
          </p>
          <p className="text-gray-400 text-sm">
            This feature is currently in development
          </p>
        </div>
      </div>
    </>
  );

  // Consultant Dashboard
  const ConsultantDashboard = () => {
    const [contractors, setContractors] = React.useState<any[]>([]);
    const [allContractors, setAllContractors] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const loadContractors = async () => {
        try {
          const token = localStorage.getItem("aventus-auth-token");
          if (!token) return;

          const response = await fetch(API_ENDPOINTS.contractors, {
            headers: { "Authorization": `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            // Store all contractors for stats
            setAllContractors(data);
            // Get only the latest 4 contractors for display
            setContractors(data.slice(0, 4));
          }
        } catch (error) {
          console.error("Error loading contractors:", error);
        } finally {
          setLoading(false);
        }
      };

      loadContractors();
    }, []);

    return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Consultant Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your contractor onboarding pipeline
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Pending Documents */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Documents</p>
              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : allContractors.filter(c => c.status === "PENDING_DOCUMENTS" || c.status === "pending_documents").length}
              </p>
              <p className="text-yellow-100 text-sm mt-2">Awaiting upload</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>
          </div>
        </div>

        {/* Documents Uploaded */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Documents Uploaded</p>
              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : allContractors.filter(c => c.status === "DOCUMENTS_UPLOADED" || c.status === "documents_uploaded").length}
              </p>
              <p className="text-blue-100 text-sm mt-2">Need CDS form</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pending Review</p>
              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : allContractors.filter(c => c.status === "PENDING_REVIEW" || c.status === "pending_review").length}
              </p>
              <p className="text-purple-100 text-sm mt-2">With admin</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        {/* Active Contractors */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Contractors</p>
              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : allContractors.filter(c => c.status === "ACTIVE" || c.status === "active" || c.status === "SIGNED" || c.status === "signed").length}
              </p>
              <p className="text-green-100 text-sm mt-2">Working</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contractors List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              My Contractors
            </h3>
            <Link
              href="/dashboard/contractors"
              className="text-[#FF6B00] hover:text-[#FF6B00]/80 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
              </div>
            ) : contractors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No contractors yet</p>
                <Link
                  href="/dashboard/contractors/create-initial"
                  className="mt-4 inline-block text-[#FF6B00] hover:text-[#FF6B00]/80 text-sm font-medium"
                >
                  Add your first contractor
                </Link>
              </div>
            ) : (
            <div className="space-y-4">
              {contractors.map((contractor, index) => (
                <Link
                  key={index}
                  href={`/dashboard/contractors/${contractor.id}`}
                  className="flex items-center justify-between p-4 rounded-lg transition-all bg-gray-50 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold">
                      {contractor.first_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {contractor.first_name} {contractor.surname}
                      </p>
                      <p className="text-gray-400 text-sm">{contractor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">
                        {new Date(contractor.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contractor.status === "SIGNED" || contractor.status === "signed"
                          ? "bg-green-500/10 text-green-500"
                          : contractor.status === "PENDING_DOCUMENTS" || contractor.status === "pending_documents"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : contractor.status === "DOCUMENTS_UPLOADED" || contractor.status === "documents_uploaded"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-purple-500/10 text-purple-500"
                      }`}
                    >
                      {contractor.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                href="/dashboard/contractors/create-initial"
                className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-4 rounded-lg transition-all block text-center"
              >
                Add New Contractor
              </Link>
              <Link
                href="/dashboard/contractors"
                className="w-full font-medium py-3 px-4 rounded-lg transition-all block text-center bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                View All Contractors
              </Link>
            </div>

            {/* Status Legend */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-400 mb-4">
                STATUS GUIDE
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <p className="text-sm text-gray-600">Pending Documents</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p className="text-sm text-gray-600">Documents Uploaded</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <p className="text-sm text-gray-600">Contract Signed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    );
  };

  return (
    <DashboardLayout>
      {user?.role === "superadmin" && <SuperAdminDashboard />}
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "consultant" && <ConsultantDashboard />}
      {user?.role === "manager" && <ManagerDashboard />}
      {user?.role === "contractor" && <ContractorDashboard />}
    </DashboardLayout>
  );
}
