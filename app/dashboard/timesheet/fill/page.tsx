"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Send,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Info,
} from "lucide-react";

// Day types
const dayTypes = [
  { value: "work", label: "Worked", color: "bg-green-500" },
  { value: "sick", label: "Sick Leave", color: "bg-red-500" },
  { value: "holiday", label: "Public Holiday", color: "bg-blue-500" },
  { value: "vacation", label: "Vacation", color: "bg-purple-500" },
  { value: "unpaid", label: "Unpaid Leave", color: "bg-gray-500" },
];

// Helper to get days in month organized by weeks
const getMonthWeeks = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const weeks: { weekNumber: number; days: Date[] }[] = [];
  let currentWeek: Date[] = [];
  let weekNumber = 1;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    // If it's Monday (1) and we have days in current week, start new week
    if (dayOfWeek === 1 && currentWeek.length > 0) {
      weeks.push({ weekNumber, days: currentWeek });
      currentWeek = [];
      weekNumber++;
    }

    currentWeek.push(date);
  }

  // Push the last week
  if (currentWeek.length > 0) {
    weeks.push({ weekNumber, days: currentWeek });
  }

  return weeks;
};

// Sample timesheet data structure
const getCurrentMonthTimesheet = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const weeks = getMonthWeeks(year, month);

  // Initialize with default values
  const data: Record<string, { work: number; sick: number; holiday: number; vacation: number; unpaid: number }> = {};
  weeks.forEach(week => {
    week.days.forEach(day => {
      const key = day.toISOString().split('T')[0];
      // Default to 1 day work for all days - contractors can work weekends
      data[key] = {
        work: 1,
        sick: 0,
        holiday: 0,
        vacation: 0,
        unpaid: 0
      };
    });
  });

  return data;
};

