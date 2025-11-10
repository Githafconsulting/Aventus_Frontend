// AI Agent Storage Management
// This provides a localStorage-based solution that can be easily migrated to a database

import { AIAgent, AgentActivity, AgentControlAction, DEFAULT_AGENT_CONFIG, DEFAULT_AGENT_METRICS } from '@/types/agent';

const STORAGE_KEYS = {
  AGENTS: 'aventus-ai-agents',
  ACTIVITIES: 'aventus-agent-activities',
  CONTROL_ACTIONS: 'aventus-agent-control-actions',
};

// Agent Management
export const getAllAgents = (): AIAgent[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.AGENTS);
  if (!stored) return [];

  const agents = JSON.parse(stored);
  // Parse dates back from strings
  return agents.map((agent: any) => ({
    ...agent,
    createdAt: new Date(agent.createdAt),
    lastActiveAt: agent.lastActiveAt ? new Date(agent.lastActiveAt) : null,
    metrics: {
      ...agent.metrics,
      lastRunTime: agent.metrics.lastRunTime ? new Date(agent.metrics.lastRunTime) : null,
    },
  }));
};

export const getAgentById = (id: string): AIAgent | null => {
  const agents = getAllAgents();
  return agents.find(agent => agent.id === id) || null;
};

export const saveAgent = (agent: AIAgent): void => {
  const agents = getAllAgents();
  const existingIndex = agents.findIndex(a => a.id === agent.id);

  if (existingIndex >= 0) {
    agents[existingIndex] = agent;
  } else {
    agents.push(agent);
  }

  localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
};

export const deleteAgent = (id: string): void => {
  const agents = getAllAgents();
  const filtered = agents.filter(agent => agent.id !== id);
  localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(filtered));

  // Also clean up activities for this agent
  const activities = getAllActivities();
  const filteredActivities = activities.filter(activity => activity.agentId !== id);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filteredActivities));
};

// Activity Management
export const getAllActivities = (): AgentActivity[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  if (!stored) return [];

  const activities = JSON.parse(stored);
  return activities.map((activity: any) => ({
    ...activity,
    timestamp: new Date(activity.timestamp),
  }));
};

export const getActivitiesByAgentId = (agentId: string, limit?: number): AgentActivity[] => {
  const activities = getAllActivities();
  const filtered = activities.filter(activity => activity.agentId === agentId);
  const sorted = filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return limit ? sorted.slice(0, limit) : sorted;
};

export const addActivity = (activity: AgentActivity): void => {
  const activities = getAllActivities();
  activities.push(activity);

  // Keep only last 1000 activities to prevent storage bloat
  const trimmed = activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 1000);

  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(trimmed));
};

// Control Action Management
export const getAllControlActions = (): AgentControlAction[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.CONTROL_ACTIONS);
  if (!stored) return [];

  const actions = JSON.parse(stored);
  return actions.map((action: any) => ({
    ...action,
    timestamp: new Date(action.timestamp),
  }));
};

export const addControlAction = (action: AgentControlAction): void => {
  const actions = getAllControlActions();
  actions.push(action);

  // Keep only last 500 control actions
  const trimmed = actions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 500);

  localStorage.setItem(STORAGE_KEYS.CONTROL_ACTIONS, JSON.stringify(trimmed));
};

// Agent Control Functions
export const pauseAgent = (agentId: string, userId: string, reason?: string): boolean => {
  const agent = getAgentById(agentId);
  if (!agent) return false;

  const previousStatus = agent.status;
  agent.status = 'paused';
  saveAgent(agent);

  addControlAction({
    agentId,
    action: 'pause',
    performedBy: userId,
    timestamp: new Date(),
    reason,
    previousStatus,
    newStatus: 'paused',
  });

  return true;
};

export const resumeAgent = (agentId: string, userId: string, reason?: string): boolean => {
  const agent = getAgentById(agentId);
  if (!agent) return false;

  const previousStatus = agent.status;
  agent.status = 'active';
  agent.lastActiveAt = new Date();
  saveAgent(agent);

  addControlAction({
    agentId,
    action: 'resume',
    performedBy: userId,
    timestamp: new Date(),
    reason,
    previousStatus,
    newStatus: 'active',
  });

  return true;
};

export const stopAgent = (agentId: string, userId: string, reason?: string): boolean => {
  const agent = getAgentById(agentId);
  if (!agent) return false;

  const previousStatus = agent.status;
  agent.status = 'stopped';
  saveAgent(agent);

  addControlAction({
    agentId,
    action: 'stop',
    performedBy: userId,
    timestamp: new Date(),
    reason,
    previousStatus,
    newStatus: 'stopped',
  });

  return true;
};

export const updateAgentConfiguration = (agentId: string, config: Partial<AIAgent['configuration']>, userId: string): boolean => {
  const agent = getAgentById(agentId);
  if (!agent) return false;

  const previousStatus = agent.status;
  agent.configuration = { ...agent.configuration, ...config };
  saveAgent(agent);

  addControlAction({
    agentId,
    action: 'configure',
    performedBy: userId,
    timestamp: new Date(),
    reason: 'Configuration updated',
    previousStatus,
    newStatus: agent.status,
  });

  return true;
};

