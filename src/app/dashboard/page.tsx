import { AlertTriangle, Banknote, Bot, Clock, Gauge, Mic, ShieldCheck, Sparkles, TerminalSquare, Workflow } from "lucide-react";
import Link from "next/link";
import { OverviewCharts } from "@/components/charts/overview-charts";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { evaluationRuns } from "@/lib/data/seed";
import { scenarioLibraryStats } from "@/lib/data/scenario-packs";
import { badgeClass } from "@/lib/evals/rubric";

export default function DashboardPage() {
  const totalRuns = evaluationRuns.length;
  const averageScore = Math.round(evaluationRuns.reduce((sum, run) => sum + run.overallScore, 0) / totalRuns);
  const latest = evaluationRuns[0];
  const failedScenarios = evaluationRuns.flatMap((run) => run.scenarioResults.filter((scenario) => scenario.result !== "pass")).slice(0, 5);
  const libraryStats = scenarioLibraryStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge className="mb-3 border-sky-400/30 bg-sky-500/15 text-sky-100">Demo workspace</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Agent readiness overview</h1>
          <p className="mt-2 max-w-2xl text-white/55">
            Monitor score trends, scenario realism, hallucinations, tool-call quality, escalation behavior, containment, latency, and cost before launch.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-sky-500 to-violet-500 text-white">
          <Link href="/dashboard/run">Run evaluation</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total test runs" value={`${totalRuns}`} detail="5 seeded reports" icon={Bot} tone="blue" />
        <MetricCard label="Average score" value={`${averageScore}`} detail="+12 pts over 6 days" icon={Gauge} tone="green" />
        <MetricCard label="Hallucination rate" value={`${latest.hallucinationRate}%`} detail="Across latest suite" icon={AlertTriangle} tone="amber" />
        <MetricCard label="Tool-call accuracy" value={`${latest.toolCallAccuracy}%`} detail="Order and necessity checked" icon={TerminalSquare} tone="violet" />
        <MetricCard label="Escalation accuracy" value={`${latest.escalationAccuracy}%`} detail="Human handoff behavior" icon={ShieldCheck} tone="green" />
        <MetricCard label="Containment rate" value={`${latest.containmentRate}%`} detail="Resolved without human" icon={Sparkles} tone="blue" />
        <MetricCard label="Average latency" value={`${latest.averageLatencyMs}ms`} detail="Simulated end-to-end" icon={Clock} tone="amber" />
        <MetricCard label="Cost estimate" value={`$${latest.costEstimateUsd}`} detail="Per regression run" icon={Banknote} tone="violet" />
        <MetricCard label="Scenario realism" value={`${libraryStats.averageRealism}`} detail="Average across 60 scenarios" icon={Workflow} tone="blue" />
        <MetricCard label="High-risk pass rate" value="68%" detail={`${libraryStats.highRiskCount} high-risk scenarios`} icon={ShieldCheck} tone="amber" />
        <MetricCard label="Voice scenarios" value={`${libraryStats.voiceCount}`} detail="Call transcript evals ready" icon={Mic} tone="violet" />
        <MetricCard label="Escalation failures" value="7" detail="Across latest regression set" icon={AlertTriangle} tone="red" />
        <MetricCard label="Tool mismatches" value={`${libraryStats.toolMismatchCandidates}`} detail="Conflict/failure candidates" icon={TerminalSquare} tone="amber" />
        <MetricCard label="Readiness trend" value="+14%" detail="Pilot-ready score movement" icon={Gauge} tone="green" />
      </div>
      <OverviewCharts />
      <Card className="glass-panel">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent failed scenarios</CardTitle>
          <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link href="/dashboard/reports">View reports</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {failedScenarios.map((scenario) => (
            <div key={scenario.id} className="flex flex-col gap-3 rounded-md border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-white">{scenario.scenarioName}</p>
                <p className="mt-1 text-sm text-white/50">{scenario.failureReason}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={badgeClass(scenario.result)}>{scenario.result}</Badge>
                <Badge variant="outline" className="border-white/10 text-white/60">{scenario.score}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
