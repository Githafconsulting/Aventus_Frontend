"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { API_ENDPOINTS } from "@/lib/config";
import {
  ArrowLeft,
  Building,
  User,
  CreditCard,
  Upload,
  X,
  CheckCircle,
  FileText,
  DollarSign,
  Plus,
  Briefcase,
} from "lucide-react";

interface DocumentToUpload {
  file: File;
  type: string;
}

interface Project {
  name: string;
  description: string;
  status: string;
}

interface ThirdParty {
  id: string;
  company_name: string;
  is_active: boolean;
}

export default function AddClientPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    company_reg_no: "",
    company_vat_no: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    address_line4: "",
    country: "",
    third_party_id: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    contact_person_title: "",
    bank_name: "",
    account_number: "",
    iban_number: "",
    swift_code: "",
    website: "",
    notes: "",
    is_active: true,
    // Payment Terms
    contractor_pay_frequency: "",
    client_invoice_frequency: "",
    client_payment_terms: "",
    invoicing_preferences: "",
    invoice_delivery_method: "",
    invoice_instructions: "",
    // Supporting Documents
    supporting_documents_required: [] as string[],
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [documentsToUpload, setDocumentsToUpload] = useState<DocumentToUpload[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch third parties on mount
  useEffect(() => {
    fetchThirdParties();
  }, []);

  const fetchThirdParties = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) return;

      const response = await fetch(
        `${API_ENDPOINTS.thirdParties}?include_inactive=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setThirdParties(data.filter((tp: ThirdParty) => tp.is_active));
      }
    } catch (err) {
      console.error("Error fetching third parties:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && documentType) {
      const newDocs: DocumentToUpload[] = [];
      for (let i = 0; i < files.length; i++) {
        newDocs.push({ file: files[i], type: documentType });
      }
      setDocumentsToUpload((prev) => [...prev, ...newDocs]);
      setDocumentType("");
      e.target.value = "";
    }
  };

  const removeDocument = (index: number) => {
    setDocumentsToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        status: "Planning",
      },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setProjects((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("aventus-auth-token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      // Filter out empty strings and prepare data
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        // Keep booleans, non-empty strings, and non-empty arrays
        if (typeof value === 'boolean') {
          acc[key] = value;
        } else if (typeof value === 'string' && value !== '') {
          acc[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      // Add projects if any
      if (projects.length > 0) {
        cleanedData.projects = projects;
      }

      console.log('[Add Client] URL:', API_ENDPOINTS.clients);
      console.log('[Add Client] Data:', cleanedData);

      // Create client
      const response = await fetch(API_ENDPOINTS.clients, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      console.log('[Add Client] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create client");
      }

      const createdClient = await response.json();
      console.log('[Add Client] Created client:', createdClient);

      // Upload documents if any
      if (documentsToUpload.length > 0) {
        for (const doc of documentsToUpload) {
          const formData = new FormData();
          formData.append("file", doc.file);
          formData.append("document_type", doc.type);

          await fetch(API_ENDPOINTS.clientUploadDocument(createdClient.id), {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        }
      }

      alert("Client created successfully!");
      router.push("/dashboard/clients");
    } catch (err: any) {
      console.error("[Add Client] Error creating client:", err);
      console.error("[Add Client] Error type:", typeof err);
      console.error("[Add Client] Error name:", err.name);
      setError(err.message || "Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-800 rounded-lg transition-all"
        >
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Add Client Company
          </h1>
          <p className="text-gray-400 mt-2">Create a new client company profile</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } card-parallelogram p-6 shadow-sm mb-6`}
        >
          {/* Company Information */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
            >
              <Building size={20} className="text-white" />
              <span>Company Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., Technology, Finance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Registration No.
              </label>
              <input
                type="text"
                name="company_reg_no"
                value={formData.company_reg_no}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                VAT Number
              </label>
              <input
                type="text"
                name="company_vat_no"
                value={formData.company_vat_no}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="VAT number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Building, floor, unit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 3
              </label>
              <input
                type="text"
                name="address_line3"
                value={formData.address_line3}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="City, state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address Line 4
              </label>
              <input
                type="text"
                name="address_line4"
                value={formData.address_line4}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Postal code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select country</option>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Brazil">Brazil</option>
                <option value="Brunei">Brunei</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Greece">Greece</option>
                <option value="Grenada">Grenada</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-Bissau">Guinea-Bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Honduras">Honduras</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Laos">Laos</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia">Micronesia</option>
                <option value="Moldova">Moldova</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="North Korea">North Korea</option>
                <option value="North Macedonia">North Macedonia</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestine">Palestine</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Qatar">Qatar</option>
                <option value="Romania">Romania</option>
                <option value="Russia">Russia</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Korea">South Korea</option>
                <option value="South Sudan">South Sudan</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syria</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-Leste">Timor-Leste</option>
                <option value="Togo">Togo</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Vatican City">Vatican City</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                3rd Party Company
              </label>
              <select
                name="third_party_id"
                value={formData.third_party_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select 3rd Party</option>
                {thirdParties.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Person */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
            >
              <User size={20} className="text-white" />
              <span>Contact Person</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="contact_person_name"
                value={formData.contact_person_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="contact_person_title"
                value={formData.contact_person_title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., HR Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="contact_person_email"
                value={formData.contact_person_email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="contact_person_phone"
                value={formData.contact_person_phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="+971 XX XXX XXXX"
              />
            </div>
          </div>

          {/* Projects */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3"
                >
                  <Briefcase size={20} className="text-white" />
                  <span>Projects</span>
                </div>
                <div className="flex-1 h-[2px] bg-[#FF6B00]"></div>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF8533] text-white btn-parallelogram transition-all text-sm font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className={`text-center py-8 border-2 border-dashed rounded-lg ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}>
                <Briefcase className="mx-auto text-gray-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm">No projects added yet. Click "Add Project" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-800/50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-[#FF6B00]">
                        Project #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="p-1 hover:bg-red-500/20 rounded transition-all"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Project Name *
                          </label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(index, "name", e.target.value)}
                            className={`w-full px-4 py-2 input-parallelogram border transition-all outline-none ${
                              theme === "dark"
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                            placeholder="Enter project name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Status
                          </label>
                          <select
                            value={project.status}
                            onChange={(e) => updateProject(index, "status", e.target.value)}
                            className={`w-full px-4 py-2 input-parallelogram border transition-all outline-none ${
                              theme === "dark"
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                          >
                            <option value="Planning">Planning</option>
                            <option value="Active">Active</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Description
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          rows={2}
                          className={`w-full px-4 py-2 rounded-lg border transition-all outline-none ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                          placeholder="Brief description of the project..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Banking Details */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
            >
              <CreditCard size={20} className="text-white" />
              <span>Banking Details</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Bank name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Account number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                IBAN Number
              </label>
              <input
                type="text"
                name="iban_number"
                value={formData.iban_number}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="IBAN number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                SWIFT Code
              </label>
              <input
                type="text"
                name="swift_code"
                value={formData.swift_code}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="SWIFT code"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
            >
              <Upload size={20} className="text-white" />
              <span>Documents</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Document Type
              </label>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="e.g., Contract, Agreement, License"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                disabled={!documentType}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Documents to Upload */}
          {documentsToUpload.length > 0 && (
            <div className="mb-6 p-4 border-2 border-[#FF6B00] rounded-lg bg-[#FF6B00]/5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-[#FF6B00]" size={20} />
                <span className="text-sm font-semibold text-gray-400">
                  {documentsToUpload.length} document{documentsToUpload.length !== 1 ? "s" : ""} ready to upload
                </span>
              </div>
              <div className="space-y-2">
                {documentsToUpload.map((doc, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-[#FF6B00]" />
                      <div>
                        <p className="text-sm font-medium text-gray-300">
                          {doc.file.name}
                        </p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Terms */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
            >
              <DollarSign size={20} className="text-white" />
              <span>Payment Terms</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Contractor Pay Frequency
              </label>
              <select
                name="contractor_pay_frequency"
                value={formData.contractor_pay_frequency}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select frequency</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Semi-monthly">Semi-monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Client Invoice Frequency
              </label>
              <select
                name="client_invoice_frequency"
                value={formData.client_invoice_frequency}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select frequency</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Semi-monthly">Semi-monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Client Payment Terms
              </label>
              <select
                name="client_payment_terms"
                value={formData.client_payment_terms}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select payment terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Invoicing Preferences
              </label>
              <select
                name="invoicing_preferences"
                value={formData.invoicing_preferences}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select preference</option>
                <option value="Consolidated">Consolidated</option>
                <option value="Per Worker">Per Worker</option>
                <option value="Consolidated per Project">Consolidated per Project</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Invoice Delivery Method
              </label>
              <select
                name="invoice_delivery_method"
                value={formData.invoice_delivery_method}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              >
                <option value="">Select method</option>
                <option value="Upload">Upload</option>
                <option value="Email">Email</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Invoice Instructions
              </label>
              <textarea
                name="invoice_instructions"
                value={formData.invoice_instructions}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 input-parallelogram border transition-all outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
                placeholder="Special instructions for invoicing..."
              />
            </div>
          </div>

          {/* Supporting Documents Required */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
            >
              <FileText size={20} className="text-white" />
              <span>Supporting Documents Required</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {/* Invoice */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Invoice
              </label>
              <button
                type="button"
                onClick={() => {
                  const docs = [...formData.supporting_documents_required];
                  const index = docs.indexOf("Invoice");
                  if (index > -1) {
                    docs.splice(index, 1);
                  } else {
                    docs.push("Invoice");
                  }
                  setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                }}
                className={`relative w-20 h-8 rounded-full transition-all duration-300 ${
                  formData.supporting_documents_required.includes("Invoice")
                    ? theme === "dark"
                      ? "bg-[#FF6B00]"
                      : "bg-[#FF6B00]"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-14 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                  formData.supporting_documents_required.includes("Invoice")
                    ? "right-0.5 text-[#FF6B00]"
                    : theme === "dark"
                    ? "left-0.5 text-gray-700"
                    : "left-0.5 text-gray-500"
                }`}>
                  {formData.supporting_documents_required.includes("Invoice") ? "YES" : "NO"}
                </div>
              </button>
            </div>

            {/* Timesheet */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Timesheet
              </label>
              <button
                type="button"
                onClick={() => {
                  const docs = [...formData.supporting_documents_required];
                  const index = docs.indexOf("Timesheet");
                  if (index > -1) {
                    docs.splice(index, 1);
                  } else {
                    docs.push("Timesheet");
                  }
                  setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                }}
                className={`relative w-20 h-8 rounded-full transition-all duration-300 ${
                  formData.supporting_documents_required.includes("Timesheet")
                    ? theme === "dark"
                      ? "bg-[#FF6B00]"
                      : "bg-[#FF6B00]"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-14 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                  formData.supporting_documents_required.includes("Timesheet")
                    ? "right-0.5 text-[#FF6B00]"
                    : theme === "dark"
                    ? "left-0.5 text-gray-700"
                    : "left-0.5 text-gray-500"
                }`}>
                  {formData.supporting_documents_required.includes("Timesheet") ? "YES" : "NO"}
                </div>
              </button>
            </div>

            {/* Work Order */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Work Order
              </label>
              <button
                type="button"
                onClick={() => {
                  const docs = [...formData.supporting_documents_required];
                  const index = docs.indexOf("Work Order");
                  if (index > -1) {
                    docs.splice(index, 1);
                  } else {
                    docs.push("Work Order");
                  }
                  setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                }}
                className={`relative w-20 h-8 rounded-full transition-all duration-300 ${
                  formData.supporting_documents_required.includes("Work Order")
                    ? theme === "dark"
                      ? "bg-[#FF6B00]"
                      : "bg-[#FF6B00]"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-14 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                  formData.supporting_documents_required.includes("Work Order")
                    ? "right-0.5 text-[#FF6B00]"
                    : theme === "dark"
                    ? "left-0.5 text-gray-700"
                    : "left-0.5 text-gray-500"
                }`}>
                  {formData.supporting_documents_required.includes("Work Order") ? "YES" : "NO"}
                </div>
              </button>
            </div>

            {/* Contract */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Contract
              </label>
              <button
                type="button"
                onClick={() => {
                  const docs = [...formData.supporting_documents_required];
                  const index = docs.indexOf("Contract");
                  if (index > -1) {
                    docs.splice(index, 1);
                  } else {
                    docs.push("Contract");
                  }
                  setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                }}
                className={`relative w-20 h-8 rounded-full transition-all duration-300 ${
                  formData.supporting_documents_required.includes("Contract")
                    ? theme === "dark"
                      ? "bg-[#FF6B00]"
                      : "bg-[#FF6B00]"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-14 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                  formData.supporting_documents_required.includes("Contract")
                    ? "right-0.5 text-[#FF6B00]"
                    : theme === "dark"
                    ? "left-0.5 text-gray-700"
                    : "left-0.5 text-gray-500"
                }`}>
                  {formData.supporting_documents_required.includes("Contract") ? "YES" : "NO"}
                </div>
              </button>
            </div>

            {/* Proposal */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Proposal
              </label>
              <button
                type="button"
                onClick={() => {
                  const docs = [...formData.supporting_documents_required];
                  const index = docs.indexOf("Proposal");
                  if (index > -1) {
                    docs.splice(index, 1);
                  } else {
                    docs.push("Proposal");
                  }
                  setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                }}
                className={`relative w-20 h-8 rounded-full transition-all duration-300 ${
                  formData.supporting_documents_required.includes("Proposal")
                    ? theme === "dark"
                      ? "bg-[#FF6B00]"
                      : "bg-[#FF6B00]"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-14 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                  formData.supporting_documents_required.includes("Proposal")
                    ? "right-0.5 text-[#FF6B00]"
                    : theme === "dark"
                    ? "left-0.5 text-gray-700"
                    : "left-0.5 text-gray-500"
                }`}>
                  {formData.supporting_documents_required.includes("Proposal") ? "YES" : "NO"}
                </div>
              </button>
            </div>

            {/* Other */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Other
              </label>
              <button
                type="button"
                onClick={() => {
                  const docs = [...formData.supporting_documents_required];
                  const index = docs.indexOf("Other");
                  if (index > -1) {
                    docs.splice(index, 1);
                  } else {
                    docs.push("Other");
                  }
                  setFormData(prev => ({ ...prev, supporting_documents_required: docs }));
                }}
                className={`relative w-20 h-8 rounded-full transition-all duration-300 ${
                  formData.supporting_documents_required.includes("Other")
                    ? theme === "dark"
                      ? "bg-[#FF6B00]"
                      : "bg-[#FF6B00]"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-14 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                  formData.supporting_documents_required.includes("Other")
                    ? "right-0.5 text-[#FF6B00]"
                    : theme === "dark"
                    ? "left-0.5 text-gray-700"
                    : "left-0.5 text-gray-500"
                }`}>
                  {formData.supporting_documents_required.includes("Other") ? "YES" : "NO"}
                </div>
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <div
              className="relative px-6 py-2 bg-[#FF6B00] text-white font-semibold text-lg flex items-center gap-3 w-fit"
            >
              <FileText size={20} className="text-white" />
              <span>Additional Information</span>
            </div>
            <div className="w-full h-[2px] bg-[#FF6B00] ml-[12px]"></div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
              placeholder="Any additional notes about this client..."
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 btn-parallelogram bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 btn-parallelogram bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Client"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
