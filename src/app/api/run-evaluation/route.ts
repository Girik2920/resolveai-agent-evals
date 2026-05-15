import { NextResponse } from "next/server";
import { z } from "zod";
import { runEvaluationWithFallback } from "@/lib/ai/live";

const schema = z.object({
  agentId: z.string(),
  promptVersion: z.string(),
  suiteId: z.string(),
  scenarioCount: z.number().int().min(1).max(25),
  strictness: z.enum(["lenient", "balanced", "strict"]),
  simulateApiFailures: z.boolean(),
  includePromptInjection: z.boolean(),
  scenarioSource: z.enum(["seeded", "doordish", "retail-live", "mixed-ops"]).default("seeded"),
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const run = await runEvaluationWithFallback(input);
  return NextResponse.json({ mode: process.env.OPENAI_API_KEY ? "live" : "demo", runId: run.id, run });
}
