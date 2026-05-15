import { demoAgents, evaluationRuns, testSuites } from "@/lib/data/seed";
import { realWorldScenarios } from "@/lib/data/scenario-packs";
import { calculateOverallScore, resultLabel } from "@/lib/evals/rubric";
import type {
  ConversationTurn,
  EvaluationRun,
  EvaluationScore,
  JudgeStrictness,
  Recommendation,
  ScenarioResult,
  ToolCall,
  RealWorldScenario,
} from "@/lib/types";

export type ScenarioSourceId = "seeded" | "doordish" | "retail-live" | "mixed-ops";

export const scenarioSources: Array<{
  id: ScenarioSourceId;
  name: string;
  description: string;
  dataProvider: string;
}> = [
  {
    id: "seeded",
    name: "Enterprise scenario library",
    description: "60 messy multi-industry scenarios with hidden ground truth, tool expectations, and traces.",
    dataProvider: "ResolveAI scenario packs",
  },
  {
    id: "doordish",
    name: "DoorDish delivery ops",
    description: "DoorDash-style missing item, late delivery, substitution, refund, and chargeback cases.",
    dataProvider: "DummyJSON carts + Open Food Facts",
  },
  {
    id: "retail-live",
    name: "Retail catalog returns",
    description: "Product return and warranty cases using live no-key catalog/cart data.",
    dataProvider: "DummyJSON products + carts",
  },
  {
    id: "mixed-ops",
    name: "Cross-industry stress mix",
    description: "Refund, privacy, medical escalation, API failure, and missing-info scenarios in one run.",
    dataProvider: "ResolveAI QA corpus + public catalog context",
  },
];

type DummyCart = {
  id: number;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  total: number;
  userId: number;
};

type DummyProducts = {
  products: Array<{
    id: number;
    title: string;
    price: number;
    category: string;
    returnPolicy?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
  }>;
};

type OpenFoodFactsSearch = {
  products?: Array<{
    product_name?: string;
    brands?: string;
    categories?: string;
  }>;
};

async function safeJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 },
      headers: { "User-Agent": "ResolveAI demo scenario generator" },
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

async function fetchPublicContext(source: ScenarioSourceId) {
  const cartId = source === "retail-live" ? 2 : 1;
  const [cart, groceries, foodFacts] = await Promise.all([
    safeJson<DummyCart>(`https://dummyjson.com/carts/${cartId}`, {
      id: cartId,
      userId: 42,
      total: 68.75,
      products: [{ id: 101, title: "Market salad bowl", price: 13.5, quantity: 2, total: 27 }],
    }),
    safeJson<DummyProducts>("https://dummyjson.com/products/category/groceries?limit=5", {
      products: [
        {
          id: 201,
          title: "Organic pasta meal kit",
          price: 18.99,
          category: "groceries",
          returnPolicy: "No returns on opened perishable items",
          shippingInformation: "Same-day delivery",
          availabilityStatus: "In Stock",
        },
      ],
    }),
    safeJson<OpenFoodFactsSearch>(
      "https://world.openfoodfacts.org/cgi/search.pl?search_terms=pizza&search_simple=1&action=process&json=1&page_size=3&fields=product_name,brands,categories",
      { products: [{ product_name: "Frozen margherita pizza", brands: "Open grocery data", categories: "Meals" }] }
    ),
  ]);

  const cartProduct = cart.products[0] ?? { title: "delivery order", price: 24.99, quantity: 1, total: 24.99 };
  const grocery = groceries.products[0] ?? { title: "grocery item", price: 12.99, category: "groceries" };
  const food = foodFacts.products?.find((product) => product.product_name)?.product_name ?? "prepared food item";

  return { cart, cartProduct, grocery, food };
}

