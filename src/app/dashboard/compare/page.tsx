import { ArrowUpRight, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { evaluationRuns } from "@/lib/data/seed";

export default function ComparePage() {
  const v1 = evaluationRuns.find((run) => run.id === "run-refund-v1")!;
  const v2 = evaluationRuns.find((run) => run.id === "run-refund-v2")!;
  const deltas = [
    ["Score", v2.overallScore - v1.overallScore],
    ["Hallucination rate", v1.hallucinationRate - v2.hallucinationRate],
    ["Tool-call accuracy", v2.toolCallAccuracy - v1.toolCallAccuracy],
    ["Escalation accuracy", v2.escalationAccuracy - v1.escalationAccuracy],
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Prompt comparison</h1>
        <p className="mt-2 text-white/55">Compare prompt versions, regressions, and transcript-level behavior before rollout.</p>
      </div>
      <Card className="glass-panel">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">E-commerce Refund Agent v1 vs v2</CardTitle>
          <Badge className="border-emerald-400/30 bg-emerald-500/15 text-emerald-100"><Trophy className="mr-1 h-3 w-3" />Winner: v2</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {deltas.map(([label, delta]) => (
            <div key={label as string} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-white/45">{label}</p>
              <p className="mt-2 flex items-center text-2xl font-semibold text-emerald-200"><ArrowUpRight className="mr-1 h-4 w-4" />{delta > 0 ? "+" : ""}{delta}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        {[v1, v2].map((run) => (
          <Card key={run.id} className="glass-panel">
            <CardHeader><CardTitle className="text-white">{run.promptVersion} - {run.overallScore}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-white/60">{run.executiveSummary}</p>
              <Separator className="my-4 bg-white/10" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/45">Hallucination</span><span>{run.hallucinationRate}%</span></div>
                <div className="flex justify-between"><span className="text-white/45">Tools</span><span>{run.toolCallAccuracy}%</span></div>
                <div className="flex justify-between"><span className="text-white/45">Escalation</span><span>{run.escalationAccuracy}%</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="warning" className="space-y-4">
        <TabsList className="bg-white/5"><TabsTrigger value="warning">Regression warnings</TabsTrigger><TabsTrigger value="transcripts">Side-by-side transcripts</TabsTrigger></TabsList>
        <TabsContent value="warning">
          <Card className="glass-panel"><CardContent className="space-y-3 p-5">{["v2 improves refund validation but still delays escalation when the customer repeatedly asks for a manager.", "v1 hallucinated policy exceptions in 2 scenarios; v2 reduced this to 0 in the seeded suite.", "Tool failure copy is now accurate, but support ticket SLA should be added to the knowledge base."].map((item) => <div key={item} className="rounded-md border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">{item}</div>)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="transcripts">
          <div className="grid gap-5 lg:grid-cols-2">{[v1, v2].map((run) => <Card key={run.id} className="glass-panel"><CardHeader><CardTitle className="text-white">{run.promptVersion} sample</CardTitle></CardHeader><CardContent className="space-y-3">{run.scenarioResults[0].transcript.slice(0, 3).map((turn) => <div key={turn.id} className="rounded-md border border-white/10 bg-black/25 p-3"><Badge variant="outline" className="mb-2 border-white/10 text-white/60">{turn.role}</Badge><p className="text-sm text-white/65">{turn.content}</p></div>)}</CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
