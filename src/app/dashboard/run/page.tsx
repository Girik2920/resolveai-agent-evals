import { RunEvaluationClient } from "@/components/dashboard/run-evaluation-client";

export default async function RunPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string; suite?: string }>;
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
      <RunEvaluationClient initialAgentId={params.agent} initialSuiteId={params.suite} />
    </div>
  );
}
