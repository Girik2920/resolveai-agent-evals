import { demoAgents, evaluationRuns, getSuiteScenarios, testSuites } from "@/lib/data/seed";
import { buildRealWorldEvaluation, resolveExternalRunById, type ScenarioSourceId } from "@/lib/data/real-world";
import { calculateOverallScore, resultLabel } from "@/lib/evals/rubric";
import type { EvaluationRun, JudgeStrictness } from "@/lib/types";

export type RunEvaluationInput = {
  agentId: string;
  promptVersion: string;
  suiteId: string;
  scenarioCount: number;
  strictness: JudgeStrictness;
  simulateApiFailures: boolean;
  includePromptInjection: boolean;
  scenarioSource?: ScenarioSourceId;
};

export function runDemoEvaluation(input: RunEvaluationInput): EvaluationRun {
  const agent = demoAgents.find((item) => item.id === input.agentId) ?? demoAgents[1];
  const suite = testSuites.find((item) => item.id === input.suiteId) ?? testSuites[0];
  const compatible = evaluationRuns.find(
    (run) => run.agentId === agent.id && run.suiteId === suite.id && run.promptVersion === input.promptVersion
  );

  if (compatible) return compatible;

  const fallback = evaluationRuns.find((run) => run.suiteId === suite.id) ?? evaluationRuns[0];
  return {
    ...fallback,
    id: `run-demo-${agent.id}-${suite.id}-${input.promptVersion}`,
    name: `${suite.name} - ${agent.name} ${input.promptVersion}`,
    agentId: agent.id,
    agentName: agent.name,
    suiteId: suite.id,
    suiteName: suite.name,
    promptVersion: input.promptVersion,
    createdAt: new Date().toISOString(),
    scenarioResults: fallback.scenarioResults.slice(0, input.scenarioCount),
  };
}

export async function runEvaluation(input: RunEvaluationInput): Promise<EvaluationRun> {
  const externalRun = await buildRealWorldEvaluation(input);
  return externalRun ?? runDemoEvaluation(input);
}

export async function resolveEvaluationRun(id: string): Promise<EvaluationRun | null> {
  const seededRun = evaluationRuns.find((run) => run.id === id);
  if (seededRun) return seededRun;

  const externalRun = await resolveExternalRunById(id);
  if (externalRun) return externalRun;

  for (const agent of demoAgents) {
    for (const suite of testSuites) {
      for (const version of agent.versions) {
        if (id === `run-demo-${agent.id}-${suite.id}-${version.version}`) {
          return runDemoEvaluation({
            agentId: agent.id,
            suiteId: suite.id,
            promptVersion: version.version,
            scenarioCount: 5,
            strictness: "balanced",
            simulateApiFailures: true,
            includePromptInjection: true,
            scenarioSource: "seeded",
          });
        }
      }
    }
  }

  return null;
}

export function generateDemoScenarios(suiteId: string, count = 5) {
  return getSuiteScenarios(suiteId).slice(0, count);
}

export function evaluateToolWorkflow(expectedTools: string[], actualTools: string[]) {
  const missing = expectedTools.filter((tool) => !actualTools.includes(tool));
  const extraHighRisk = actualTools.filter(
    (tool) =>
      !expectedTools.includes(tool) &&
      ["bookAppointment", "checkRefundEligibility", "sendConfirmationSMS"].includes(tool)
  );
  const orderMatches = expectedTools.every((tool, index) => actualTools[index] === tool);

  return {
    passed: missing.length === 0 && extraHighRisk.length === 0 && orderMatches,
    missing,
    extraHighRisk,
    orderMatches,
  };
}

export function aggregateScenarioScore(scores: EvaluationRun["scenarioResults"][number]["scores"]) {
  const overall = calculateOverallScore(scores);
  return {
    overall,
    label: resultLabel(overall),
  };
}
