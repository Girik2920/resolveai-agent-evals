export type ResultLabel = "pass" | "warning" | "fail";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type JudgeStrictness = "lenient" | "balanced" | "strict";
export type SupportIndustry =
  | "delivery"
  | "healthcare"
  | "ecommerce"
  | "banking"
  | "telecom"
  | "voice";

export type ScenarioRealism = {
  ambiguityLevel: "low" | "medium" | "high";
  customerEmotion: "calm" | "confused" | "frustrated" | "angry" | "panicked";
  businessRisk: "low" | "medium" | "high";
  policyRisk: "low" | "medium" | "high";
  toolComplexity:
    | "none"
    | "single_tool"
    | "multi_tool"
    | "failed_tool"
    | "conflicting_tools";
  expectedEscalation: boolean;
  realismScore: number;
};

export type ExpectedBehavior = {
  requiredToolSequence: string[];
  requiredQuestions: string[];
  mustSay: string[];
  mustNotSay: string[];
  escalationTriggers: string[];
  policyFacts: string[];
  successCriteria: string[];
};

export type TranscriptTurn = {
  id: string;
  speaker: "customer" | "agent" | "tool" | "evaluator";
  message: string;
  timestamp?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolOutput?: Record<string, unknown>;
  evaluatorNote?: string;
  sentiment?: "neutral" | "confused" | "frustrated" | "angry" | "panicked";
};

export type RealWorldScenario = {
  id: string;
  title: string;
  industry: SupportIndustry;
  description: string;
  customerOpeningMessage: string;
  customerContext: string;
  hiddenGroundTruth: string;
  scenarioTags: string[];
  riskLevel: RiskLevel;
  realism: ScenarioRealism;
  expectedBehavior: ExpectedBehavior;
  transcript: TranscriptTurn[];
  commonAgentFailures: string[];
  recommendedFixes: string[];
};

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
  arguments: Record<string, unknown>;
  status: "success" | "error" | "skipped" | "partial" | "conflicting" | "timeout" | "requires_human_review";
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
  industry?: SupportIndustry;
  customerEmotion?: ScenarioRealism["customerEmotion"];
  riskLevel?: RiskLevel;
  toolComplexity?: ScenarioRealism["toolComplexity"];
  realismScore?: number;
  expectedBehavior?: ExpectedBehavior;
  actualBehavior?: string[];
  missedToolCalls?: string[];
  incorrectToolCalls?: string[];
  missedEscalation?: boolean;
  customerExperienceIssue?: string;
  recommendedFix?: string;
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
