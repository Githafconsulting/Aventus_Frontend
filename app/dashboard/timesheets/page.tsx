"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
  FileDown,
} from "lucide-react";

// Sample timesheets data
const timesheetsData = [
  {
    id: 1,
    contractorName: "John Doe",
    manager: "Sarah Wilson",
    month: "December 2024",
    project: "Project Alpha",
    totalHours: 160,
    status: "pending",
    submittedDate: "2024-12-31",
    weeks: [
      {
        weekNumber: 1,
        weekPeriod: "Dec 2-6, 2024",
        dailyHours: [
          { date: "2024-12-02", day: "Monday", hours: 8, notes: "Development tasks - User authentication module" },
          { date: "2024-12-03", day: "Tuesday", hours: 8, notes: "Code review and testing" },
          { date: "2024-12-04", day: "Wednesday", hours: 8, notes: "Bug fixes - Payment gateway integration" },
          { date: "2024-12-05", day: "Thursday", hours: 8, notes: "Feature implementation - Dashboard widgets" },
          { date: "2024-12-06", day: "Friday", hours: 8, notes: "Documentation and deployment" },
        ],
        totalHours: 40,
      },
      {
        weekNumber: 2,
        weekPeriod: "Dec 9-13, 2024",
        dailyHours: [
          { date: "2024-12-09", day: "Monday", hours: 8, notes: "API development - User management endpoints" },
          { date: "2024-12-10", day: "Tuesday", hours: 8, notes: "Database optimization and indexing" },
          { date: "2024-12-11", day: "Wednesday", hours: 8, notes: "Frontend integration - React components" },
          { date: "2024-12-12", day: "Thursday", hours: 8, notes: "Security audit and fixes" },
          { date: "2024-12-13", day: "Friday", hours: 8, notes: "Code refactoring and cleanup" },
        ],
        totalHours: 40,
      },
      {
        weekNumber: 3,
        weekPeriod: "Dec 16-20, 2024",
        dailyHours: [
          { date: "2024-12-16", day: "Monday", hours: 8, notes: "Performance optimization" },
          { date: "2024-12-17", day: "Tuesday", hours: 8, notes: "Unit testing - Backend services" },
          { date: "2024-12-18", day: "Wednesday", hours: 8, notes: "Integration testing" },
          { date: "2024-12-19", day: "Thursday", hours: 8, notes: "Bug fixes and improvements" },
          { date: "2024-12-20", day: "Friday", hours: 8, notes: "Sprint review and planning" },
        ],
        totalHours: 40,
      },
      {
        weekNumber: 4,
        weekPeriod: "Dec 23-27, 2024",
        dailyHours: [
          { date: "2024-12-23", day: "Monday", hours: 8, notes: "Feature development - Notification system" },
          { date: "2024-12-24", day: "Tuesday", hours: 8, notes: "Email template design and implementation" },
          { date: "2024-12-25", day: "Wednesday", hours: 0, notes: "Holiday - Christmas" },
          { date: "2024-12-26", day: "Thursday", hours: 8, notes: "System monitoring setup" },
          { date: "2024-12-27", day: "Friday", hours: 8, notes: "Documentation updates" },
        ],
        totalHours: 32,
      },
    ],
  },
  {
    id: 2,
    contractorName: "Jane Smith",
    manager: "Mike Johnson",
    month: "December 2024",
    project: "Project Beta",
    totalHours: 158,
    status: "approved",
    submittedDate: "2024-12-31",
    approvedDate: "2025-01-02",
    weeks: [
      {
        weekNumber: 1,
        weekPeriod: "Dec 2-6, 2024",
        dailyHours: [
          { date: "2024-12-02", day: "Monday", hours: 8, notes: "Client meeting and requirements gathering" },
          { date: "2024-12-03", day: "Tuesday", hours: 8, notes: "Design mockups and wireframes" },
          { date: "2024-12-04", day: "Wednesday", hours: 8, notes: "Frontend development" },
          { date: "2024-12-05", day: "Thursday", hours: 8, notes: "Component library setup" },
          { date: "2024-12-06", day: "Friday", hours: 7, notes: "Code review session" },
        ],
        totalHours: 39,
      },
      {
        weekNumber: 2,
        weekPeriod: "Dec 9-13, 2024",
        dailyHours: [
          { date: "2024-12-09", day: "Monday", hours: 8, notes: "API integration" },
          { date: "2024-12-10", day: "Tuesday", hours: 8, notes: "State management implementation" },
          { date: "2024-12-11", day: "Wednesday", hours: 8, notes: "Responsive design adjustments" },
          { date: "2024-12-12", day: "Thursday", hours: 8, notes: "Cross-browser testing" },
          { date: "2024-12-13", day: "Friday", hours: 8, notes: "Bug fixes" },
        ],
        totalHours: 40,
      },
      {
        weekNumber: 3,
        weekPeriod: "Dec 16-20, 2024",
        dailyHours: [
          { date: "2024-12-16", day: "Monday", hours: 8, notes: "Performance monitoring" },
          { date: "2024-12-17", day: "Tuesday", hours: 8, notes: "Accessibility improvements" },
          { date: "2024-12-18", day: "Wednesday", hours: 8, notes: "User testing session" },
          { date: "2024-12-19", day: "Thursday", hours: 8, notes: "Feedback implementation" },
          { date: "2024-12-20", day: "Friday", hours: 7, notes: "Sprint retrospective" },
        ],
        totalHours: 39,
      },
      {
        weekNumber: 4,
        weekPeriod: "Dec 23-27, 2024",
        dailyHours: [
          { date: "2024-12-23", day: "Monday", hours: 8, notes: "Final testing" },
          { date: "2024-12-24", day: "Tuesday", hours: 8, notes: "Deployment preparation" },
          { date: "2024-12-25", day: "Wednesday", hours: 0, notes: "Holiday - Christmas" },
          { date: "2024-12-26", day: "Thursday", hours: 8, notes: "Production deployment" },
          { date: "2024-12-27", day: "Friday", hours: 8, notes: "Post-deployment monitoring" },
        ],
        totalHours: 32,
      },
    ],
  },
  {
    id: 3,
    contractorName: "Bob Williams",
    manager: "Sarah Wilson",
    month: "December 2024",
    project: "Project Gamma",
    totalHours: 165,
    status: "approved",
    submittedDate: "2024-12-30",
    approvedDate: "2024-12-31",
  },
  {
    id: 4,
    contractorName: "Alice Brown",
    manager: "David Chen",
    month: "December 2024",
    project: "Project Delta",
    totalHours: 160,
    status: "approved",
    submittedDate: "2024-12-31",
    approvedDate: "2025-01-02",
  },
  {
    id: 5,
    contractorName: "Tom Davis",
    manager: "Mike Johnson",
    month: "December 2024",
    project: "Project Beta",
    totalHours: 140,
    status: "declined",
    submittedDate: "2024-12-30",
    declinedDate: "2024-12-31",
  },
  {
    id: 6,
    contractorName: "Emma Wilson",
    manager: "Sarah Wilson",
    month: "December 2024",
    project: "Project Alpha",
    totalHours: 160,
    status: "pending",
    submittedDate: "2024-12-31",
  },
];