// Initialize with sample agents (for demo purposes)
export const initializeSampleAgents = (userId: string): void => {
  const existingAgents = getAllAgents();
  if (existingAgents.length > 0) return; // Already initialized

  const sampleAgents: AIAgent[] = [
    {
      id: 'agent-001',
      name: 'Contract Generator Agent',
      type: 'contract_generator',
      description: 'Automatically generates contractor agreements based on templates',
      status: 'active',
      createdAt: new Date('2025-01-15'),
      lastActiveAt: new Date(),
      createdBy: userId,
      configuration: {
        ...DEFAULT_AGENT_CONFIG,
        autoStart: true,
        maxConcurrentRuns: 3,
        systemPrompt: "You are an expert legal assistant specializing in contractor agreements. Generate clear, professional contracts that comply with employment law.",
        instructions: "When generating contracts:\n1. Use formal legal language\n2. Include all required clauses\n3. Ensure compliance with local regulations\n4. Maintain consistency across all contracts",
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 3000,
      },
      metrics: {
        totalRuns: 127,
        successRate: 98.4,
        averageExecutionTime: 2340,
        lastRunTime: new Date(),
        errorCount: 2,
        totalProcessedItems: 127,
      },
      activities: [],
    },
    {
      id: 'agent-002',
      name: 'Email Drafter Agent',
      type: 'custom',
      description: 'Drafts professional emails to contractors and clients',
      status: 'active',
      createdAt: new Date('2025-01-10'),
      lastActiveAt: new Date(Date.now() - 3600000),
      createdBy: userId,
      configuration: {
        ...DEFAULT_AGENT_CONFIG,
        systemPrompt: "You are a professional business communication specialist. Draft clear, concise, and friendly emails.",
        instructions: "When drafting emails:\n1. Use professional but warm tone\n2. Keep emails concise and to the point\n3. Include clear call-to-actions\n4. Proofread for grammar and clarity\n5. Personalize based on recipient context",
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
      },
      metrics: {
        totalRuns: 543,
        successRate: 99.2,
        averageExecutionTime: 890,
        lastRunTime: new Date(Date.now() - 3600000),
        errorCount: 4,
        totalProcessedItems: 2156,
      },
      activities: [],
    },
    {
      id: 'agent-003',
      name: 'Compliance Checker',
      type: 'compliance_checker',
      description: 'Ensures all contractor documentation meets regulatory requirements',
      status: 'paused',
      createdAt: new Date('2025-01-20'),
      lastActiveAt: new Date(Date.now() - 86400000),
      createdBy: userId,
      configuration: {
        ...DEFAULT_AGENT_CONFIG,
        notifyOnError: true,
        systemPrompt: "You are a compliance expert specializing in contractor management regulations. Verify all documentation meets legal requirements.",
        instructions: "Check documents for:\n1. Required fields and signatures\n2. Regulatory compliance\n3. Data accuracy\n4. Missing information\n5. Flag any potential legal issues",
        model: 'gpt-4',
        temperature: 0.2,
        maxTokens: 2000,
      },
      metrics: {
        totalRuns: 89,
        successRate: 100,
        averageExecutionTime: 4560,
        lastRunTime: new Date(Date.now() - 86400000),
        errorCount: 0,
        totalProcessedItems: 267,
      },
      activities: [],
    },
    {
      id: 'agent-004',
      name: 'Document Analyzer',
      type: 'document_analyzer',
      description: 'Analyzes uploaded documents for completeness and validity',
      status: 'error',
      createdAt: new Date('2025-01-25'),
      lastActiveAt: new Date(Date.now() - 7200000),
      createdBy: userId,
      configuration: {
        ...DEFAULT_AGENT_CONFIG,
        systemPrompt: "You are a document analysis specialist. Extract and validate information from uploaded documents.",
        instructions: "Analyze documents to:\n1. Extract key information\n2. Verify document authenticity\n3. Check for completeness\n4. Identify potential issues\n5. Provide structured data output",
        model: 'claude-3-sonnet',
        temperature: 0.3,
        maxTokens: 2500,
      },
      metrics: {
        totalRuns: 34,
        successRate: 88.2,
        averageExecutionTime: 5670,
        lastRunTime: new Date(Date.now() - 7200000),
        errorCount: 4,
        totalProcessedItems: 102,
      },
      activities: [],
    },
  ];

  localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(sampleAgents));

  // Add some sample activities
  const sampleActivities: AgentActivity[] = [
    {
      id: 'activity-001',
      agentId: 'agent-001',
      timestamp: new Date(),
      action: 'Generated contract',
      details: 'Generated contract for John Smith - Project Alpha',
      status: 'success',
    },
    {
      id: 'activity-002',
      agentId: 'agent-002',
      timestamp: new Date(Date.now() - 1800000),
      action: 'Validated timesheet',
      details: 'Validated 24 timesheet entries for week 4',
      status: 'success',
    },
    {
      id: 'activity-003',
      agentId: 'agent-004',
      timestamp: new Date(Date.now() - 7200000),
      action: 'Document analysis failed',
      details: 'Unable to parse PDF document - corrupted file',
      status: 'error',
      metadata: { fileName: 'contractor_id.pdf', errorCode: 'PARSE_ERROR' },
    },
  ];

  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(sampleActivities));
}
