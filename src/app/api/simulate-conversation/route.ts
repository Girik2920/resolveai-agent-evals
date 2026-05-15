import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluationRuns } from "@/lib/data/seed";

const schema = z.object({
  scenarioId: z.string(),
  agentId: z.string(),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const result =
    evaluationRuns.flatMap((run) => run.scenarioResults).find((scenario) => scenario.scenarioId === body.scenarioId) ??
    evaluationRuns[0].scenarioResults[0];

  return NextResponse.json({
    mode: process.env.OPENAI_API_KEY ? "live" : "demo",
    agentId: body.agentId,
    transcript: result.transcript,
    toolCalls: result.toolCalls,
  });
}