export default function AdminTimesheetsPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedManager, setSelectedManager] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Filter timesheets
  const filteredTimesheets = timesheetsData.filter((timesheet) => {
    const matchesSearch =
      timesheet.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timesheet.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timesheet.project.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || timesheet.status === selectedStatus;

    const matchesManager =
      selectedManager === "all" || timesheet.manager === selectedManager;

    const matchesProject =
      selectedProject === "all" || timesheet.project === selectedProject;

    return matchesSearch && matchesStatus && matchesManager && matchesProject;
  });

  const managers = [...new Set(timesheetsData.map((t) => t.manager))];
  const projects = [...new Set(timesheetsData.map((t) => t.project))];

  // Calculate statistics
  const pendingCount = timesheetsData.filter((t) => t.status === "pending").length;
  const approvedCount = timesheetsData.filter((t) => t.status === "approved").length;
  const declinedCount = timesheetsData.filter((t) => t.status === "declined").length;
  const totalHours = timesheetsData.reduce((sum, t) => sum + t.totalHours, 0);

  const handleTimesheetClick = (timesheet: any) => {
    setSelectedTimesheet(timesheet);
    setShowPreviewModal(true);
  };

  const handleDownloadTimesheet = () => {
    if (!selectedTimesheet) return;

    // Create professional A4 HTML timesheet
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Timesheet - ${selectedTimesheet.contractorName}</title>
  <style>
    @page {
      size: A4;
      margin: 0.8cm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.5;
      padding: 30px;
      max-width: 210mm;
      margin: 0 auto;
      font-size: 12pt;
    }

    .header {
      border-bottom: 4px solid #FF6B00;
      padding-bottom: 16px;
      margin-bottom: 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .company-info h1 {
      font-size: 32px;
      color: #FF6B00;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .company-info p {
      color: #666;
      font-size: 13px;
    }

    .document-title {
      text-align: right;
    }

    .document-title h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 6px;
    }

    .document-title p {
      color: #666;
      font-size: 13px;
    }

    .info-section {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      padding: 16px 18px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      font-size: 11pt;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item label {
      font-size: 9.5pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .info-item .value {
      font-size: 12pt;
      color: #1a1a1a;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 9pt;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-approved {
      background: #d4edda;
      color: #155724;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-declined {
      background: #f8d7da;
      color: #721c24;
    }

    .weeks-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .week-section {
      border: 1px solid #e0e0e0;
      padding: 10px;
      background: #fafafa;
    }

    .week-header {
      background: #FF6B00;
      color: white;
      padding: 8px 10px;
      margin: -10px -10px 10px -10px;
      font-size: 11pt;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
    }

    .hours-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }

    .hours-table th {
      background: #333;
      color: white;
      padding: 6px 7px;
      text-align: left;
      font-weight: 600;
      font-size: 9pt;
      text-transform: uppercase;
    }

    .hours-table tbody tr {
      border-bottom: 1px solid #e8e8e8;
    }

    .hours-table tbody tr:last-child {
      border-bottom: none;
    }

    .hours-table td {
      padding: 6px 7px;
      font-size: 9.5pt;
      line-height: 1.4;
    }

    .hours-table td.hours-cell {
      font-weight: 700;
      color: #FF6B00;
      text-align: center;
      font-size: 10.5pt;
    }

    .hours-table td.hours-cell.zero {
      color: #999;
    }

    .summary-section {
      background: #fff8f0;
      border: 2px solid #FF6B00;
      padding: 18px;
      margin-bottom: 20px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      text-align: center;
    }

    .summary-item h3 {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .summary-item .amount {
      font-size: 34px;
      font-weight: 700;
      color: #FF6B00;
      line-height: 1;
    }

    .summary-item .unit {
      font-size: 13px;
      color: #666;
    }

    .signatures {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin-top: 22px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .signature-box {
      border-top: 2px solid #333;
      padding-top: 10px;
    }

    .signature-box label {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .signature-box .date {
      font-size: 11pt;
      color: #999;
      margin-top: 6px;
    }

    .footer {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 9pt;
      color: #999;
    }

    @media print {
      body {
        padding: 0;
      }

      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="company-info">
      <h1>AVENTUS</h1>
      <p>Contractor Management Platform</p>
    </div>
    <div class="document-title">
      <h2>TIMESHEET</h2>
      <p>${selectedTimesheet.month}</p>
    </div>
  </div>

  <!-- Contractor Information -->
  <div class="info-section">
    <div class="info-item">
      <label>Contractor</label>
      <div class="value">${selectedTimesheet.contractorName}</div>
    </div>
    <div class="info-item">
      <label>Manager</label>
      <div class="value">${selectedTimesheet.manager}</div>
    </div>
    <div class="info-item">
      <label>Project</label>
      <div class="value">${selectedTimesheet.project}</div>
    </div>
    <div class="info-item">
      <label>Status</label>
      <div class="value">
        <span class="status-badge status-${selectedTimesheet.status}">
          ${selectedTimesheet.status.charAt(0).toUpperCase() + selectedTimesheet.status.slice(1)}
        </span>
      </div>
    </div>
  </div>

  <!-- Hours Breakdown - 2x2 Grid -->
  ${selectedTimesheet.weeks ? `
    <div class="weeks-container">
      ${selectedTimesheet.weeks.map((week: any) => `
        <div class="week-section">
          <div class="week-header">
            <span>Week ${week.weekNumber} - ${week.weekPeriod}</span>
            <span>${week.totalHours}h</span>
          </div>
          <table class="hours-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Notes</th>
                <th>Hrs</th>
              </tr>
            </thead>
            <tbody>
              ${week.dailyHours.map((day: any) => `
                <tr>
                  <td>${new Date(day.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</td>
                  <td>${day.day.substring(0, 3)}</td>
                  <td>${day.notes.substring(0, 50)}${day.notes.length > 50 ? '...' : ''}</td>
                  <td class="hours-cell${day.hours === 0 ? ' zero' : ''}">${day.hours}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Summary -->
  <div class="summary-section">
    <div class="summary-grid">
      <div class="summary-item">
        <h3>Total Hours</h3>
        <div>
          <span class="amount">${selectedTimesheet.totalHours}</span>
          <span class="unit">hours</span>
        </div>
      </div>
      <div class="summary-item">
        <h3>Weeks</h3>
        <div>
          <span class="amount">${selectedTimesheet.weeks ? selectedTimesheet.weeks.length : 0}</span>
          <span class="unit">weeks</span>
        </div>
      </div>
      <div class="summary-item">
        <h3>Average/Week</h3>
        <div>
          <span class="amount">${selectedTimesheet.weeks ? (selectedTimesheet.totalHours / selectedTimesheet.weeks.length).toFixed(1) : '0'}</span>
          <span class="unit">hours</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Signatures -->
  <div class="signatures">
    <div class="signature-box">
      <label>Contractor Signature</label>
      <div class="date">Submitted: ${new Date(selectedTimesheet.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
    </div>
    <div class="signature-box">
      <label>Manager Approval</label>
      <div class="date">${selectedTimesheet.approvedDate ? `Approved: ${new Date(selectedTimesheet.approvedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Pending Approval'}</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Aventus Contractor Management Platform | Document ID: TS-${selectedTimesheet.id.toString().padStart(6, '0')} | Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
  </div>

  <script>
    // Auto-print when document loads
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
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
            All Timesheets
          </h1>
          <p className="text-gray-400 mt-2">
            Overview of all contractor timesheets
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-fit">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {approvedCount}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Declined</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {declinedCount}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-[#FF6B00]" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Hours</p>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {totalHours}h
              </p>
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
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search timesheets..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {/* Manager Filter */}
          <div>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Managers</option>
              {managers.map((manager) => (
                <option key={manager} value={manager}>
                  {manager}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`}
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timesheets Table */}
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
                  Contractor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Manager
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Project
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Submitted
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTimesheets.map((timesheet) => (
                <tr
                  key={timesheet.id}
                  onClick={() => handleTimesheetClick(timesheet)}
                  className={`border-b ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  } ${
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  } transition-all cursor-pointer`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {timesheet.contractorName.charAt(0)}
                      </div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {timesheet.contractorName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-sm">{timesheet.manager}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {timesheet.month}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-sm">{timesheet.project}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p
                      className={`font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {timesheet.totalHours}h
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-sm">
                      {new Date(timesheet.submittedDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        timesheet.status === "approved"
                          ? "bg-green-500/10 text-green-500"
                          : timesheet.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {timesheet.status.charAt(0).toUpperCase() +
                        timesheet.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTimesheets.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } rounded-lg p-12 shadow-sm text-center mt-6`}
        >
          <p className="text-gray-400 text-lg">No timesheets found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Timesheet Preview Modal */}
      {showPreviewModal && selectedTimesheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FF6B00] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Timesheet Preview</h2>
                <p className="text-white/80 text-sm mt-1">{selectedTimesheet.contractorName}</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Timesheet Details */}
            <div className="p-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}>
                  <p className="text-gray-400 text-sm mb-1">Contractor</p>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {selectedTimesheet.contractorName}
                  </p>
                </div>
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}>
                  <p className="text-gray-400 text-sm mb-1">Manager</p>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {selectedTimesheet.manager}
                  </p>
                </div>
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}>
                  <p className="text-gray-400 text-sm mb-1">Month</p>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {selectedTimesheet.month}
                  </p>
                </div>
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}>
                  <p className="text-gray-400 text-sm mb-1">Project</p>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {selectedTimesheet.project}
                  </p>
                </div>
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}>
                  <p className="text-gray-400 text-sm mb-1">Total Hours</p>
                  <p className={`font-bold text-2xl text-[#FF6B00]`}>
                    {selectedTimesheet.totalHours}h
                  </p>
                </div>
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedTimesheet.status === "approved"
                        ? "bg-green-500/10 text-green-500"
                        : selectedTimesheet.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {selectedTimesheet.status.charAt(0).toUpperCase() + selectedTimesheet.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Weekly Hours Breakdown */}
              {selectedTimesheet.weeks && (
                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Monthly Hours Breakdown
                  </h3>
                  <div className="space-y-6">
                    {selectedTimesheet.weeks.map((week: any, weekIndex: number) => (
                      <div key={weekIndex} className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Week {week.weekNumber} - {week.weekPeriod}
                          </h4>
                          <span className="text-[#FF6B00] font-bold">{week.totalHours}h</span>
                        </div>
                        <div className="space-y-2">
                          {week.dailyHours.map((day: any, dayIndex: number) => (
                            <div
                              key={dayIndex}
                              className={`${theme === "dark" ? "bg-gray-700" : "bg-white"} p-3 rounded flex items-center justify-between`}
                            >
                              <div className="flex-1">
                                <p className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                  {day.day} - {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">{day.notes}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className={`font-bold ${day.hours === 0 ? 'text-gray-400' : 'text-[#FF6B00]'}`}>{day.hours}h</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownloadTimesheet}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg font-medium transition-all"
                >
                  <FileDown size={20} />
                  Download Timesheet
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
