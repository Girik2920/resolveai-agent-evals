import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { evaluationRuns } from "@/lib/data/seed";
import { badgeClass } from "@/lib/evals/rubric";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Evaluation reports</h1>
        <p className="mt-2 text-white/55">Scorecards, scenario outcomes, transcripts, and recommendations from recent runs.</p>
      </div>
      <Card className="glass-panel">
        <CardHeader><CardTitle className="text-white">All runs</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Run</TableHead><TableHead>Agent</TableHead><TableHead>Suite</TableHead><TableHead>Score</TableHead><TableHead>Hallucination</TableHead><TableHead>Tool accuracy</TableHead><TableHead>Escalation</TableHead><TableHead>Created</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {evaluationRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium text-white">{run.name}</TableCell>
                  <TableCell className="text-white/60">{run.agentName}</TableCell>
                  <TableCell className="text-white/60">{run.suiteName}</TableCell>
                  <TableCell><Badge className={badgeClass(run.status)}>{run.overallScore}</Badge></TableCell>
                  <TableCell className="text-white/60">{run.hallucinationRate}%</TableCell>
                  <TableCell className="text-white/60">{run.toolCallAccuracy}%</TableCell>
                  <TableCell className="text-white/60">{run.escalationAccuracy}%</TableCell>
                  <TableCell className="text-white/50">{new Date(run.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right"><Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10"><Link href={`/dashboard/reports/${run.id}`}><FileText className="mr-2 h-4 w-4" />View</Link></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
