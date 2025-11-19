"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function DocumentUploadPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [contractor, setContractor] = useState<any>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    surname: "",
    email: "",
    gender: "",
    dob: "",
    nationality: "",
    country: "",
    current_location: "",
    marital_status: "",
    number_of_children: "",
    phone: "",
    home_address: "",
    address_line2: "",
    address_line3: "",
    address_line4: "",
    candidate_bank_details: "",
    candidate_iban: "",
  });

  const [documents, setDocuments] = useState<{
    passport_document: File | null;
    photo_document: File | null;
    visa_page_document: File | null;
    id_front_document: File | null;
    id_back_document: File | null;
    degree_document: File | null;
    emirates_id_document: File | null;
  }>({
    passport_document: null,
    photo_document: null,
    visa_page_document: null,
    id_front_document: null,
    id_back_document: null,
    degree_document: null,
    emirates_id_document: null,
  });

  useEffect(() => {
    fetchContractor();
  }, [token]);

  const fetchContractor = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.contractorByDocumentToken(token)
      );

      if (!response.ok) {
        throw new Error("Invalid or expired document upload link");
      }

      const data = await response.json();
      setContractor(data);

      // Pre-fill form data if available
      setFormData({
        first_name: data.first_name || "",
        surname: data.surname || "",
        email: data.email || "",
        gender: data.gender || "",
        dob: data.dob || "",
        nationality: data.nationality || "",
        country: data.country || "",
        current_location: data.current_location || "",
        marital_status: data.marital_status || "",
        number_of_children: data.number_of_children || "",
        phone: data.phone || "",
        home_address: data.home_address || "",
        address_line2: data.address_line2 || "",
        address_line3: data.address_line3 || "",
        address_line4: data.address_line4 || "",
        candidate_bank_details: data.candidate_bank_details || "",
        candidate_iban: data.candidate_iban || "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file directly
    setDocuments((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      // Create FormData to send both form fields and files
      const submitData = new FormData();

      // Append personal information fields
      submitData.append("first_name", formData.first_name);
      submitData.append("surname", formData.surname);
      submitData.append("email", formData.email);
      submitData.append("gender", formData.gender);
      submitData.append("dob", formData.dob);
      submitData.append("nationality", formData.nationality);
      submitData.append("phone", formData.phone);
      submitData.append("home_address", formData.home_address);

      // Append optional fields
      if (formData.country) submitData.append("country", formData.country);
      if (formData.current_location) submitData.append("current_location", formData.current_location);
      if (formData.marital_status) submitData.append("marital_status", formData.marital_status);
      if (formData.number_of_children) submitData.append("number_of_children", formData.number_of_children);
      if (formData.address_line2) submitData.append("address_line2", formData.address_line2);
      if (formData.address_line3) submitData.append("address_line3", formData.address_line3);
      if (formData.address_line4) submitData.append("address_line4", formData.address_line4);
      if (formData.candidate_bank_details) submitData.append("candidate_bank_details", formData.candidate_bank_details);
      if (formData.candidate_iban) submitData.append("candidate_iban", formData.candidate_iban);

      // Append all required files
      if (documents.passport_document) {
        submitData.append("passport_document", documents.passport_document);
      }
      if (documents.photo_document) {
        submitData.append("photo_document", documents.photo_document);
      }
      if (documents.visa_page_document) {
        submitData.append("visa_page_document", documents.visa_page_document);
      }
      if (documents.id_front_document) {
        submitData.append("id_front_document", documents.id_front_document);
      }
      if (documents.id_back_document) {
        submitData.append("id_back_document", documents.id_back_document);
      }
      if (documents.degree_document) {
        submitData.append("degree_document", documents.degree_document);
      }
      // Emirates ID is optional
      if (documents.emirates_id_document) {
        submitData.append("emirates_id_document", documents.emirates_id_document);
      }

      const response = await fetch(
        API_ENDPOINTS.uploadDocuments(token),
        {
          method: "POST",
          body: submitData, // Send FormData (no Content-Type header needed, browser sets it automatically)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload documents");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <img
              src="/av-logo.png"
              alt="Aventus Logo"
              className="h-20 w-auto object-contain mx-auto mb-4"
            />
          </div>
          <Loader2 className="w-12 h-12 text-[#FF6B00] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !contractor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <img
              src="/av-logo.png"
              alt="Aventus Logo"
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
          </div>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Link
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <img
              src="/av-logo.png"
              alt="Aventus Logo"
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
          </div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Information Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you, {contractor?.first_name}! Your information and documents have been
            received. Our team will review them and get back to you soon.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What's Next?
            </h3>
            <p className="text-sm text-blue-700">
              You'll receive an email once your application has been reviewed.
              This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/av-logo.png"
              alt="Aventus Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-gray-600 text-lg font-medium">Contractor Onboarding</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {contractor?.first_name} {contractor?.surname}!
          </h2>
          <p className="text-gray-600">
            Please complete your personal information and upload the required
            documents to continue your onboarding process.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Personal Information
            </h3>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Gender, DOB, Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  >
                    <option value="">Select Nationality</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country and Current Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Location
                  </label>
                  <input
                    type="text"
                    name="current_location"
                    value={formData.current_location}
                    onChange={handleInputChange}
                    placeholder="City or region"
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Marital Status and Number of Children */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    name="number_of_children"
                    value={formData.number_of_children}
                    onChange={handleInputChange}
                    min="0"
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="home_address"
                    value={formData.home_address}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 3
                    </label>
                    <input
                      type="text"
                      name="address_line3"
                      value={formData.address_line3}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 4
                    </label>
                    <input
                      type="text"
                      name="address_line4"
                      value={formData.address_line4}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Account Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="candidate_bank_details"
                    value={formData.candidate_bank_details}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IBAN
                  </label>
                  <input
                    type="text"
                    name="candidate_iban"
                    value={formData.candidate_iban}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Required Documents
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              All documents should be clear, readable, and in PDF, JPG, or PNG format.
            </p>

          <div className="space-y-6">
              {/* Passport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "passport_document")}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
                {documents.passport_document && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> {documents.passport_document.name}
                  </p>
                )}
              </div>

              {/* ID Front */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Front <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "id_front_document")}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
                {documents.id_front_document && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> {documents.id_front_document.name}
                  </p>
                )}
              </div>

              {/* ID Back */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Back <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "id_back_document")}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
                {documents.id_back_document && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> {documents.id_back_document.name}
                  </p>
                )}
              </div>

              {/* Visa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visa <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "visa_page_document")}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
                {documents.visa_page_document && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> {documents.visa_page_document.name}
                  </p>
                )}
              </div>

              {/* Passport Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Photo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "photo_document")}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
                {documents.photo_document && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> {documents.photo_document.name}
                  </p>
                )}
              </div>

              {/* Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "degree_document")}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
                {documents.degree_document && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> {documents.degree_document.name}
                  </p>
                )}
              </div>

              {/* Emirates ID (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emirates ID <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "emirates_id_document")}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#FF6B00] file:text-white
                    hover:file:bg-[#FF6B00]/90
                    file:cursor-pointer cursor-pointer"
                />
                {documents.emirates_id_document && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> {documents.emirates_id_document.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">
              Important Notes
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Ensure all documents are clear and readable</li>
              <li>Maximum file size: 10MB per document</li>
              <li>Accepted formats: PDF, JPG, PNG</li>
              <li>Make sure all information is visible and not cut off</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Submit Information & Documents
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Aventus HR. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
