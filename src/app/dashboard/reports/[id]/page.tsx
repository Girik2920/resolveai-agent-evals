import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Lightbulb, ShieldCheck } from "lucide-react";
import { TranscriptViewer } from "@/components/reports/transcript-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { evaluationRuns, getRun } from "@/lib/data/seed";
import { badgeClass } from "@/lib/evals/rubric";

export function generateStaticParams() {
  return evaluationRuns.map((run) => ({ id: run.id }));
}

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = getRun(id);
  if (!run) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge className={badgeClass(run.status)}>{run.status}</Badge>
          <h1 className="mt-3 text-3xl font-semibold text-white">{run.name}</h1>
          <p className="mt-2 max-w-3xl text-white/55">{run.executiveSummary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["json", "csv", "markdown"].map((format) => (
            <Button key={format} asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link href={`/api/export-report?runId=${run.id}&format=${format}`}>
                <Download className="mr-2 h-4 w-4" />
                {format.toUpperCase()}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Overall score", run.overallScore],
          ["Tool-call accuracy", run.toolCallAccuracy],
          ["Escalation accuracy", run.escalationAccuracy],
          ["Containment rate", run.containmentRate],
        ].map(([label, value]) => (
          <Card key={label} className="glass-panel"><CardContent className="p-5"><p className="text-sm text-white/45">{label}</p><p className="mt-2 text-3xl font-semibold text-white">{value}%</p></CardContent></Card>
        ))}
      </div>
      <Card className="glass-panel">
        <CardHeader><CardTitle className="text-white">Score breakdown</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {Object.entries(run.scoreBreakdown).map(([key, value]) => (
            <div key={key}>
              <div className="mb-2 flex justify-between text-sm"><span className="capitalize text-white/60">{key.replace(/([A-Z])/g, " $1")}</span><span className="font-mono text-white">{value}</span></div>
              <Progress value={value} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="glass-panel">
        <CardHeader><CardTitle className="text-white">Scenario table</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Scenario</TableHead><TableHead>Customer intent</TableHead><TableHead>Risk</TableHead><TableHead>Result</TableHead><TableHead>Score</TableHead><TableHead>Failure reason</TableHead></TableRow></TableHeader>
            <TableBody>
              {run.scenarioResults.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell className="font-medium text-white">{scenario.scenarioName}</TableCell>
                  <TableCell className="max-w-xs text-white/55">{scenario.customerIntent}</TableCell>
                  <TableCell className="text-white/60">{scenario.riskType}</TableCell>
                  <TableCell><Badge className={badgeClass(scenario.result)}>{scenario.result}</Badge></TableCell>
                  <TableCell className="font-mono text-white">{scenario.score}</TableCell>
                  <TableCell className="max-w-sm text-white/55">{scenario.failureReason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-white"><ShieldCheck className="h-5 w-5 text-sky-300" />Transcript analysis</h2>
        <TranscriptViewer results={run.scenarioResults} />
      </div>
      <Card className="glass-panel">
        <CardHeader><CardTitle className="text-white">Recommendations</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {run.recommendations.map((rec) => (
            <div key={rec.id} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
              <Badge className={rec.priority === "high" ? "bg-red-500/15 text-red-100" : "bg-sky-500/15 text-sky-100"}>{rec.priority}</Badge>
              <h3 className="mt-3 flex items-center gap-2 font-medium text-white"><Lightbulb className="h-4 w-4 text-amber-200" />{rec.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{rec.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
