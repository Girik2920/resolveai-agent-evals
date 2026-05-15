import { PlayCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ScenarioLibraryClient } from "@/components/dashboard/scenario-library-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { realWorldScenarios, scenarioLibraryStats } from "@/lib/data/scenario-packs";
import { testSuites } from "@/lib/data/seed";

export default function TestSuitesPage() {
  const stats = scenarioLibraryStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Test suites</h1>
        <p className="mt-2 max-w-3xl text-white/55">Prebuilt regression suites plus a 60-scenario enterprise library for messy chat and voice support cases.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-panel"><CardContent className="p-4"><p className="text-xs text-white/45">Scenario library</p><p className="mt-2 text-3xl font-semibold text-white">{stats.total}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-4"><p className="text-xs text-white/45">Avg realism</p><p className="mt-2 text-3xl font-semibold text-white">{stats.averageRealism}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-4"><p className="text-xs text-white/45">High-risk cases</p><p className="mt-2 text-3xl font-semibold text-white">{stats.highRiskCount}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-4"><p className="text-xs text-white/45">Voice calls</p><p className="mt-2 text-3xl font-semibold text-white">{stats.voiceCount}</p></CardContent></Card>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {testSuites.map((suite) => (
          <Card key={suite.id} className="glass-panel">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-white">{suite.name}</CardTitle>
                <Badge className={suite.riskLevel === "critical" ? "bg-red-500/15 text-red-100" : suite.riskLevel === "high" ? "bg-amber-500/15 text-amber-100" : "bg-sky-500/15 text-sky-100"}>
                  <ShieldAlert className="mr-1 h-3 w-3" />
                  {suite.riskLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="min-h-20 text-sm leading-6 text-white/60">{suite.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-xs text-white/45">Scenarios</p>
                  <p className="mt-1 text-xl font-semibold text-white">{suite.scenarioIds.length}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-xs text-white/45">Last score</p>
                  <p className="mt-1 text-xl font-semibold text-white">{suite.lastRunScore}</p>
                </div>
              </div>
              <Button asChild className="mt-5 w-full bg-white text-slate-950 hover:bg-white/90">
                <Link href={`/dashboard/run?suite=${suite.id}&source=${suite.id === "suite-refunds" ? "doordish" : "mixed-ops"}`}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run suite
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Real-world scenario library</h2>
          <p className="mt-2 text-white/55">Filter by industry, risk, emotion, ambiguity, tool complexity, expected escalation, realism, and voice/chat mode.</p>
        </div>
        <ScenarioLibraryClient scenarios={realWorldScenarios} />
      </div>
    </div>
  );
}
