"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Zap,
  Coins,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
} from "lucide-react";
import {
  Trace,
  TraceStatus,
  DashboardMetrics,
  ProcessStatus,
  AIAgent,
  AgentStatus,
} from "@/types/agent";
import {
  initializeSampleTraces,
  getAllTraces,
  calculateMetrics,
  calculateProcessStatus,
  filterTraces,
} from "@/lib/traceStorage";
import {
  getAllAgents,
  initializeSampleAgents,
  pauseAgent,
  resumeAgent,
  stopAgent,
  updateAgentConfiguration,
} from "@/lib/agentStorage";

export default function AIMonitoringPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [traces, setTraces] = useState<Trace[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics[]>([]);
  const [processStatus, setProcessStatus] = useState<ProcessStatus>({
    total: 0,
    running: 0,
    completed: 0,
    failed: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState<TraceStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d">("24h");

  // Agents state
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState<AIAgent["configuration"] | null>(null);

  // Redirect if not admin or superadmin
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "superadmin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Load traces and metrics
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      initializeSampleTraces();
      initializeSampleAgents(user.id);
      loadData();
    }
  }, [user]);

  // Refresh data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allTraces = getAllTraces();
    setTraces(allTraces);

    const hoursMap = { "1h": 1, "24h": 24, "7d": 168 };
    const calculatedMetrics = calculateMetrics(allTraces, hoursMap[timeRange]);
    setMetrics(calculatedMetrics);

    const status = calculateProcessStatus(allTraces);
    setProcessStatus(status);

    const allAgents = getAllAgents();
    setAgents(allAgents);
  };

  // Filter traces based on status and search
  const filteredTraces = traces.filter((trace) => {
    const matchesStatus = selectedStatus === "all" || trace.status === selectedStatus;
    const matchesSearch =
      searchTerm === "" ||
      trace.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trace.traceRoot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trace.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Agent control handlers
  const handlePauseAgent = (agentId: string) => {
    if (user) {
      pauseAgent(agentId, user.id, "Paused by admin");
      loadData();
    }
  };

  const handleResumeAgent = (agentId: string) => {
    if (user) {
      resumeAgent(agentId, user.id, "Resumed by admin");
      loadData();
    }
  };

  const handleStopAgent = (agentId: string) => {
    if (user && confirm("Are you sure you want to stop this agent?")) {
      stopAgent(agentId, user.id, "Stopped by admin");
      loadData();
    }
  };

  const handleConfigureAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setConfigForm(agent.configuration);
    setShowConfigModal(true);
  };

  const handleSaveConfiguration = () => {
    if (user && selectedAgent && configForm) {
      updateAgentConfiguration(selectedAgent.id, configForm, user.id);
      setShowConfigModal(false);
      setSelectedAgent(null);
      setConfigForm(null);
      loadData();
    }
  };

  // Helper functions
  const getStatusColor = (status: TraceStatus | AgentStatus) => {
    switch (status) {
      case "running": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "stopped": return "bg-gray-100 text-gray-800";
      case "error": return "bg-red-100 text-red-800";
      case "idle": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: TraceStatus) => {
    switch (status) {
      case "running": return <Loader size={14} className="animate-spin" />;
      case "completed": return <CheckCircle size={14} />;
      case "failed": return <XCircle size={14} />;
      case "cancelled": return <Clock size={14} />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Calculate latest metrics summary
  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const totalCost = traces.reduce((sum, t) => sum + t.totalCost, 0);
  const totalTokens = traces.reduce((sum, t) => sum + t.totalTokens, 0);
  const totalLLMCalls = traces.reduce((sum, t) => sum + t.llmCalls.length, 0);
  const totalIssues = traces.reduce((sum, t) => sum + t.issues, 0);

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LLM Observability</h1>
            <p className="text-gray-600 mt-1">
              Monitor traces, performance metrics, and agent activity in real-time
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all border border-gray-200"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Traces</span>
              <Activity className="text-[#FF6B00]" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{traces.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {processStatus.running} running
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">LLM Calls</span>
              <Zap className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(totalLLMCalls)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {latestMetrics ? formatNumber(latestMetrics.llmCalls) : 0} in last hour
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Tokens Used</span>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(totalTokens)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {latestMetrics ? formatNumber(latestMetrics.tokensUsed) : 0} in last hour
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Cost</span>
              <Coins className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCost(totalCost)}</p>
            <p className="text-xs text-gray-500 mt-1">
              All time
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Issues</span>
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalIssues}</p>
            <p className="text-xs text-gray-500 mt-1">
              {processStatus.failed} failed traces
            </p>
          </div>
        </div>

        {/* Process Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedStatus === "all"
                ? "border-[#FF6B00] bg-orange-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{processStatus.total}</div>
            <div className="text-sm text-gray-600 mt-1">All Traces</div>
          </button>
          <button
            onClick={() => setSelectedStatus("running")}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedStatus === "running"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Loader size={20} className="text-blue-600 animate-spin" />
              <div className="text-2xl font-bold text-gray-900">{processStatus.running}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">Running</div>
          </button>
          <button
            onClick={() => setSelectedStatus("completed")}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedStatus === "completed"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{processStatus.completed}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </button>
          <button
            onClick={() => setSelectedStatus("failed")}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedStatus === "failed"
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <XCircle size={20} className="text-red-600" />
              <div className="text-2xl font-bold text-gray-900">{processStatus.failed}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">Failed</div>
          </button>
        </div>

        {/* Agents Management */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">AI Agents</h2>
            <p className="text-sm text-gray-600 mt-1">Configure and manage your AI agents</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#FF6B00] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <span className="ml-2 font-medium text-gray-900">{agent.configuration.model}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Temperature:</span>
                      <span className="ml-2 font-medium text-gray-900">{agent.configuration.temperature}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Tokens:</span>
                      <span className="ml-2 font-medium text-gray-900">{agent.configuration.maxTokens}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Runs:</span>
                      <span className="ml-2 font-medium text-gray-900">{agent.metrics.totalRuns}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfigureAgent(agent)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55E00] transition-all"
                    >
                      <Activity size={16} />
                      Configure
                    </button>
                    {agent.status === "active" && (
                      <button
                        onClick={() => handlePauseAgent(agent.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all"
                        title="Pause"
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    {agent.status === "paused" && (
                      <button
                        onClick={() => handleResumeAgent(agent.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                        title="Resume"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {agent.status === "active" && (
                      <button
                        onClick={() => handleStopAgent(agent.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                        title="Stop"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Modal */}
        {showConfigModal && selectedAgent && configForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configure {selectedAgent.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">Edit system prompt, instructions, and model settings</p>
                </div>
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedAgent(null);
                    setConfigForm(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <XCircle size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    System Prompt
                  </label>
                  <textarea
                    value={configForm.systemPrompt}
                    onChange={(e) => setConfigForm({ ...configForm, systemPrompt: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                    placeholder="Enter system prompt..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Defines the AI's role and behavior</p>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={configForm.instructions}
                    onChange={(e) => setConfigForm({ ...configForm, instructions: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                    placeholder="Enter detailed instructions..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Specific instructions for how the agent should operate</p>
                </div>

                {/* Model Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Model
                    </label>
                    <select
                      value={configForm.model}
                      onChange={(e) => setConfigForm({ ...configForm, model: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Temperature
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={configForm.temperature}
                      onChange={(e) => setConfigForm({ ...configForm, temperature: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">0-2 (higher = more creative)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="4000"
                      step="100"
                      value={configForm.maxTokens}
                      onChange={(e) => setConfigForm({ ...configForm, maxTokens: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto Start</span>
                      <input
                        type="checkbox"
                        checked={configForm.autoStart}
                        onChange={(e) => setConfigForm({ ...configForm, autoStart: e.target.checked })}
                        className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Enable Logging</span>
                      <input
                        type="checkbox"
                        checked={configForm.enableLogging}
                        onChange={(e) => setConfigForm({ ...configForm, enableLogging: e.target.checked })}
                        className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Notify on Error</span>
                      <input
                        type="checkbox"
                        checked={configForm.notifyOnError}
                        onChange={(e) => setConfigForm({ ...configForm, notifyOnError: e.target.checked })}
                        className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Max Concurrent Runs</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={configForm.maxConcurrentRuns}
                        onChange={(e) => setConfigForm({ ...configForm, maxConcurrentRuns: parseInt(e.target.value) })}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Retry Attempts</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={configForm.retryAttempts}
                        onChange={(e) => setConfigForm({ ...configForm, retryAttempts: parseInt(e.target.value) })}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Timeout (seconds)</label>
                      <input
                        type="number"
                        min="30"
                        max="600"
                        value={configForm.timeoutSeconds}
                        onChange={(e) => setConfigForm({ ...configForm, timeoutSeconds: parseInt(e.target.value) })}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowConfigModal(false);
                      setSelectedAgent(null);
                      setConfigForm(null);
                    }}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveConfiguration}
                    className="flex-1 px-4 py-3 text-white bg-[#FF6B00] rounded-lg hover:bg-[#E55E00] transition-all font-medium"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Traces Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Traces</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search traces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trace ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trace Root
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LLM Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Tokens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTraces.length > 0 ? (
                  filteredTraces.slice(0, 50).map((trace) => (
                    <tr key={trace.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-gray-900 font-mono">{trace.id}</code>
                          {trace.issues > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {trace.issues} issues
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{trace.traceRoot}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{trace.agentName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trace.status)}`}>
                          {getStatusIcon(trace.status)}
                          {trace.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{formatDuration(trace.rootDuration)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{trace.llmCalls.length}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{formatNumber(trace.totalTokens)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{formatCost(trace.totalCost)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {trace.startTime.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No traces found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredTraces.length > 50 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
              Showing 50 of {filteredTraces.length} traces
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