export default function FillTimesheetPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [timesheetData, setTimesheetData] = useState(getCurrentMonthTimesheet());

  // Contractor details fetched from API
  const contractorId = "contractor_123"; // TODO: Get from auth context
  const [contractorInfo, setContractorInfo] = useState({
    id: "",
    name: "Loading...",
    client_name: "Loading...",
    project_name: "Loading...",
    location: "Loading...",
  });
  const [loading, setLoading] = useState(true);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    fetchContractorInfo();
  }, []);

  const fetchContractorInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/timesheets/contractor/${contractorId}/info`
      );
      const data = await response.json();
      setContractorInfo(data);
    } catch (error) {
      console.error("Error fetching contractor info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (dateKey: string, category: 'work' | 'sick' | 'holiday' | 'vacation' | 'unpaid', days: number) => {
    const dayData = timesheetData[dateKey];

    // All categories are capped at 1 day max (can be 0, 0.5, or 1)
    let validDays = Math.max(0, Math.min(1, days));

    setTimesheetData({
      ...timesheetData,
      [dateKey]: { ...dayData, [category]: validDays }
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/timesheets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractor_id: contractorId,
          month: `${monthNames[currentMonth]} ${currentYear}`,
          year: currentYear,
          month_number: currentMonth + 1,
          timesheet_data: timesheetData,
          total_days: totals.totalDays,
          work_days: totals.workDays,
          sick_days: totals.sickDays,
          vacation_days: totals.vacationDays,
          holiday_days: totals.holidayDays,
          unpaid_days: totals.unpaidDays,
          manager_name: "Manager", // TODO: Get from contractor data
        }),
      });

      if (response.ok) {
        alert("Timesheet submitted successfully! It will be sent to your manager for approval.");
        router.push("/dashboard/timesheet");
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to submit timesheet");
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      alert("Error submitting timesheet. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    console.log("Saving draft timesheet:", timesheetData);
    alert("Timesheet saved as draft. You can continue editing later.");
  };

  const weeks = getMonthWeeks(currentYear, currentMonth);

  // Calculate totals
  const totals = Object.values(timesheetData).reduce(
    (acc, day) => {
      acc.totalDays += day.work;
      if (day.work > 0) acc.workDays++;
      if (day.sick > 0) acc.sickDays++;
      if (day.vacation > 0) acc.vacationDays++;
      if (day.holiday > 0) acc.holidayDays++;
      if (day.unpaid > 0) acc.unpaidDays++;
      return acc;
    },
    { totalDays: 0, workDays: 0, sickDays: 0, vacationDays: 0, holidayDays: 0, unpaidDays: 0 }
  );

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setTimesheetData(getCurrentMonthTimesheet());
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/timesheet")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back to Timesheets
        </button>
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Fill Timesheet
        </h1>
        <p className="text-gray-400 mt-2">
          Fill in your monthly working hours
        </p>
      </div>

      {/* Quick Guide */}
      <div
        className={`${
          theme === "dark" ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"
        } rounded-lg p-4 border mb-6`}
      >
        <div className="flex items-start gap-3">
          <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3
              className={`font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Guide to Fill Timesheet
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Enter <strong>1</strong> for a full working day (8 hours)</li>
              <li>• Enter <strong>0.5</strong> for a half working day (4 hours)</li>
              <li>• Mark sick days, public holidays, vacation, or unpaid leave as needed</li>
              <li>• You can work on weekends - all days are available for entry</li>
              <li>• Review your total days at the top before submitting</li>
              <li>• Add any notes about your timesheet before submitting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compact Header with Info and Navigation - Sticky */}
      <div
        className={`sticky top-0 z-10 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-4 shadow-sm mb-4`}
      >
        {/* Timesheet Info - Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Contractor Name
            </label>
            <input
              type="text"
              value={contractorInfo.name}
              readOnly
              className={`w-full px-3 py-1.5 text-sm rounded border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={contractorInfo.client_name}
              readOnly
              className={`w-full px-3 py-1.5 text-sm rounded border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={contractorInfo.project_name}
              readOnly
              className={`w-full px-3 py-1.5 text-sm rounded border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Location
            </label>
            <input
              type="text"
              value={contractorInfo.location}
              readOnly
              className={`w-full px-3 py-1.5 text-sm rounded border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Period
            </label>
            <input
              type="text"
              value={`${monthNames[currentMonth]} ${currentYear}`}
              readOnly
              className={`w-full px-3 py-1.5 text-sm rounded border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              From / To
            </label>
            <input
              type="text"
              value={`${new Date(currentYear, currentMonth, 1).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })} - ${new Date(currentYear, currentMonth + 1, 0).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}`}
              readOnly
              className={`w-full px-3 py-1.5 text-sm rounded border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>

        {/* Month Navigation and Summary in One Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateMonth(-1)}
              className={`p-2 rounded transition-all ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <h2
              className={`text-lg font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {monthNames[currentMonth]} {currentYear}
            </h2>

            <button
              onClick={() => navigateMonth(1)}
              className={`p-2 rounded transition-all ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Compact Summary Stats */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Total:</span>
              <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{totals.totalDays} {totals.totalDays === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Worked:</span>
              <span className="text-lg font-bold text-green-500">{totals.workDays}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Sick:</span>
              <span className="text-lg font-bold text-red-500">{totals.sickDays}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Vacation:</span>
              <span className="text-lg font-bold text-purple-500">{totals.vacationDays}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Holiday:</span>
              <span className="text-lg font-bold text-blue-500">{totals.holidayDays}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Unpaid:</span>
              <span className="text-lg font-bold text-gray-500">{totals.unpaidDays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timesheet Table Layout - Leave Types as Rows */}
      <div className="space-y-3">
        {weeks.map((week) => {
          // Calculate weekly totals
          const weeklyDays = week.days.reduce((total, date) => {
            const dateKey = date.toISOString().split('T')[0];
            const dayData = timesheetData[dateKey];
            if (dayData) {
              return total + dayData.work;
            }
            return total;
          }, 0);

          return (
          <div
            key={week.weekNumber}
            className={`rounded-lg border overflow-hidden ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* Week Header */}
            <div className={`flex items-center justify-between px-4 py-2 ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}>
              <div className="flex items-end flex-1">
                <div className="relative">
                  <div className="bg-[#FF6B00] text-white px-4 py-1 transform -skew-x-12">
                    <h3 className="text-xs font-bold transform skew-x-12">Week {week.weekNumber}</h3>
                  </div>
                </div>
                <div className="flex-1 h-0.5 bg-[#FF6B00]"></div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs text-gray-400">Total:</span>
                <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {weeklyDays} {weeklyDays === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>

            {/* Timesheet Table */}
            <div className={`overflow-x-auto ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                    <th className={`px-4 py-2 text-left text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Category
                    </th>
                    {week.days.map((date) => {
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = date.getDate();

                      return (
                        <th
                          key={date.toISOString()}
                          className={`px-3 py-2 text-center border-l ${
                            theme === "dark" ? "border-gray-800" : "border-gray-200"
                          }`}
                        >
                          <div className="text-gray-400 text-xs uppercase">{dayName}</div>
                          <div className={`text-base font-bold mt-0.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {dayNum}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {dayTypes.map((dayType) => (
                    <tr
                      key={dayType.value}
                      className={`border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"} transition-all ${
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${dayType.color}`}></div>
                          <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {dayType.label}
                          </span>
                        </div>
                      </td>
                      {week.days.map((date) => {
                        const dateKey = date.toISOString().split('T')[0];
                        const dayData = timesheetData[dateKey];
                        const categoryValue = dayData[dayType.value as keyof typeof dayData] as number;

                        return (
                          <td
                            key={dateKey}
                            className={`px-3 py-2 text-center border-l ${
                              theme === "dark" ? "border-gray-800" : "border-gray-200"
                            } ${
                              categoryValue > 0 ? (theme === "dark" ? "bg-gray-800" : "bg-gray-50") : ""
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.5"
                                value={categoryValue || ''}
                                onChange={(e) =>
                                  handleDayChange(dateKey, dayType.value as any, parseFloat(e.target.value) || 0)
                                }
                                className={`w-14 px-1.5 py-0.5 rounded border text-center font-semibold text-xs transition-all outline-none ${
                                  theme === "dark"
                                    ? "bg-gray-950 border-gray-700 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                } focus:ring-1 focus:ring-[#FF6B00] focus:border-transparent`}
                                placeholder="0"
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          );
        })}
      </div>

      {/* Notes and Actions - Combined */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg p-4 shadow-sm mt-3`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Notes */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add any notes about this month's timesheet..."
              className={`w-full px-3 py-2 text-sm rounded border transition-all outline-none resize-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              } focus:ring-1 focus:ring-[#FF6B00] focus:border-transparent`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex md:flex-col gap-2 md:justify-end">
            <button
              onClick={handleSubmit}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Send size={16} />
              Submit
            </button>
            <button
              onClick={handleSaveDraft}
              className={`font-medium py-2 px-6 rounded-lg transition-all text-sm ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* Legend - Inline */}
        <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-medium text-gray-400">Legend:</span>
            {dayTypes.map((type) => (
              <div key={type.value} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${type.color}`}></div>
                <span className="text-xs text-gray-400">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
