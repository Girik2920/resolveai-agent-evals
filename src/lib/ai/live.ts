import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import { generateDemoScenarios, runDemoEvaluation, type RunEvaluationInput } from "@/lib/evals/engine";

const scenarioSchema = z.object({
  scenarios: z.array(
    z.object({
      name: z.string(),
      customerIntent: z.string(),
      riskType: z.string(),
      expectedBehavior: z.string(),
      expectedTools: z.array(z.string()),
      expectedPolicyFacts: z.array(z.string()),
    })
  ),
});

export function isLiveMode() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateScenariosWithFallback(suiteId: string, suiteName: string, count: number) {
  if (!isLiveMode()) return generateDemoScenarios(suiteId, count);

  try {
    const { output } = await generateText({
      model: openai("gpt-4.1-mini"),
      output: Output.object({ schema: scenarioSchema }),
      prompt: `Generate ${count} customer support agent evaluation scenarios for this suite: ${suiteName}. Include adversarial, policy, tool-call, and escalation risks where relevant.`,
    });

    return output.scenarios.map((scenario, index) => ({
      id: `live-${suiteId}-${index + 1}`,
      suiteId,
      name: scenario.name,
      customerIntent: scenario.customerIntent,
      riskType: scenario.riskType,
      riskLevel: "high" as const,
      expectedBehavior: scenario.expectedBehavior,
      expectedTools: scenario.expectedTools,
      expectedPolicyFacts: scenario.expectedPolicyFacts,
    }));
  } catch {
    return generateDemoScenarios(suiteId, count);
  }
}

export async function runEvaluationWithFallback(input: RunEvaluationInput) {
  if (!isLiveMode()) return runDemoEvaluation(input);
  return runDemoEvaluation(input);
}
