"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Save, Eye, Maximize2, X } from "lucide-react";
import Image from "next/image";

export default function CreateContractorStep1() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showFullPreview, setShowFullPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    surname: "",
    email: "",
    dob: "",
    nationality: "",
    gender: "Male",

    // Position Details
    role: "",
    clientName: "",
    startDate: "",
    endDate: "",
    location: "",
    duration: "",

    // Compensation
    currency: "SAR",
    payRate: "",
    chargeRate: "",
    basicSalary: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate duration if dates are provided
      if (name === "startDate" || name === "endDate") {
        const startDate = name === "startDate" ? value : prev.startDate;
        const endDate = name === "endDate" ? value : prev.endDate;

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
          updated.duration = months > 0 ? months.toString() : "";
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName || !formData.surname || !formData.email) {
      alert("Please fill in all required fields (Name and Email)");
      return;
    }

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("You must be logged in to create a contractor");
        return;
      }

      // Call backend API to create contractor
      const response = await fetch("http://localhost:8000/api/v1/contractors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          surname: formData.surname,
          gender: formData.gender,
          nationality: formData.nationality,
          home_address: formData.homeAddress || "N/A",
          phone: formData.phone || "N/A",
          email: formData.email,
          dob: formData.dob || "1990-01-01",
          role: formData.role,
          client_name: formData.clientName,
          start_date: formData.startDate,
          end_date: formData.endDate,
          location: formData.location,
          duration: formData.duration,
          currency: formData.currency || "SAR",
          client_charge_rate: formData.clientChargeRate,
          candidate_pay_rate: formData.candidatePayRate,
          candidate_basic_salary: formData.candidateBasicSalary,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create contractor");
      }

      const contractor = await response.json();

      alert(`✅ Contractor created successfully!\n\n📧 Contract email sent to: ${formData.email}\n\nStatus: Pending Signature`);
      router.push("/dashboard/contractors");

    } catch (error: any) {
      console.error("Error creating contractor:", error);
      alert(`❌ Error: ${error.message}\n\nPlease make sure the backend server is running.`);
    }
  };

  // Format preview text
  const getFullName = () => formData.firstName && formData.surname
    ? `${formData.firstName} ${formData.surname}`
    : "[Contractor Name]";

  const formatDate = (dateString: string) => {
    if (!dateString) return "[Date]";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/contractors")}
          className="flex items-center gap-2 mb-4 text-gray-400 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Contractors
        </button>

        <div>
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Onboard Contractor - Step 1 of 2
          </h1>
          <p className="text-gray-400 mt-2">
            Enter basic contractor information. Complete CDS in Step 2.
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-bold">
              1
            </div>
            <span className={theme === "dark" ? "text-white font-medium" : "text-gray-900 font-medium"}>
              Basic Information
            </span>
          </div>
          <div className="flex-1 h-1 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold">
              2
            </div>
            <span className="text-gray-400">Complete CDS</span>
          </div>
        </div>
      </div>

      {/* Split View: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
              <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Surname *</label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
              <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Position Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Role/Position</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer"
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration (months)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      readOnly
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } opacity-60 cursor-not-allowed`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Riyadh, Saudi Arabia"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6 mb-6`}>
              <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Compensation
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    >
                      <option value="SAR">SAR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Pay Rate</label>
                    <input
                      type="number"
                      name="payRate"
                      value={formData.payRate}
                      onChange={handleChange}
                      placeholder="Monthly"
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Charge Rate</label>
                    <input
                      type="number"
                      name="chargeRate"
                      value={formData.chargeRate}
                      onChange={handleChange}
                      placeholder="Monthly"
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Basic Salary</label>
                    <input
                      type="number"
                      name="basicSalary"
                      value={formData.basicSalary}
                      onChange={handleChange}
                      placeholder="For EOSB"
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/contractors")}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all flex items-center gap-2"
              >
                <Save size={18} />
                Save & Continue to Step 2
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-[#FF6B00]" />
                <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Contract Letter Preview
                </h3>
              </div>
              <button
                onClick={() => setShowFullPreview(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-sm transition-all"
              >
                <Maximize2 size={16} />
                Full Preview
              </button>
            </div>

            {/* A4 Preview (scaled down) */}
            <div className="bg-white rounded-lg shadow-lg overflow-y-auto border border-gray-200" style={{ maxHeight: '600px' }}>
              <div className="w-full p-8 text-gray-900 text-xs">
                {/* Compact Header */}
                <div className="mb-3 pb-2 border-b-2 border-[#FF6B00]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/AV Logo.png"
                        alt="AVENTUS Logo"
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                      <div>
                        <h1 className="text-lg font-bold text-[#FF6B00] leading-tight">AVENTUS</h1>
                        <p className="text-[8px] text-gray-600">Global Workforce Solutions</p>
                      </div>
                    </div>
                    <div className="text-right text-[8px] text-gray-600">
                      <p className="font-semibold">Contract No: AV-{new Date().getFullYear()}-______</p>
                      <p>Date: {currentDate}</p>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-3">
                  <h2 className="text-sm font-bold uppercase">Professional Services Agreement</h2>
                </div>

                {/* Agreement Text */}
                <div className="mb-3 text-[9px] leading-relaxed">
                  <p>
                    THIS AGREEMENT made and entered into this <strong>{currentDate}</strong> by and between <strong>AVENTUS GLOBAL WORKFORCE SOLUTIONS</strong>,
                    Palm Jumeirah, Dubai, UAE (hereinafter called <strong>"COMPANY"</strong>), and <strong className="text-[#FF6B00]">{getFullName()}</strong>
                    (hereinafter called <strong>"CONTRACTOR"</strong>).
                  </p>
                </div>

                {/* Section 1 */}
                <div className="mb-2">
                  <h3 className="text-[10px] font-bold bg-gray-100 px-2 py-1 mb-2 border-l-4 border-[#FF6B00]">1. CONTRACTOR INFORMATION & DUTIES</h3>
                  <div className="grid grid-cols-4 gap-1 text-[8px] mb-2">
                    <div className="border border-gray-300 p-1.5">
                      <p className="text-[7px] uppercase text-gray-500">Full Name</p>
                      <p className="font-bold">{getFullName()}</p>
                    </div>
                    <div className="border border-gray-300 p-1.5">
                      <p className="text-[7px] uppercase text-gray-500">Email</p>
                      <p className="font-semibold break-all">{formData.email || "[Email]"}</p>
                    </div>
                    <div className="border border-gray-300 p-1.5">
                      <p className="text-[7px] uppercase text-gray-500">DOB</p>
                      <p className="font-semibold">{formData.dob ? formatDate(formData.dob) : "[DOB]"}</p>
                    </div>
                    <div className="border border-gray-300 p-1.5">
                      <p className="text-[7px] uppercase text-gray-500">Nationality</p>
                      <p className="font-semibold">{formData.nationality || "[Nationality]"}</p>
                    </div>
                  </div>
                  <div className="text-[9px] text-gray-700 leading-snug">
                    <p><strong>Position:</strong> {formData.role || "[Job Title]"} | <strong>Client:</strong> {formData.clientName || "[Client Name]"} | <strong>Location:</strong> {formData.location || "[Location]"}</p>
                    <p className="mt-1"><strong>Duties:</strong> CONTRACTOR agrees to provide professional services as specified in the role description and client requirements, exercising appropriate skill and diligence.</p>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="mb-2">
                  <h3 className="text-[10px] font-bold bg-gray-100 px-2 py-1 mb-2 border-l-4 border-[#FF6B00]">2. CONTRACT PERIOD</h3>
                  <div className="grid grid-cols-3 gap-1 text-[8px]">
                    <div className="border border-gray-300 p-1.5 bg-blue-50">
                      <p className="text-[7px] uppercase text-gray-500">Start Date</p>
                      <p className="font-bold text-blue-800">{formatDate(formData.startDate)}</p>
                    </div>
                    <div className="border border-gray-300 p-1.5 bg-blue-50">
                      <p className="text-[7px] uppercase text-gray-500">End Date</p>
                      <p className="font-bold text-blue-800">{formatDate(formData.endDate)}</p>
                    </div>
                    <div className="border border-gray-300 p-1.5 bg-blue-50">
                      <p className="text-[7px] uppercase text-gray-500">Duration</p>
                      <p className="font-bold text-blue-800">{formData.duration || "[X]"} Months</p>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="mb-2">
                  <h3 className="text-[10px] font-bold bg-gray-100 px-2 py-1 mb-2 border-l-4 border-[#FF6B00]">3. COMPENSATION</h3>
                  <div className="text-[9px] leading-snug mb-2 text-gray-700">
                    <p>In consideration for services rendered, COMPANY agrees to pay CONTRACTOR as follows:</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[8px]">
                    <div className="border-2 border-[#FF6B00] p-1.5 bg-orange-50">
                      <p className="text-[7px] uppercase text-gray-600">Monthly Pay Rate</p>
                      <p className="font-bold text-sm text-[#FF6B00]">{formData.currency} {formData.payRate || "[Amount]"}</p>
                    </div>
                    <div className="border border-gray-300 p-1.5">
                      <p className="text-[7px] uppercase text-gray-500">Basic Salary (EOSB)</p>
                      <p className="font-semibold">{formData.currency} {formData.basicSalary || "[Amount]"}</p>
                    </div>
                    <div className="border border-gray-300 p-1.5">
                      <p className="text-[7px] uppercase text-gray-500">Client Charge Rate</p>
                      <p className="font-semibold">{formData.currency} {formData.chargeRate || "[Amount]"}</p>
                    </div>
                  </div>
                  <p className="text-[8px] text-gray-600 mt-1">Payment will be processed monthly in arrears upon submission of approved timesheets and invoices.</p>
                </div>

                {/* Section 4 */}
                <div className="mb-2">
                  <h3 className="text-[10px] font-bold bg-gray-100 px-2 py-1 mb-2 border-l-4 border-[#FF6B00]">4. TERMS & CONDITIONS</h3>
                  <div className="text-[8px] leading-snug text-gray-700 space-y-1">
                    <p><strong>4.1 Compliance:</strong> CONTRACTOR shall comply with all UAE labor laws, client policies, and industry regulations.</p>
                    <p><strong>4.2 Confidentiality:</strong> CONTRACTOR agrees to maintain confidentiality of all proprietary information and execute required NDAs.</p>
                    <p><strong>4.3 Termination:</strong> Either party may terminate with 30 days written notice. COMPANY may terminate immediately for cause.</p>
                    <p><strong>4.4 Documentation:</strong> This agreement is subject to completion of Contractor Detail Sheet (CDS) and credential verification.</p>
                    <p><strong>4.5 Independent Contractor:</strong> CONTRACTOR is an independent contractor, not an employee of COMPANY.</p>
                  </div>
                </div>

                {/* Section 5: Signatures */}
                <div className="mt-3 pt-2 border-t-2 border-gray-300">
                  <p className="text-[9px] font-semibold mb-2 text-gray-800">Each party represents and warrants they are duly authorized to execute this Agreement:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold mb-2">COMPANY: AVENTUS</p>
                      <div className="border-t-2 border-gray-800 w-32 mt-6 mb-1"></div>
                      <p className="text-[8px] text-gray-700">Authorized Signatory</p>
                      <p className="text-[8px] text-gray-600 mt-0.5">Name: ___________________</p>
                      <p className="text-[8px] text-gray-600">Title: HR Director</p>
                      <p className="text-[8px] text-gray-600">Date: ___________________</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold mb-2">CONTRACTOR:</p>
                      <div className="border-t-2 border-gray-800 w-32 mt-6 mb-1"></div>
                      <p className="text-[8px] text-gray-700 font-semibold">{getFullName()}</p>
                      <p className="text-[8px] text-gray-600 mt-0.5">Signature</p>
                      <p className="text-[8px] text-gray-600">Email: {formData.email || "___________________"}</p>
                      <p className="text-[8px] text-gray-600">Date: ___________________</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-2 border-t border-gray-300 text-center">
                  <p className="text-[7px] text-gray-500">
                    AVENTUS Global Workforce Solutions • Palm Jumeirah, Dubai, UAE • info@aventus.com • +971 4 XXX XXXX<br />
                    This document is confidential and proprietary. Unauthorized distribution is prohibited.
                  </p>
                </div>
              </div>
            </div>

            <div className={`${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"} border ${theme === "dark" ? "border-blue-500/20" : "border-blue-200"} rounded-lg p-4 mt-4`}>
              <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-blue-800"}`}>
                <strong>Live Preview:</strong> This preview updates automatically as you fill in the form. Click "Full Preview" to see the full A4 size contract. All form data will appear in the contract once entered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FF6B00] p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Employment Contract Letter - Full Preview</h2>
              <button
                onClick={() => setShowFullPreview(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* A4 Contract Form */}
            <div className="p-8 bg-gray-100">
              <div className="bg-white shadow-2xl mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm' }}>

                {/* Compact Professional Header */}
                <div className="mb-4 pb-3 border-b-2 border-[#FF6B00]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/AV Logo.png"
                        alt="AVENTUS Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                      <div>
                        <h1 className="text-3xl font-bold text-[#FF6B00] leading-tight">AVENTUS</h1>
                        <p className="text-xs text-gray-600">Global Workforce Solutions</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                      <p className="font-semibold">Contract No: AV-{new Date().getFullYear()}-______</p>
                      <p>Date: {currentDate}</p>
                    </div>
                  </div>
                </div>

                {/* Contract Title */}
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 uppercase">Professional Services Agreement</h2>
                </div>

                {/* Agreement Text */}
                <div className="mb-4 text-xs leading-relaxed text-gray-800">
                  <p>
                    THIS AGREEMENT made and entered into this <strong>{currentDate}</strong> by and between <strong>AVENTUS GLOBAL WORKFORCE SOLUTIONS</strong>,
                    Palm Jumeirah, Dubai, UAE (hereinafter called <strong>"COMPANY"</strong>), and <strong className="text-[#FF6B00]">{getFullName()}</strong>
                    (hereinafter called <strong>"CONTRACTOR"</strong>).
                  </p>
                </div>

                {/* Section 1: Contractor Details & Position */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold bg-gray-100 px-3 py-1.5 mb-2 border-l-4 border-[#FF6B00] text-gray-900">1. CONTRACTOR INFORMATION & DUTIES</h3>
                  <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                    <div className="border border-gray-300 p-2">
                      <p className="text-gray-500 text-[10px] uppercase">Full Name</p>
                      <p className="font-bold text-gray-900">{getFullName()}</p>
                    </div>
                    <div className="border border-gray-300 p-2">
                      <p className="text-gray-500 text-[10px] uppercase">Email</p>
                      <p className="font-semibold text-gray-900">{formData.email || "[Email]"}</p>
                    </div>
                    <div className="border border-gray-300 p-2">
                      <p className="text-gray-500 text-[10px] uppercase">DOB</p>
                      <p className="font-semibold text-gray-900">{formData.dob ? formatDate(formData.dob) : "[DOB]"}</p>
                    </div>
                    <div className="border border-gray-300 p-2">
                      <p className="text-gray-500 text-[10px] uppercase">Nationality</p>
                      <p className="font-semibold text-gray-900">{formData.nationality || "[Nationality]"}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-800 leading-snug">
                    <p className="text-gray-900"><strong className="text-gray-900">Position:</strong> {formData.role || "[Job Title]"} | <strong className="text-gray-900">Client:</strong> {formData.clientName || "[Client Name]"} | <strong className="text-gray-900">Location:</strong> {formData.location || "[Location]"}</p>
                    <p className="mt-1 text-gray-900"><strong className="text-gray-900">Duties:</strong> CONTRACTOR agrees to provide professional services as specified in the role description and client requirements, exercising appropriate skill and diligence.</p>
                  </div>
                </div>

                {/* Section 2: Contract Period */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold bg-gray-100 px-3 py-1.5 mb-2 border-l-4 border-[#FF6B00] text-gray-900">2. CONTRACT PERIOD</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="border border-gray-300 p-2 bg-blue-50">
                      <p className="text-gray-500 text-[10px] uppercase">Start Date</p>
                      <p className="font-bold text-blue-800">{formatDate(formData.startDate)}</p>
                    </div>
                    <div className="border border-gray-300 p-2 bg-blue-50">
                      <p className="text-gray-500 text-[10px] uppercase">End Date</p>
                      <p className="font-bold text-blue-800">{formatDate(formData.endDate)}</p>
                    </div>
                    <div className="border border-gray-300 p-2 bg-blue-50">
                      <p className="text-gray-500 text-[10px] uppercase">Duration</p>
                      <p className="font-bold text-blue-800">{formData.duration || "[X]"} Months</p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Compensation */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold bg-gray-100 px-3 py-1.5 mb-2 border-l-4 border-[#FF6B00] text-gray-900">3. COMPENSATION</h3>
                  <div className="text-[11px] leading-snug mb-2 text-gray-800">
                    <p className="text-gray-900">In consideration for services rendered, COMPANY agrees to pay CONTRACTOR as follows:</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="border-2 border-[#FF6B00] p-2 bg-orange-50">
                      <p className="text-gray-600 text-[10px] uppercase">Monthly Pay Rate</p>
                      <p className="font-bold text-lg text-[#FF6B00]">{formData.currency} {formData.payRate || "[Amount]"}</p>
                    </div>
                    <div className="border border-gray-300 p-2">
                      <p className="text-gray-500 text-[10px] uppercase">Basic Salary (EOSB)</p>
                      <p className="font-semibold text-gray-900">{formData.currency} {formData.basicSalary || "[Amount]"}</p>
                    </div>
                    <div className="border border-gray-300 p-2">
                      <p className="text-gray-500 text-[10px] uppercase">Client Charge Rate</p>
                      <p className="font-semibold text-gray-900">{formData.currency} {formData.chargeRate || "[Amount]"}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-700 mt-1">Payment will be processed monthly in arrears upon submission of approved timesheets and invoices.</p>
                </div>

                {/* Section 4: Terms & Conditions */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold bg-gray-100 px-3 py-1.5 mb-2 border-l-4 border-[#FF6B00] text-gray-900">4. TERMS & CONDITIONS</h3>
                  <div className="text-[10px] leading-snug text-gray-800 space-y-1">
                    <p className="text-gray-900"><strong className="text-gray-900">4.1 Compliance:</strong> CONTRACTOR shall comply with all UAE labor laws, client policies, and industry regulations.</p>
                    <p className="text-gray-900"><strong className="text-gray-900">4.2 Confidentiality:</strong> CONTRACTOR agrees to maintain confidentiality of all proprietary information and execute required NDAs.</p>
                    <p className="text-gray-900"><strong className="text-gray-900">4.3 Termination:</strong> Either party may terminate with 30 days written notice. COMPANY may terminate immediately for cause.</p>
                    <p className="text-gray-900"><strong className="text-gray-900">4.4 Documentation:</strong> This agreement is subject to completion of Contractor Detail Sheet (CDS) and credential verification.</p>
                    <p className="text-gray-900"><strong className="text-gray-900">4.5 Independent Contractor:</strong> CONTRACTOR is an independent contractor, not an employee of COMPANY.</p>
                  </div>
                </div>

                {/* Section 5: Signatures */}
                <div className="mt-4 pt-3 border-t-2 border-gray-300">
                  <p className="text-[11px] font-semibold mb-3 text-gray-900">Each party represents and warrants they are duly authorized to execute this Agreement:</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold mb-2 text-gray-900">COMPANY: AVENTUS</p>
                      <div className="border-t-2 border-gray-800 w-48 mt-8 mb-1"></div>
                      <p className="text-[10px] text-gray-800">Authorized Signatory</p>
                      <p className="text-[10px] text-gray-700 mt-1">Name: ___________________</p>
                      <p className="text-[10px] text-gray-700">Title: HR Director</p>
                      <p className="text-[10px] text-gray-700">Date: ___________________</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-2 text-gray-900">CONTRACTOR:</p>
                      <div className="border-t-2 border-gray-800 w-48 mt-8 mb-1"></div>
                      <p className="text-[10px] text-gray-800 font-semibold">{getFullName()}</p>
                      <p className="text-[10px] text-gray-700 mt-1">Signature</p>
                      <p className="text-[10px] text-gray-700">Email: {formData.email || "___________________"}</p>
                      <p className="text-[10px] text-gray-700">Date: ___________________</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-2 border-t border-gray-300 text-center">
                  <p className="text-[9px] text-gray-600">
                    AVENTUS Global Workforce Solutions • Palm Jumeirah, Dubai, UAE • info@aventus.com • +971 4 XXX XXXX<br />
                    This document is confidential and proprietary. Unauthorized distribution is prohibited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
