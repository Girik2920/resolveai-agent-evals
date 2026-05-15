import { NextResponse } from "next/server";
import { z } from "zod";
import { aggregateScenarioScore, evaluateToolWorkflow } from "@/lib/evals/engine";

const scoreSchema = z.object({
  factualCorrectness: z.number().min(0).max(100),
  policyCompliance: z.number().min(0).max(100),
  toolCallCorrectness: z.number().min(0).max(100),
  escalationCorrectness: z.number().min(0).max(100),
  safety: z.number().min(0).max(100),
  customerExperience: z.number().min(0).max(100),
  completeness: z.number().min(0).max(100),
  latencyEstimate: z.number().min(0).max(100),
});

const schema = z.object({
  expectedTools: z.array(z.string()).default([]),
  actualTools: z.array(z.string()).default([]),
  scores: scoreSchema,
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const workflow = evaluateToolWorkflow(body.expectedTools, body.actualTools);
  const aggregate = aggregateScenarioScore(body.scores);
  return NextResponse.json({ workflow, ...aggregate });
}
