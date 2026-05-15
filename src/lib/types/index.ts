export type ResultLabel = "pass" | "warning" | "fail";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type JudgeStrictness = "lenient" | "balanced" | "strict";

export type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  risk: RiskLevel;
  inputSchema: Record<string, string>;
};

export type KnowledgeBaseDocument = {
  id: string;
  agentId: string;
  title: string;
  content: string;
  policyFacts: string[];
  updatedAt: string;
};

export type AgentVersion = {
  id: string;
  agentId: string;
  version: string;
  label: string;
  systemPrompt: string;
  createdAt: string;
  notes: string;
  score: number;
};

export type Agent = {
  id: string;
  name: string;
  industry: string;
  description: string;
  model: string;
  status: "ready" | "testing" | "needs-review";
  tools: ToolDefinition[];
  knowledgeBase: KnowledgeBaseDocument[];
  versions: AgentVersion[];
};

export type TestSuite = {
  id: string;
  name: string;
  description: string;
  scenarioIds: string[];
  riskLevel: RiskLevel;
  lastRunScore: number;
  category: string;
};

export type TestScenario = {
  id: string;
  suiteId: string;
  name: string;
  customerIntent: string;
  riskType: string;
  riskLevel: RiskLevel;
  expectedBehavior: string;
  expectedTools: string[];
  expectedPolicyFacts: string[];
  includesPromptInjection?: boolean;
  includesApiFailure?: boolean;
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, string | number | boolean>;
  status: "success" | "error" | "skipped";
  output: string;
  latencyMs: number;
};

export type ConversationTurn = {
  id: string;
  role: "customer" | "agent" | "tool" | "evaluator";
  content: string;
  timestamp: string;
  toolCall?: ToolCall;
};

export type EvaluationScore = {
  factualCorrectness: number;
  policyCompliance: number;
  toolCallCorrectness: number;
  escalationCorrectness: number;
  safety: number;
  customerExperience: number;
  completeness: number;
  latencyEstimate: number;
};

export type ScenarioResult = {
  id: string;
  scenarioId: string;
  scenarioName: string;
  customerIntent: string;
  riskType: string;
  result: ResultLabel;
  score: number;
  failureReason: string;
  hallucinationExamples: string[];
  toolCalls: ToolCall[];
  transcript: ConversationTurn[];
  scores: EvaluationScore;
  evaluatorNotes: string;
};

export type Recommendation = {
  id: string;
  category:
    | "prompt"
    | "tool"
    | "knowledge-base"
    | "escalation"
    | "safety"
    | "workflow";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
};

export type EvaluationRun = {
  id: string;
  name: string;
  agentId: string;
  agentName: string;
  suiteId: string;
  suiteName: string;
  promptVersion: string;
  createdAt: string;
  status: ResultLabel;
  overallScore: number;
  hallucinationRate: number;
  toolCallAccuracy: number;
  escalationAccuracy: number;
  containmentRate: number;
  averageLatencyMs: number;
  costEstimateUsd: number;
  executiveSummary: string;
  scoreBreakdown: EvaluationScore;
  scenarioResults: ScenarioResult[];
  recommendations: Recommendation[];
};

export type ComparisonResult = {
  agentId: string;
  agentName: string;
  v1: EvaluationRun;
  v2: EvaluationRun;
  winner: "v1" | "v2";
  regressionWarnings: string[];
};
