import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileWarning, ShieldAlert, TerminalSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { realWorldScenarios, getScenarioById } from "@/lib/data/scenario-packs";
import { realismBand } from "@/lib/evals/realism-score";

export function generateStaticParams() {
  return realWorldScenarios.map((scenario) => ({ id: scenario.id }));
}

export default async function ScenarioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = getScenarioById(id);
  if (!scenario) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
        <Link href="/dashboard/test-suites"><ArrowLeft className="mr-2 h-4 w-4" />Back to library</Link>
      </Button>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border-sky-400/30 bg-sky-500/15 text-sky-100">{scenario.industry}</Badge>
            <Badge className={scenario.riskLevel === "critical" ? "bg-red-500/15 text-red-100" : "bg-amber-500/15 text-amber-100"}>{scenario.riskLevel}</Badge>
            <Badge variant="outline" className="border-white/10 text-white/60">{realismBand(scenario.realism.realismScore)}</Badge>
          </div>
          <h1 className="text-3xl font-semibold text-white">{scenario.title}</h1>
          <p className="mt-2 max-w-4xl text-white/55">{scenario.description}</p>
        </div>
        <Card className="glass-panel min-w-60">
          <CardContent className="p-5">
            <p className="text-sm text-white/45">Realism score</p>
            <p className="mt-1 text-5xl font-semibold text-white">{scenario.realism.realismScore}</p>
            <p className="mt-2 text-sm text-white/50">{scenario.transcript.length} trace turns</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass-panel lg:col-span-2">
          <CardHeader><CardTitle className="text-white">Customer opening</CardTitle></CardHeader>
          <CardContent>
            <p className="rounded-md border border-white/10 bg-black/25 p-4 text-lg leading-8 text-white/80">&ldquo;{scenario.customerOpeningMessage}&rdquo;</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Customer context</p><p className="mt-2 text-sm leading-6 text-white/60">{scenario.customerContext}</p></div>
              <div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Hidden ground truth</p><p className="mt-2 text-sm leading-6 text-white/60">{scenario.hiddenGroundTruth}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader><CardTitle className="text-white">Realism metadata</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ["Emotion", scenario.realism.customerEmotion],
              ["Ambiguity", scenario.realism.ambiguityLevel],
              ["Business risk", scenario.realism.businessRisk],
              ["Policy risk", scenario.realism.policyRisk],
              ["Tool complexity", scenario.realism.toolComplexity.replaceAll("_", " ")],
              ["Expected escalation", scenario.realism.expectedEscalation ? "yes" : "no"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
                <span className="text-white/45">{label}</span>
                <span className="text-right text-white">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="expected" className="space-y-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="expected">Expected behavior</TabsTrigger>
          <TabsTrigger value="trace">Transcript trace</TabsTrigger>
          <TabsTrigger value="failures">Failure modes</TabsTrigger>
        </TabsList>
        <TabsContent value="expected">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              ["Required tool sequence", scenario.expectedBehavior.requiredToolSequence],
              ["Required questions", scenario.expectedBehavior.requiredQuestions],
              ["Must say", scenario.expectedBehavior.mustSay],
              ["Must not say", scenario.expectedBehavior.mustNotSay],
              ["Escalation triggers", scenario.expectedBehavior.escalationTriggers],
              ["Policy facts", scenario.expectedBehavior.policyFacts],
              ["Success criteria", scenario.expectedBehavior.successCriteria],
            ].map(([title, items]) => (
              <Card key={title as string} className="glass-panel">
                <CardHeader><CardTitle className="text-base text-white">{title as string}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {(items as string[]).map((item) => (
                    <div key={item} className="flex gap-2 rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm text-white/65">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="trace">
          <Card className="glass-panel">
            <CardContent className="space-y-3 p-5">
              {scenario.transcript.map((turn) => (
                <div key={turn.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-white/10 capitalize text-white/60">{turn.speaker}</Badge>
                    {turn.sentiment ? <Badge className="bg-violet-500/15 text-violet-100">{turn.sentiment}</Badge> : null}
                    {turn.toolName ? <Badge className="bg-sky-500/15 text-sky-100"><TerminalSquare className="mr-1 h-3 w-3" />{turn.toolName}</Badge> : null}
                  </div>
                  <p className="text-sm leading-6 text-white/70">{turn.message}</p>
                  {turn.toolOutput ? <pre className="mt-3 overflow-x-auto rounded-md bg-black/40 p-3 text-xs text-sky-100/75">{JSON.stringify(turn.toolOutput, null, 2)}</pre> : null}
                  {turn.evaluatorNote ? <p className="mt-2 text-xs text-amber-100/75">{turn.evaluatorNote}</p> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="failures">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="glass-panel">
              <CardHeader><CardTitle className="flex items-center gap-2 text-white"><FileWarning className="h-5 w-5 text-amber-300" />Common agent failures</CardTitle></CardHeader>
              <CardContent className="space-y-2">{scenario.commonAgentFailures.map((item) => <p key={item} className="rounded-md border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">{item}</p>)}</CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader><CardTitle className="flex items-center gap-2 text-white"><ShieldAlert className="h-5 w-5 text-sky-300" />Recommended fixes</CardTitle></CardHeader>
              <CardContent className="space-y-2">{scenario.recommendedFixes.map((item) => <p key={item} className="rounded-md border border-sky-400/20 bg-sky-500/10 p-3 text-sm text-sky-100">{item}</p>)}</CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
