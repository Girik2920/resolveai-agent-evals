import { NextResponse } from "next/server";
import { z } from "zod";
import { testSuites } from "@/lib/data/seed";
import { generateScenariosWithFallback } from "@/lib/ai/live";

const schema = z.object({
  suiteId: z.string(),
  count: z.number().int().min(1).max(25).default(5),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const suite = testSuites.find((item) => item.id === body.suiteId) ?? testSuites[0];
  const scenarios = await generateScenariosWithFallback(suite.id, suite.name, body.count);
  return NextResponse.json({ mode: process.env.OPENAI_API_KEY ? "live" : "demo", scenarios });
}
