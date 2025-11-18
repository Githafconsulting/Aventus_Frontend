"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Send, FileText, Loader2 } from "lucide-react";

export default function GenerateContractPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const contractorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contractor, setContractor] = useState<any>(null);
  const [contractContent, setContractContent] = useState("");
  const [contractId, setContractId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editType, setEditType] = useState<"fields" | "fulltext">("fields");
  const [editableData, setEditableData] = useState({
    contractorName: "",
    clientName: "",
    clientAddress: "",
    jobTitle: "",
    location: "",
    duration: "",
    startDate: "",
    dayRate: "",
    currency: "USD"
  });
  const [fullContractText, setFullContractText] = useState("");
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    fetchContractorAndGenerateContract();
  }, [contractorId]);

  // Auto-update preview when edit fields change (debounced)
  useEffect(() => {
    if (!editMode) return;

    const timer = setTimeout(() => {
      handleAutoUpdatePreview();
    }, 1500); // Update 1.5 seconds after user stops typing

    return () => clearTimeout(timer);
  }, [editableData, fullContractText, editMode]);

  const fetchContractorAndGenerateContract = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aventus-auth-token");

      if (!token) {
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/contractors/${contractorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("aventus-auth-token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error("Failed to fetch contractor");
      }

      const data = await response.json();
      setContractor(data);

      // Initialize editable data
      const cdsData = data.cds_form_data || {};
      setEditableData({
        contractorName: `${data.first_name} ${data.surname}`,
        clientName: cdsData.clientName || data.client_name || "",
        clientAddress: cdsData.clientAddress || "",
        jobTitle: cdsData.role || data.role || "",
        location: cdsData.location || data.location || "",
        duration: data.duration || cdsData.duration || "6 months",
        startDate: data.start_date || cdsData.startDate || "",
        dayRate: data.candidate_pay_rate || cdsData.dayRate || "",
        currency: data.currency || "USD"
      });

      // Generate contract content with auto-filled data
      const generated = generateContractContent(data);
      setContractContent(generated);
      setFullContractText(generated);
    } catch (error) {
      console.error("Error fetching contractor:", error);
      alert("Failed to load contractor data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateContractContent = (data: any) => {
    const cdsData = data.cds_form_data || {};
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const contractorName = `${data.first_name} ${data.surname}`;
    const clientName = cdsData.clientName || data.client_name || "[Client Name]";
    const clientAddress = cdsData.clientAddress || "[Client Address]";
    const jobTitle = cdsData.role || data.role || "[Job Title]";
    const location = cdsData.location || data.location || "[Location]";
    const duration = data.duration || cdsData.duration || "6 months";
    const startDate = data.start_date || cdsData.startDate || "[Start Date]";
    const dayRate = data.candidate_pay_rate || cdsData.dayRate || "[Day Rate]";
    const currency = data.currency || "USD";

    return `This Consultant Contract is made ${today}

BETWEEN:

(1)    Aventus Talent Consultant Office 14, Golden Mile 4, Palm Jumeirah, Dubai, United Arab Emirates (the "Principal"); and

(2)    ${contractorName} (the "Consultant")

(3)    ${clientName}, with its principal place of business at ${clientAddress} ("client").


1.    JOB TITLE

1.1    The Consultant is engaged as ${jobTitle} for the Principal. The place of work is ${location}. The consultant will be contracted for a duration of ${duration} initially after which there may be extensions.

2.    DUTIES

2.1    The Consultant shall during the term of this Contract serve the client to the best of their ability in the position stated above.

3.    REPORTING CHANNEL

3.1    The Consultant shall report directly to selected members of The Client.

4.    JOINING DATE

4.1    The engagement of the Consultant will commence on ${startDate} (the "Commencement Date") for a duration of ${duration}. There will be a possibility for the contract to extend and this can be determined prior to the end date.

5.    PROBATIONARY PERIOD

5.1    The Consultant shall be on probation for the first six (6) months from the joining date. During the probation period engagement may be terminated by providing 30 days written notice period. The consultant will not be entitled to receive any benefits or compensation whatsoever.

6.    REMUNERATION

6.1    The Consultant shall be paid the following on a monthly basis in arrears and the Consultant shall keep payments confidential and shall not disclose to anyone within or outside the Principal.

Contract Rate:        ${dayRate} ${currency} per Day

Part month calculation.
Payment will be only for the days worked.
Laptop will be provided by the consultant.

6.2    The Consultant acknowledges and agrees that the Principal shall pay monthly salaries based on a client approved timesheet. The principal is entitled at any time to make deductions from the Consultant's Remuneration or from any other sums due to the Consultant from the Principal in respect of any overpayment of any kind made to the Consultant or any outstanding debt or other sums due from the Consultant or unapproved time off requests.

6.3    The consultant acknowledges that they are based remotely from principal's place of business and as such, the payments of remuneration and allowances is inclusive of all individual taxation requirements and the consultant is responsible for settling any and all taxes in their home country or country of residence due to be paid arising out of this agreement.

7.    WORKING HOURS AND PLACE OF WORK

7.1    The Consultant's hours of work will be in synchronisation with client's working hours. This is usually Sunday through Thursday.

7.2    The Consultant may be required to work additional hours as may be necessary for the proper performance of duties, which will be payable based on the approved timesheet.

8.    SICKNESS ABSENCE

8.1    Reasonable sickness absence is expected throughout the year, however as the consultant works on a remote base and day rate there is not defined sick leave. Should the consultant deem himself unable to perform their role any given day due to illness, they should inform the client and the Principal immediately.

9.    DURATION & TERMINATION

9.1    After confirmation of the Engagement and completion of the Probation Period, either Party may terminate this Contract by providing 30 days written notice of intention to terminate the Engagement.

9.2    The Principal reserves the right to pay the Consultant in lieu of part or all of the notice period or require that during the notice period they do not attend the Principal's/Client's premises or/and carry out day to day duties (and remain at home on "Garden Leave"). During any Garden Leave period, the Consultant shall be entitled to Remuneration and benefits in the usual manner.

10.    POST TERMINATION RESTRICTIONS

10.1    Unless approved by the principal, The Consultant shall not during the Engagement or for a period of six (6) months after its termination in the country of the residence:
• seek to procure orders from, or deal with in any way, any client(s) or supplier(s) of the Principal with whom the Consultant has had regular dealings during the Engagement;
• engage the services of, provide services to or become interested in any business activity that is in competition with the Principal's business.
• Provide the same or similar services to those provided under this agreement whether directly or indirectly to the client or any customer of the client for whose benefit the services are to be performed.

11.    CONFIDENTIALITY

11.1    The Consultant shall not at any time (either during or after the termination of the Engagement) disclose or communicate to any person or use any person any confidential information concerning the business dealings, affairs or conduct of the Principal, or the client and their staff or business partners or any similar matters which may come to the Consultant's knowledge or possession during the term of the Consultant's Engagement.

11.2    The Consultant hereby irrevocably agrees that during the course of the Engagement, and for an indefinite period thereafter, they shall not, other than in the course of fulfilling their obligations as an Consultant or as required by law, disclose or divulge any information that might be of a confidential or proprietary nature regarding the Principal or the client, (including, in particular, but without limitation, information relating to the business of the Principal or The Client or any of its clients or their affairs and which includes but is not limited to information relating to the Principal's clients and customers, prospective clients and customers, suppliers, agents or distributors of the Principal, commercial, financial or marketing information, customer lists, technical information and know-how comprising trade secrets and intellectual property belonging to the Principal or The Client, and information regarding the business and financial affairs of the Principal), to any person (natural or legal). Further, the Consultant shall not use any confidential or proprietary information obtained during the course of Engagement at any time (whether during the term of Engagement or subsequently) to compete with or otherwise act to the detriment of the Principal or The Client.

11.3    Any documents in hard copy or in other electronic form and any equipment, that the Consultant may receive or use while performing duties during the tenure of Engagement shall remain the property of the Principal or The Client and shall be returned to the Principal at the Principal's request and, in any event, shall be delivered to the Principal on the termination of the Engagement. The Consultant shall not make copies of any such materials for personal use or advantage, whether they be hard or electronic copy.

12    GENERAL PROVISIONS

12.1    This Contract contains the full agreement between the Principal and the Consultant regarding the provisions and conditions of the Engagement relationship. It replaces all previous agreements.

12.2    On termination of the Consultant's Engagement for whatever reason, consultant will immediately return all correspondence, documents, computer discs and software, equipment and any other property of any kind belonging to the Principal and which may be in the Consultant's possession or control. For the avoidance of doubt, the Consultant shall not be permitted to retain any such information or documents (or copies thereof) after the termination of Engagement for any reason.

12.3    Any amendment to this Agreement must be made in writing and signed by both the Parties in order to be legally valid. Each Party declares having received a copy of this Contract duly signed by both Parties.

12.4    This Agreement may be executed by electronic signature transmission by the parties hereto in to separate counterparts, each of which when executed shall be deemed to be an original but all of which taken together shall constitute the one and same agreement.

12.4    In this Agreement words denoting the singular shall include the plural and vice versa. Headings in this Agreement are for convenience only and shall not affect its interpretation; and any reference to any legislative provision is a reference to that provision as for the time being in any way amended or re-enacted. All references to times or dates herein shall be construed with reference to the Gregorian calendar.

12.5    Notices may be given by either party by letter addressed to the other party at the addresses stated above or in the case of the Consultant, the last known address, which shall be deemed to be the address last notified by the Consultant to the Principal and any notice given by letter shall be deemed to have been given at the time at which the letter would have been delivered in the ordinary course of post or acknowledged as received by international courier. Where a notice is delivered by electronic means and the party sending the notice can demonstrate via electronic record the sending of the notice, the other party is deemed to have received the notice at the same time.

13    DISPUTE RESOLUTION

13.1    Each party irrevocably agrees that the courts of the United Arab Emirates shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with this Agreement or its subject matter or formation (including non-contractual disputes or claims).

14    GOVERNING LAW

14.1    This contract shall be governed and be construed in accordance with the Laws of UAE

IN WITNESS WHEREOF the Parties have caused this Contract to be executed as of the date written above.


Signed for and on behalf of the Principal.




_____________________
PRINCIPAL
NAME
POSITION


I, ${contractorName} the undersigned confirm my acceptance of the above terms and conditions.



__________________________
CONSULTANT`;
  };

  const handleAutoUpdatePreview = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");

      // Silently update contractor data in the background
      await fetch(`http://localhost:8000/api/v1/contractors/${contractorId}/update-contract-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: editableData.contractorName.split(" ")[0],
          surname: editableData.contractorName.split(" ").slice(1).join(" "),
          client_name: editableData.clientName,
          role: editableData.jobTitle,
          location: editableData.location,
          duration: editableData.duration,
          start_date: editableData.startDate,
          candidate_pay_rate: editableData.dayRate,
          currency: editableData.currency,
          cds_form_data: {
            ...contractor?.cds_form_data,
            clientName: editableData.clientName,
            clientAddress: editableData.clientAddress,
            role: editableData.jobTitle,
            location: editableData.location,
            duration: editableData.duration,
            startDate: editableData.startDate,
            dayRate: editableData.dayRate,
          }
        }),
      });

      // Refresh the preview iframe
      setPreviewKey(prev => prev + 1);
    } catch (error) {
      console.error("Error auto-updating preview:", error);
    }
  };

  const handleUpdateContract = async () => {
    try {
      const token = localStorage.getItem("aventus-auth-token");

      // Update contractor CDS data with edited values
      const response = await fetch(`http://localhost:8000/api/v1/contractors/${contractorId}/update-contract-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: editableData.contractorName.split(" ")[0],
          surname: editableData.contractorName.split(" ").slice(1).join(" "),
          client_name: editableData.clientName,
          role: editableData.jobTitle,
          location: editableData.location,
          duration: editableData.duration,
          start_date: editableData.startDate,
          candidate_pay_rate: editableData.dayRate,
          currency: editableData.currency,
          cds_form_data: {
            ...contractor?.cds_form_data,
            clientName: editableData.clientName,
            clientAddress: editableData.clientAddress,
            role: editableData.jobTitle,
            location: editableData.location,
            duration: editableData.duration,
            startDate: editableData.startDate,
            dayRate: editableData.dayRate,
          }
        }),
      });

      if (response.ok) {
        setEditMode(false);
        // Force iframe reload to show updated PDF
        setPreviewKey(prev => prev + 1);
        alert("Contract updated successfully!");
      } else {
        throw new Error("Failed to update contract data");
      }
    } catch (error) {
      console.error("Error updating contract:", error);
      alert("Failed to update contract. Please try again.");
    }
  };

  const handleSendContract = async () => {
    if (!contractor) {
      alert("Contract is not ready. Please wait or refresh the page.");
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("aventus-auth-token");

      // Send contract using the simpler contractors endpoint
      const response = await fetch(`http://localhost:8000/api/v1/contractors/${contractorId}/send-contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send contract");
      }

      const result = await response.json();
      alert("Contract sent successfully! The contractor will receive an email with a link to review and sign.");
      router.push("/dashboard/contractors");
    } catch (error: any) {
      console.error("Error sending contract:", error);
      alert(error.message || "Failed to send contract. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col p-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-all"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <h1 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {contractor?.first_name} {contractor?.surname} - Contract Preview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditMode(!editMode);
                if (!editMode) setEditType("fields");
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all text-sm ${
                editMode
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <FileText size={16} />
              <span>{editMode ? "Close Editor" : "Edit Contract"}</span>
            </button>

            <button
              onClick={handleSendContract}
              disabled={sending}
              className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {sending ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Contract</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Split View - Edit Form on Left, PDF Preview on Right */}
        {editMode ? (
          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Left Side - Editor */}
            <div className={`w-1/2 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg overflow-auto p-6`}>
              {/* Edit Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setEditType("fields")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    editType === "fields"
                      ? "bg-blue-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Edit Fields
                </button>
                <button
                  onClick={() => setEditType("fulltext")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    editType === "fulltext"
                      ? "bg-blue-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Edit Full Text
                </button>
              </div>

              {editType === "fields" ? (
                <>
                  <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Edit Contract Fields
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
              {/* Contractor Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Contractor Name
                </label>
                <input
                  type="text"
                  value={editableData.contractorName}
                  onChange={(e) => setEditableData({...editableData, contractorName: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Client Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Client Name
                </label>
                <input
                  type="text"
                  value={editableData.clientName}
                  onChange={(e) => setEditableData({...editableData, clientName: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Client Address */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Client Address
                </label>
                <input
                  type="text"
                  value={editableData.clientAddress}
                  onChange={(e) => setEditableData({...editableData, clientAddress: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Job Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Job Title / Role
                </label>
                <input
                  type="text"
                  value={editableData.jobTitle}
                  onChange={(e) => setEditableData({...editableData, jobTitle: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Location */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Work Location
                </label>
                <input
                  type="text"
                  value={editableData.location}
                  onChange={(e) => setEditableData({...editableData, location: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Duration */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Contract Duration
                </label>
                <input
                  type="text"
                  value={editableData.duration}
                  onChange={(e) => setEditableData({...editableData, duration: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="e.g., 6 months"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Start Date
                </label>
                <input
                  type="text"
                  value={editableData.startDate}
                  onChange={(e) => setEditableData({...editableData, startDate: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="e.g., January 1, 2024"
                />
              </div>

              {/* Day Rate */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Day Rate
                </label>
                <input
                  type="text"
                  value={editableData.dayRate}
                  onChange={(e) => setEditableData({...editableData, dayRate: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="e.g., 500"
                />
              </div>

              {/* Currency */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Currency
                </label>
                <select
                  value={editableData.currency}
                  onChange={(e) => setEditableData({...editableData, currency: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>

                  <div className="mt-6">
                    <button
                      onClick={handleUpdateContract}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all"
                    >
                      <FileText size={18} />
                      <span>Update PDF Preview</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Edit Full Contract Text
                  </h2>
                  <textarea
                    value={fullContractText}
                    onChange={(e) => setFullContractText(e.target.value)}
                    className={`w-full h-[calc(100vh-300px)] px-4 py-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                  <div className="mt-4">
                    <button
                      onClick={handleUpdateContract}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all"
                    >
                      <FileText size={18} />
                      <span>Update PDF Preview</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Side - PDF Preview */}
            <div className={`w-1/2 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg overflow-hidden`}>
              <div className="h-full flex flex-col">
                <div className={`px-4 py-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Live Preview
                  </h3>
                </div>
                <div className="flex-1">
                  <iframe
                    key={`preview-${previewKey}`}
                    src={`http://localhost:8000/api/v1/contractors/${contractorId}/contract-preview?t=${previewKey}`}
                    className="w-full h-full border-0"
                    title="Contract Preview PDF"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg overflow-hidden`}>
            <iframe
              src={`http://localhost:8000/api/v1/contractors/${contractorId}/contract-preview`}
              className="w-full h-full border-0"
              title="Contract Preview PDF"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
