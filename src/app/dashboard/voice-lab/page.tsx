import Link from "next/link";
import { AudioLines, Clock, MessageSquareWarning, Mic, PhoneForwarded, RadioTower } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { VoiceLabCharts } from "@/components/charts/voice-lab-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { scenariosByIndustry } from "@/lib/data/scenario-packs";

export default function VoiceLabPage() {
  const voiceScenarios = scenariosByIndustry("voice");
  const interruptionCount = voiceScenarios.filter((scenario) => scenario.customerOpeningMessage.includes("interrupts") || scenario.scenarioTags.includes("interruptions")).length;
  const uncertaintyCount = voiceScenarios.filter((scenario) => scenario.customerOpeningMessage.includes("unclear") || scenario.scenarioTags.includes("unclear")).length;
  const escalationCount = voiceScenarios.filter((scenario) => scenario.realism.expectedEscalation).length;
  const summaryScenario = voiceScenarios.find((scenario) => scenario.id === "voice-summary-accuracy") ?? voiceScenarios[0];
  const metrics: Array<[string, number, LucideIcon]> = [
    ["Interruption handling", interruptionCount, MessageSquareWarning],
    ["Speech uncertainty", uncertaintyCount, RadioTower],
    ["Escalation timing", escalationCount, PhoneForwarded],
    ["Metadata capture", 8, Mic],
    ["Call summary accuracy", 86, AudioLines],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge className="mb-3 border-violet-400/30 bg-violet-500/15 text-violet-100">Voice transcript evaluation</Badge>
          <h1 className="text-3xl font-semibold text-white">Voice Lab</h1>
          <p className="mt-2 max-w-3xl text-white/55">
            Evaluate support-call transcripts for interruption handling, speech uncertainty, escalation timing, metadata capture, summary accuracy, and customer sentiment.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-sky-500 to-violet-500 text-white">
          <Link href="/dashboard/run?source=mixed-ops">Run voice-heavy suite</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {metrics.map(([label, value, Icon]) => (
          <Card key={label} className="glass-panel">
            <CardContent className="p-4">
              <Icon className="mb-3 h-5 w-5 text-violet-300" />
              <p className="text-xs text-white/45">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <VoiceLabCharts />
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <Card className="glass-panel">
          <CardHeader><CardTitle className="text-white">Sample call trace</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {summaryScenario.transcript.map((turn) => (
              <div key={turn.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/10 text-white/60">{turn.speaker}</Badge>
                  {turn.sentiment ? <Badge className="bg-violet-500/15 text-violet-100">{turn.sentiment}</Badge> : null}
                  {turn.message.includes("[") ? <Badge className="bg-amber-500/15 text-amber-100">speech marker</Badge> : null}
                </div>
                <p className="text-sm leading-6 text-white/70">{turn.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader><CardTitle className="text-white">Voice-specific recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              "Escalate after repeated explicit human requests instead of continuing containment.",
              "Ask callers to repeat uncertain metadata before lookup or account changes.",
              "Track interruption count and sentiment trend as quality signals.",
              "Require call summaries to include issue, action, uncertainty, and callback constraints.",
              "Treat crisis language and panic as escalation triggers even if the stated intent is routine scheduling.",
            ].map((item) => (
              <div key={item} className="rounded-md border border-sky-400/20 bg-sky-500/10 p-3 text-sm leading-6 text-sky-100">
                <Clock className="mr-2 inline h-4 w-4" />
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
