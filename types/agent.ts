// AI Agent Types and Interfaces

export type AgentStatus = 'active' | 'paused' | 'stopped' | 'error' | 'idle';

export type AgentType =
  | 'contract_generator'
  | 'document_analyzer'
  | 'timesheet_validator'
  | 'compliance_checker'
  | 'data_processor'
  | 'custom';

export interface AgentActivity {
  id: string;
  agentId: string;
  timestamp: Date;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

export interface AgentMetrics {
  totalRuns: number;
  successRate: number;
  averageExecutionTime: number; // in milliseconds
  lastRunTime: Date | null;
  errorCount: number;
  totalProcessedItems: number;
}

export interface AgentConfiguration {
  autoStart: boolean;
  maxConcurrentRuns: number;
  retryAttempts: number;
  timeoutSeconds: number;
  enableLogging: boolean;
  notifyOnError: boolean;
  systemPrompt: string;
  instructions: string;
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet';
  temperature: number;
  maxTokens: number;
  customSettings?: Record<string, any>;
}

export interface AIAgent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  createdAt: Date;
  lastActiveAt: Date | null;
  createdBy: string; // User ID
  configuration: AgentConfiguration;
  metrics: AgentMetrics;
  activities: AgentActivity[];
}

export interface AgentControlAction {
  agentId: string;
  action: 'pause' | 'resume' | 'stop' | 'restart' | 'configure';
  performedBy: string; // User ID
  timestamp: Date;
  reason?: string;
  previousStatus: AgentStatus;
  newStatus: AgentStatus;
}

// Default configuration for new agents
export const DEFAULT_AGENT_CONFIG: AgentConfiguration = {
  autoStart: false,
  maxConcurrentRuns: 1,
  retryAttempts: 3,
  timeoutSeconds: 300,
  enableLogging: true,
  notifyOnError: true,
  systemPrompt: "You are a helpful AI assistant.",
  instructions: "Follow the user's instructions carefully and provide accurate responses.",
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
};

// Default metrics for new agents
export const DEFAULT_AGENT_METRICS: AgentMetrics = {
  totalRuns: 0,
  successRate: 100,
  averageExecutionTime: 0,
  lastRunTime: null,
  errorCount: 0,
  totalProcessedItems: 0,
};

// LLM Observability Types
export type TraceStatus = 'running' | 'completed' | 'failed' | 'cancelled';

export interface LLMCall {
  id: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  duration: number; // in milliseconds
  timestamp: Date;
}

export interface Trace {
  id: string;
  traceRoot: string;
  agentId: string;
  agentName: string;
  status: TraceStatus;
  startTime: Date;
  endTime: Date | null;
  rootDuration: number; // in milliseconds
  llmCalls: LLMCall[];
  totalTokens: number;
  totalCost: number;
  issues: number;
  metadata?: Record<string, any>;
}

export interface DashboardMetrics {
  timestamp: Date;
  traffic: number;
  avgDuration: number;
  issues: number;
  llmCalls: number;
  tokensUsed: number;
}

export interface ProcessStatus {
  total: number;
  running: number;
  completed: number;
  failed: number;
}
