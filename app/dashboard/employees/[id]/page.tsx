"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Edit,
  FileText,
  Download,
  Trash2,
} from "lucide-react";
import Link from "next/link";

// Sample employee data (in real app, fetch from API)
const employeeData = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.johnson@aventus.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, San Francisco, CA 94105",
  department: "Engineering",
  position: "Senior Software Engineer",
  status: "active",
  joinDate: "2022-01-15",
  dateOfBirth: "1990-05-20",
  emergencyContact: {
    name: "John Johnson",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
  },
  salary: "$120,000",
  employeeId: "EMP-001",
  avatar: "SJ",
  documents: [
    { name: "Employment Contract.pdf", uploadDate: "2022-01-15", size: "245 KB" },
    { name: "ID Proof.pdf", uploadDate: "2022-01-15", size: "180 KB" },
    { name: "Resume.pdf", uploadDate: "2022-01-10", size: "320 KB" },
    { name: "Tax Documents.pdf", uploadDate: "2022-01-15", size: "156 KB" },
  ],
};

export default function EmployeeProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<
    "personal" | "contact" | "documents"
  >("personal");

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "contact", label: "Contact & Emergency" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <DashboardLayout>
      {/* Back Button & Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Employees
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {employeeData.avatar}
            </div>

            {/* Employee Info */}
            <div>
              <h1
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {employeeData.name}
              </h1>
              <p className="text-gray-400 text-lg mt-1">
                {employeeData.position}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    employeeData.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {employeeData.status}
                </span>
                <span className="text-gray-400 text-sm">
                  ID: {employeeData.employeeId}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/employees/${params.id}/edit`}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              <Edit size={18} />
              Edit Employee
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`border-b ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        } mb-6`}
      >
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 font-medium transition-all ${
                activeTab === tab.id
                  ? "text-[#FF6B00] border-b-2 border-[#FF6B00]"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <>
            <div
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } rounded-lg p-6 shadow-sm`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Employee ID</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.employeeId}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Full Name</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.name}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Date of Birth</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Date(employeeData.dateOfBirth).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Join Date</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Date(employeeData.joinDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } rounded-lg p-6 shadow-sm`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Employment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Department</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.department}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Position</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.position}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Salary</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.salary}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.status.charAt(0).toUpperCase() +
                      employeeData.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <>
            <div
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } rounded-lg p-6 shadow-sm`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-[#FF6B00] mt-1" size={20} />
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {employeeData.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-[#FF6B00] mt-1" size={20} />
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {employeeData.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#FF6B00] mt-1" size={20} />
                  <div>
                    <label className="text-gray-400 text-sm">Address</label>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {employeeData.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } rounded-lg p-6 shadow-sm`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Emergency Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Name</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.emergencyContact.name}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Relationship</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.emergencyContact.relationship}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Phone</label>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employeeData.emergencyContact.phone}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div
            className={`lg:col-span-2 ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Employee Documents
              </h3>
              <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm">
                Upload Document
              </button>
            </div>

            <div className="space-y-3">
              {employeeData.documents.map((doc, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  } transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
                      <FileText className="text-[#FF6B00]" size={20} />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {doc.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Uploaded on{" "}
                        {new Date(doc.uploadDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg transition-all ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-gray-400 hover:text-white"
                          : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Download size={18} />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-all ${
                        theme === "dark"
                          ? "hover:bg-red-500/10 text-gray-400 hover:text-red-500"
                          : "hover:bg-red-50 text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