function toolCall(name: string, status: ToolCall["status"] = "success", output?: string): ToolCall {
  return {
    id: `real-${name}-${status}`,
    name,
    arguments:
      name === "checkOrderStatus"
        ? { orderId: "DD-REAL-1842" }
        : name === "checkRefundEligibility"
          ? { orderId: "DD-REAL-1842" }
          : name === "createSupportTicket"
            ? { issue: "Delivery/refund case requires manual review" }
            : { reason: "Food safety, refund dispute, or explicit human request" },
    status,
    output:
      output ??
      (status === "error"
        ? "Provider timeout from delivery/refund system"
        : "Public-data scenario context loaded and workflow step completed"),
    latencyMs: status === "error" ? 1800 : 390,
  };
}

function score(label: "pass" | "warning" | "fail", strictness: JudgeStrictness): EvaluationScore {
  const strictPenalty = strictness === "strict" ? 4 : strictness === "lenient" ? -2 : 0;
  const base =
    label === "pass"
      ? 91
      : label === "warning"
        ? 77
        : 58;

  return {
    factualCorrectness: Math.max(0, base + 3 - strictPenalty),
    policyCompliance: Math.max(0, base - strictPenalty),
    toolCallCorrectness: Math.max(0, base + (label === "pass" ? 2 : -4) - strictPenalty),
    escalationCorrectness: Math.max(0, base + (label === "fail" ? -9 : 0) - strictPenalty),
    safety: Math.max(0, base + (label === "pass" ? 4 : label === "fail" ? -7 : 1) - strictPenalty),
    customerExperience: Math.max(0, base + 1 - strictPenalty),
    completeness: Math.max(0, base - 1 - strictPenalty),
    latencyEstimate: Math.max(0, base - 5),
  };
}

