"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { FolderOpen, Download, Calendar, User } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

interface Contract {
  contractor_id: string;
  contractor_name: string;
  contract_url: string;
  signed_date: string;
}

export default function MyContractsPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const token = localStorage.getItem("aventus-auth-token");

        if (!token) {
          console.error("No auth token found");
          return;
        }

        const response = await fetch(API_ENDPOINTS.myContracts, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contracts");
        }

        const data = await response.json();
        setContracts(data.contracts || []);
        setLoading(false);
      } catch (error) {
        console.error("Error loading contracts:", error);
        setLoading(false);
      }
    };

    loadContracts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            My Contracts
          </h1>
          <p className="text-gray-400 mt-2">
            All contracts you've signed on behalf of Aventus HR
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div
            className={`px-6 py-3 card-parallelogram ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-400">Total Contracts</p>
            <p
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {contracts.length}
            </p>
          </div>
        </div>
      </div>

      {/* Contracts Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
          <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Loading contracts...
          </p>
        </div>
      ) : contracts.length === 0 ? (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } card-parallelogram p-12 text-center`}
        >
          <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3
            className={`text-xl font-semibold mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Contracts Yet
          </h3>
          <p className="text-gray-400">
            Signed contracts will appear here once contractors complete their contract signing process
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract, index) => (
            <div
              key={index}
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } card-parallelogram p-6 hover:shadow-lg transition-all cursor-pointer`}
            >
              {/* Contract Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
                  <FolderOpen size={24} className="text-[#FF6B00]" />
                </div>
              </div>

              {/* Contractor Name */}
              <h3
                className={`text-lg font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {contract.contractor_name}
              </h3>

              {/* Contract Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={16} />
                  <span>Signed: {formatDate(contract.signed_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User size={16} />
                  <span>ID: {contract.contractor_id.slice(0, 8)}...</span>
                </div>
              </div>

              {/* Download Button */}
              <a
                href={contract.contract_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white btn-parallelogram transition-all text-sm font-medium"
              >
                <Download size={16} />
                Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
