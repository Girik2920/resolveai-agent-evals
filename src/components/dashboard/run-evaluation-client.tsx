"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FlaskConical, Loader2, ShieldAlert, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { demoAgents, testSuites } from "@/lib/data/seed";

const steps = [
  "Generating scenarios",
  "Simulating customers",
  "Running target agent",
  "Validating tool calls",
  "Scoring results",
  "Building report",
];

export function RunEvaluationClient() {
  const router = useRouter();
  const [agentId, setAgentId] = useState(demoAgents[1].id);
  const agent = useMemo(() => demoAgents.find((item) => item.id === agentId) ?? demoAgents[1], [agentId]);
  const [promptVersion, setPromptVersion] = useState(agent.versions.at(-1)?.version ?? "v2");
  const [suiteId, setSuiteId] = useState(testSuites[0].id);
  const [scenarioCount, setScenarioCount] = useState([5]);
  const [strictness, setStrictness] = useState("balanced");
  const [apiFailures, setApiFailures] = useState(true);
  const [promptInjection, setPromptInjection] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  async function runEvaluation() {
    setRunning(true);
    setProgress(6);
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 420));
      setProgress(Math.round(((i + 1) / steps.length) * 100));
    }
    const response = await fetch("/api/run-evaluation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        promptVersion,
        suiteId,
        scenarioCount: scenarioCount[0],
        strictness,
        simulateApiFailures: apiFailures,
        includePromptInjection: promptInjection,
      }),
    });
    const data = (await response.json()) as { runId: string };
    router.push(`/dashboard/reports/${data.runId}`);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-white">Configure evaluation run</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label>Agent</Label>
            <Select
              value={agentId}
              onValueChange={(value) => {
                setAgentId(value);
                const nextAgent = demoAgents.find((item) => item.id === value);
                setPromptVersion(nextAgent?.versions.at(-1)?.version ?? "v2");
              }}
            >
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {demoAgents.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Prompt version</Label>
            <Select value={promptVersion} onValueChange={setPromptVersion}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agent.versions.map((version) => (
                  <SelectItem key={version.id} value={version.version}>
                    {version.version} - {version.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Test suite</Label>
            <Select value={suiteId} onValueChange={setSuiteId}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {testSuites.map((suite) => (
                  <SelectItem key={suite.id} value={suite.id}>
                    {suite.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Number of scenarios</Label>
              <Badge variant="outline" className="border-white/10 text-white/70">
                {scenarioCount[0]}
              </Badge>
            </div>
            <Slider value={scenarioCount} onValueChange={setScenarioCount} min={3} max={12} step={1} />
          </div>
          <div className="grid gap-2">
            <Label>Judge strictness</Label>
            <Select value={strictness} onValueChange={setStrictness}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lenient">Lenient</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="strict">Strict</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div>
              <Label>Simulate API failures</Label>
              <p className="text-sm text-white/50">Injects upstream timeouts and partial tool responses.</p>
            </div>
            <Switch checked={apiFailures} onCheckedChange={setApiFailures} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div>
              <Label>Include prompt injection</Label>
              <p className="text-sm text-white/50">Adds adversarial requests to override system policy.</p>
            </div>
            <Switch checked={promptInjection} onCheckedChange={setPromptInjection} />
          </div>
          <Button onClick={runEvaluation} disabled={running} className="bg-gradient-to-r from-sky-500 to-violet-500 text-white">
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FlaskConical className="mr-2 h-4 w-4" />}
            Run evaluation
          </Button>
        </CardContent>
      </Card>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-white">Evaluation pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-5" />
          <div className="space-y-3">
            {steps.map((step, index) => {
              const complete = progress >= ((index + 1) / steps.length) * 100;
              const active = running && !complete && progress >= (index / steps.length) * 100;
              return (
                <div key={step} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3">
                  {complete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-300" />
                  ) : (
                    <Workflow className="h-4 w-4 text-white/35" />
                  )}
                  <span className="text-sm text-white/70">{step}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-md border border-violet-400/20 bg-violet-500/10 p-4">
            <div className="flex items-center gap-2 text-violet-100">
              <ShieldAlert className="h-4 w-4" />
              <p className="font-medium">Live mode ready</p>
            </div>
            <p className="mt-2 text-sm text-violet-100/65">
              Add OPENAI_API_KEY to switch scenario generation to AI SDK structured outputs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
