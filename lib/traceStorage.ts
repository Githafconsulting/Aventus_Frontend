import { Trace, TraceStatus, LLMCall, DashboardMetrics, ProcessStatus } from "@/types/agent";

// Generate sample trace data
export function generateSampleTraces(count: number = 50): Trace[] {
  const traces: Trace[] = [];
  const agents = [
    { id: "agent-1", name: "Contract Generator" },
    { id: "agent-2", name: "Document Analyzer" },
    { id: "agent-3", name: "Compliance Checker" },
    { id: "agent-4", name: "Data Processor" },
  ];

  const models = ["gpt-4", "gpt-3.5-turbo", "claude-3-opus", "claude-3-sonnet"];
  const traceRoots = [
    "generate_contract",
    "analyze_document",
    "validate_compliance",
    "process_data",
    "extract_entities",
    "summarize_text",
  ];

  const now = new Date();

  for (let i = 0; i < count; i++) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const numLLMCalls = Math.floor(Math.random() * 5) + 1;
    const llmCalls: LLMCall[] = [];

    let totalTokens = 0;
    let totalCost = 0;
    const startTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    for (let j = 0; j < numLLMCalls; j++) {
      const model = models[Math.floor(Math.random() * models.length)];
      const promptTokens = Math.floor(Math.random() * 2000) + 500;
      const completionTokens = Math.floor(Math.random() * 1000) + 200;
      const tokens = promptTokens + completionTokens;

      // Calculate cost based on model
      let cost = 0;
      if (model === "gpt-4") {
        cost = (promptTokens / 1000) * 0.03 + (completionTokens / 1000) * 0.06;
      } else if (model === "gpt-3.5-turbo") {
        cost = (promptTokens / 1000) * 0.0015 + (completionTokens / 1000) * 0.002;
      } else if (model === "claude-3-opus") {
        cost = (promptTokens / 1000) * 0.015 + (completionTokens / 1000) * 0.075;
      } else {
        cost = (promptTokens / 1000) * 0.003 + (completionTokens / 1000) * 0.015;
      }

      llmCalls.push({
        id: `call-${i}-${j}`,
        model,
        promptTokens,
        completionTokens,
        totalTokens: tokens,
        cost,
        duration: Math.floor(Math.random() * 5000) + 1000,
        timestamp: new Date(startTime.getTime() + j * 1000),
      });

      totalTokens += tokens;
      totalCost += cost;
    }

    const status: TraceStatus = Math.random() > 0.15
      ? (Math.random() > 0.05 ? "completed" : "running")
      : "failed";

    const duration = llmCalls.reduce((sum, call) => sum + call.duration, 0) +
                     Math.floor(Math.random() * 2000);

    const endTime = status === "running" ? null : new Date(startTime.getTime() + duration);
    const issues = status === "failed" ? Math.floor(Math.random() * 3) + 1 : 0;

    traces.push({
      id: `trace-${i.toString().padStart(6, '0')}`,
      traceRoot: traceRoots[Math.floor(Math.random() * traceRoots.length)],
      agentId: agent.id,
      agentName: agent.name,
      status,
      startTime,
      endTime,
      rootDuration: duration,
      llmCalls,
      totalTokens,
      totalCost,
      issues,
    });
  }

  return traces.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
}

// Calculate metrics from traces
export function calculateMetrics(traces: Trace[], hoursBack: number = 24): DashboardMetrics[] {
  const metrics: DashboardMetrics[] = [];
  const now = new Date();

  for (let i = 0; i < hoursBack; i++) {
    const hourStart = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000);
    const hourEnd = new Date(now.getTime() - i * 60 * 60 * 1000);

    const hourTraces = traces.filter(
      t => t.startTime >= hourStart && t.startTime < hourEnd
    );

    const traffic = hourTraces.length;
    const avgDuration = hourTraces.length > 0
      ? hourTraces.reduce((sum, t) => sum + t.rootDuration, 0) / hourTraces.length
      : 0;
    const issues = hourTraces.reduce((sum, t) => sum + t.issues, 0);
    const llmCalls = hourTraces.reduce((sum, t) => sum + t.llmCalls.length, 0);
    const tokensUsed = hourTraces.reduce((sum, t) => sum + t.totalTokens, 0);

    metrics.unshift({
      timestamp: hourStart,
      traffic,
      avgDuration,
      issues,
      llmCalls,
      tokensUsed,
    });
  }

  return metrics;
}

// Calculate process status
export function calculateProcessStatus(traces: Trace[]): ProcessStatus {
  return {
    total: traces.length,
    running: traces.filter(t => t.status === "running").length,
    completed: traces.filter(t => t.status === "completed").length,
    failed: traces.filter(t => t.status === "failed").length,
  };
}

// Storage keys
const TRACES_STORAGE_KEY = "aventus_traces";

// Initialize sample data
export function initializeSampleTraces(): void {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(TRACES_STORAGE_KEY);
  if (!existing) {
    const traces = generateSampleTraces(100);
    localStorage.setItem(TRACES_STORAGE_KEY, JSON.stringify(traces));
  }
}

// Get all traces
export function getAllTraces(): Trace[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(TRACES_STORAGE_KEY);
  if (!stored) return [];

  const traces = JSON.parse(stored);
  return traces.map((t: any) => ({
    ...t,
    startTime: new Date(t.startTime),
    endTime: t.endTime ? new Date(t.endTime) : null,
    llmCalls: t.llmCalls.map((c: any) => ({
      ...c,
      timestamp: new Date(c.timestamp),
    })),
  }));
}

// Get trace by ID
export function getTraceById(id: string): Trace | null {
  const traces = getAllTraces();
  return traces.find(t => t.id === id) || null;
}

// Filter traces
export function filterTraces(
  status?: TraceStatus,
  agentId?: string,
  limit?: number
): Trace[] {
  let traces = getAllTraces();

  if (status) {
    traces = traces.filter(t => t.status === status);
  }

  if (agentId) {
    traces = traces.filter(t => t.agentId === agentId);
  }

  if (limit) {
    traces = traces.slice(0, limit);
  }

  return traces;
}