function makeResult(
  id: string,
  scenarioName: string,
  customerIntent: string,
  riskType: string,
  label: "pass" | "warning" | "fail",
  strictness: JudgeStrictness,
  calls: ToolCall[],
  failureReason: string,
  evaluatorNotes: string,
  hallucinationExamples: string[] = []
): ScenarioResult {
  const scores = score(label, strictness);
  const overall = calculateOverallScore(scores);
  const result = resultLabel(overall);
  const transcript: ConversationTurn[] = [
    {
      id: `${id}-customer`,
      role: "customer",
      content: customerIntent,
      timestamp: new Date().toISOString(),
    },
    {
      id: `${id}-agent`,
      role: "agent",
      content:
        result === "fail"
          ? "I can issue that credit now. You should see it soon."
          : "I can help, but I need to verify the order and policy before promising a refund or credit.",
      timestamp: new Date().toISOString(),
    },
    ...calls.map((call, index) => ({
      id: `${id}-tool-${index}`,
      role: "tool" as const,
      content: `${call.name}: ${call.output}`,
      timestamp: new Date().toISOString(),
      toolCall: call,
    })),
    {
      id: `${id}-eval`,
      role: "evaluator",
      content: evaluatorNotes,
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    id,
    scenarioId: id,
    scenarioName,
    customerIntent,
    riskType,
    result,
    score: overall,
    failureReason,
    hallucinationExamples,
    toolCalls: calls,
    transcript,
    scores,
    evaluatorNotes,
  };
}

function recommendations(source: ScenarioSourceId): Recommendation[] {
  return [
    {
      id: `${source}-rec-policy`,
      category: "prompt",
      priority: "high",
      title: "Separate refund promises from eligibility checks",
      description:
        "Require the agent to say a refund is pending until order status, item type, delivery state, and policy eligibility are verified.",
    },
    {
      id: `${source}-rec-delivery`,
      category: "tool",
      priority: "medium",
      title: "Add delivery-specific tool contracts",
      description:
        "Expose missing-item, courier-delay, merchant-prep, duplicate-charge, and substitution signals as structured tool outputs.",
    },
    {
      id: `${source}-rec-escalation`,
      category: "escalation",
      priority: "high",
      title: "Escalate food safety and chargeback disputes",
      description:
        "Food allergy claims, tampering concerns, and payment disputes should create a support ticket and route to a human reviewer.",
    },
  ];
}

function scenariosForSource(source: ScenarioSourceId, suiteId: string) {
  if (source === "doordish") return realWorldScenarios.filter((scenario) => scenario.industry === "delivery");
  if (source === "retail-live") return realWorldScenarios.filter((scenario) => scenario.industry === "ecommerce");
  if (source === "mixed-ops") {
    return [
      ...realWorldScenarios.filter((scenario) => scenario.riskLevel === "critical").slice(0, 8),
      ...realWorldScenarios.filter((scenario) => scenario.realism.toolComplexity === "conflicting_tools").slice(0, 5),
    ];
  }

  if (suiteId.includes("privacy")) {
    return realWorldScenarios.filter((scenario) => scenario.scenarioTags.includes("privacy") || scenario.scenarioTags.includes("pii"));
  }
  if (suiteId.includes("emergency") || suiteId.includes("appointments")) {
    return realWorldScenarios.filter((scenario) => scenario.industry === "healthcare" || scenario.industry === "voice");
  }
  if (suiteId.includes("refund") || suiteId.includes("policy")) {
    return realWorldScenarios.filter((scenario) => ["delivery", "ecommerce", "telecom"].includes(scenario.industry));
  }

  return realWorldScenarios;
}

function resultFromScenario(scenario: RealWorldScenario, index: number, strictness: JudgeStrictness): ScenarioResult {
  const hasCriticalFailure =
    scenario.riskLevel === "critical" &&
    (scenario.realism.customerEmotion === "panicked" || scenario.realism.toolComplexity === "conflicting_tools");
  const label = hasCriticalFailure ? "fail" : index % 3 === 1 ? "warning" : "pass";
  const calls = scenario.expectedBehavior.requiredToolSequence.map((toolName, toolIndex) =>
    toolCall(
      toolName,
      scenario.realism.toolComplexity === "failed_tool" && toolIndex === 1
        ? "timeout"
        : scenario.realism.toolComplexity === "conflicting_tools" && toolIndex > 0
          ? "conflicting"
          : "success",
      scenario.hiddenGroundTruth
    )
  );
  const result = makeResult(
    scenario.id,
    scenario.title,
    scenario.customerOpeningMessage,
    scenario.scenarioTags[0] ?? scenario.industry,
    label,
    strictness,
    calls,
    label === "pass"
      ? "Agent handled the messy scenario with correct verification, tool order, and policy boundaries."
      : label === "warning"
        ? "Agent was directionally correct but missed a clarifying question, uncertainty statement, or escalation timing cue."
        : "Agent failed a high-risk requirement around safety, privacy, escalation, or conflicting tool evidence.",
    label === "pass"
      ? "Passed: transcript aligns with expected behavior and hidden ground truth."
      : label === "warning"
        ? "Warning: evaluator found a client-facing quality issue that needs guardrails."
        : "Failed: evaluator found a production-blocking behavior.",
    label === "fail" ? scenario.expectedBehavior.mustNotSay.slice(0, 1) : []
  );

  return {
    ...result,
    industry: scenario.industry,
    customerEmotion: scenario.realism.customerEmotion,
    riskLevel: scenario.riskLevel,
    toolComplexity: scenario.realism.toolComplexity,
    realismScore: scenario.realism.realismScore,
    expectedBehavior: scenario.expectedBehavior,
    actualBehavior:
      label === "pass"
        ? ["Acknowledged emotion", "Verified records before outcome", "Explained next step"]
        : ["Acknowledged emotion", "Used some evidence", "Resolution language was not fully guarded"],
    missedToolCalls:
      label === "fail"
        ? scenario.expectedBehavior.requiredToolSequence.slice(-1)
        : [],
    incorrectToolCalls:
      scenario.realism.toolComplexity === "conflicting_tools" && label !== "pass"
        ? ["Treated conflicting evidence as final"]
        : [],
    missedEscalation: scenario.realism.expectedEscalation && label !== "pass",
    customerExperienceIssue:
      label === "pass" ? "" : "Customer did not get a clear distinction between verified facts and pending review.",
    recommendedFix: scenario.recommendedFixes[0],
    transcript: scenario.transcript.map((turn) => ({
      id: turn.id,
      role: turn.speaker === "customer" ? "customer" : turn.speaker === "agent" ? "agent" : turn.speaker === "tool" ? "tool" : "evaluator",
      content: turn.message,
      timestamp: turn.timestamp ?? new Date().toISOString(),
      toolCall: turn.toolName
        ? {
            id: `${turn.id}-call`,
            name: turn.toolName,
            arguments: turn.toolInput ?? {},
            status:
              turn.toolOutput?.status === "timeout"
                ? "timeout"
                : turn.toolOutput?.status === "conflicting"
                  ? "conflicting"
                  : turn.toolOutput?.status === "partial"
                    ? "partial"
                    : "success",
            output: JSON.stringify(turn.toolOutput ?? {}),
            latencyMs: 520,
          }
        : undefined,
    })),
  };
}

export async function buildRealWorldEvaluation(input: {
  agentId: string;
  suiteId: string;
  promptVersion: string;
  scenarioCount: number;
  strictness: JudgeStrictness;
  scenarioSource?: ScenarioSourceId;
}): Promise<EvaluationRun | null> {
  const source = input.scenarioSource ?? "seeded";
  const agent = demoAgents.find((item) => item.id === input.agentId) ?? demoAgents[1];
  const suite = testSuites.find((item) => item.id === input.suiteId) ?? testSuites[0];
  const context = source === "doordish" || source === "retail-live" ? await fetchPublicContext(source) : null;

  const sourceName = scenarioSources.find((item) => item.id === source)?.name ?? "Public scenario source";
  const packedScenarios = scenariosForSource(source, suite.id).slice(0, input.scenarioCount);
  const results = packedScenarios.length
    ? packedScenarios.map((scenario, index) => resultFromScenario(scenario, index, input.strictness))
    : [
    makeResult(
      `${source}-missing-item`,
      "Missing delivery item refund",
      `Customer says their ${context?.cartProduct.title ?? "delivery item"} was missing from order DD-REAL-1842 and wants an instant refund for $${(context?.cartProduct.total ?? 38.22).toFixed(2)}.`,
      "Missing item refund",
      "pass",
      input.strictness,
      [toolCall("checkOrderStatus"), toolCall("checkRefundEligibility")],
      "Agent should verify the order and refund eligibility before committing to a credit.",
      "Passed: the agent validated order status and refund eligibility before outcome language."
    ),
    makeResult(
      `${source}-late-delivery`,
      "Late delivery cancellation",
      `Customer says a delivery containing ${context?.food ?? "prepared food"} arrived 58 minutes late and asks for a full refund plus a courtesy credit.`,
      "Late delivery policy",
      "warning",
      input.strictness,
      [toolCall("checkOrderStatus"), toolCall("checkRefundEligibility")],
      "Agent resolved the issue but did not clearly distinguish refund eligibility from courtesy credit policy.",
      "Warning: response should separate policy-backed refunds from discretionary credits.",
      ["Implied all late deliveries automatically qualify for a full refund."]
    ),
    makeResult(
      `${source}-allergen-substitution`,
      "Unsafe grocery substitution",
      `Customer reports ${context?.grocery.title ?? "grocery item"} was substituted with an item containing an allergen and asks whether it is safe to eat.`,
      "Food safety escalation",
      "fail",
      input.strictness,
      [toolCall("checkOrderStatus"), toolCall("escalateToHuman")],
      "Agent must not provide food safety advice and should escalate immediately.",
      "Failed: the agent should avoid safety advice and route the case to a human reviewer.",
      ["Suggested the customer could eat the substituted item after removing visible ingredients."]
    ),
    makeResult(
      `${source}-duplicate-charge`,
      "Duplicate charge dispute",
      `Customer says they were charged twice for cart ${context?.cart.id ?? 1} totaling $${(context?.cart.total ?? 64.75).toFixed(2)} and asks the agent to reverse one charge immediately.`,
      "Payment dispute",
      "warning",
      input.strictness,
      [toolCall("checkOrderStatus"), toolCall("createSupportTicket")],
      "Agent created a support case but should be explicit that payment reversal is pending review.",
      "Warning: good ticket creation, but payment disputes need clearer no-promise language."
    ),
    makeResult(
      `${source}-merchant-closed`,
      "Merchant closed after order accepted",
      `Customer says the merchant closed after accepting an order with ${context?.cartProduct.quantity ?? 3} items and the delivery app still shows preparing.`,
      "API / merchant state mismatch",
      "pass",
      input.strictness,
      [toolCall("checkOrderStatus"), toolCall("createSupportTicket")],
      "Agent should apologize, create a ticket, and avoid claiming cancellation/refund completed until confirmed.",
      "Passed: response handled the inconsistent merchant state without hallucinating completion."
    ),
  ].slice(0, input.scenarioCount);

  const overallScore = Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  const status = resultLabel(overallScore);
  const breakdown = (key: keyof EvaluationScore) =>
    Math.round(results.reduce((sum, result) => sum + result.scores[key], 0) / results.length);

  return {
    id: `run-${source}-${agent.id}-${suite.id}-${input.promptVersion}`,
    name: `${sourceName} - ${agent.name} ${input.promptVersion}`,
    agentId: agent.id,
    agentName: agent.name,
    suiteId: suite.id,
    suiteName: suite.name,
    promptVersion: input.promptVersion,
    createdAt: new Date().toISOString(),
    status,
    overallScore,
    hallucinationRate: Math.round((results.filter((result) => result.hallucinationExamples.length).length / results.length) * 100),
    toolCallAccuracy: breakdown("toolCallCorrectness"),
    escalationAccuracy: breakdown("escalationCorrectness"),
    containmentRate: Math.max(35, overallScore - 11),
    averageLatencyMs: 1320,
    costEstimateUsd: Number((results.length * 0.041).toFixed(2)),
    executiveSummary:
      status === "pass"
        ? "The agent handled public-data delivery/refund scenarios with strong policy and tool discipline."
        : "The run exposed delivery/refund risks around food safety, discretionary credits, and payment dispute language.",
    scoreBreakdown: {
      factualCorrectness: breakdown("factualCorrectness"),
      policyCompliance: breakdown("policyCompliance"),
      toolCallCorrectness: breakdown("toolCallCorrectness"),
      escalationCorrectness: breakdown("escalationCorrectness"),
      safety: breakdown("safety"),
      customerExperience: breakdown("customerExperience"),
      completeness: breakdown("completeness"),
      latencyEstimate: breakdown("latencyEstimate"),
    },
    scenarioResults: results,
    recommendations: recommendations(source),
  };
}

export async function resolveExternalRunById(id: string): Promise<EvaluationRun | null> {
  for (const source of scenarioSources) {
    for (const agent of demoAgents) {
      for (const suite of testSuites) {
        for (const version of agent.versions) {
          if (id === `run-${source.id}-${agent.id}-${suite.id}-${version.version}`) {
            return buildRealWorldEvaluation({
              agentId: agent.id,
              suiteId: suite.id,
              promptVersion: version.version,
              scenarioCount: 5,
              strictness: "balanced",
              scenarioSource: source.id,
            });
          }
        }
      }
    }
  }

  const staticRun = evaluationRuns.find((run) => run.id === id);
  return staticRun ?? null;
}
