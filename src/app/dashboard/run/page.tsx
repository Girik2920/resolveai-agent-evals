import { RunEvaluationClient } from "@/components/dashboard/run-evaluation-client";
import type { ScenarioSourceId } from "@/lib/data/real-world";

export default async function RunPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string; suite?: string; source?: ScenarioSourceId }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Run evaluation</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Configure an agent, prompt version, and risk suite. Demo mode executes a realistic seeded pipeline; live mode uses AI SDK hooks when an OpenAI key is present.
        </p>
      </div>
      <RunEvaluationClient initialAgentId={params.agent} initialSuiteId={params.suite} initialSource={params.source} />
    </div>
  );
}
