"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Filter, Layers, List, Mic, PlayCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RealWorldScenario } from "@/lib/types";
import { realismBand } from "@/lib/evals/realism-score";

const all = "all";

export function ScenarioLibraryClient({ scenarios }: { scenarios: RealWorldScenario[] }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState(all);
  const [risk, setRisk] = useState(all);
  const [emotion, setEmotion] = useState(all);
  const [ambiguity, setAmbiguity] = useState(all);
  const [complexity, setComplexity] = useState(all);
  const [escalationOnly, setEscalationOnly] = useState(false);
  const [scoreRange, setScoreRange] = useState(all);
  const [mode, setMode] = useState<"all" | "chat" | "voice">("all");

  const filtered = useMemo(() => {
    return scenarios.filter((scenario) => {
      const haystack = [
        scenario.title,
        scenario.description,
        scenario.customerOpeningMessage,
        scenario.customerContext,
        scenario.scenarioTags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const realism = scenario.realism.realismScore;
      const scoreMatches =
        scoreRange === all ||
        (scoreRange === "80" && realism >= 80) ||
        (scoreRange === "60" && realism >= 60 && realism < 80) ||
        (scoreRange === "40" && realism < 60);

      return (
        haystack.includes(query.toLowerCase()) &&
        (industry === all || scenario.industry === industry) &&
        (risk === all || scenario.riskLevel === risk) &&
        (emotion === all || scenario.realism.customerEmotion === emotion) &&
        (ambiguity === all || scenario.realism.ambiguityLevel === ambiguity) &&
        (complexity === all || scenario.realism.toolComplexity === complexity) &&
        (!escalationOnly || scenario.realism.expectedEscalation) &&
        scoreMatches &&
        (mode === "all" || (mode === "voice" ? scenario.industry === "voice" : scenario.industry !== "voice"))
      );
    });
  }, [ambiguity, complexity, emotion, escalationOnly, industry, mode, query, risk, scenarios, scoreRange]);

  return (
    <div className="space-y-5">
      <Card className="glass-panel">
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messy scenarios, policies, tool failures..."
              className="border-white/10 bg-white/5 pl-9 text-white"
            />
          </div>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue placeholder="Industry" /></SelectTrigger>
            <SelectContent>
              {[all, "delivery", "healthcare", "ecommerce", "banking", "telecom", "voice"].map((item) => (
                <SelectItem key={item} value={item}>{item === all ? "All industries" : item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[all, "low", "medium", "high", "critical"].map((item) => <SelectItem key={item} value={item}>{item === all ? "All risk" : item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Tabs value={mode} onValueChange={(value) => setMode(value as "all" | "chat" | "voice")} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={emotion} onValueChange={setEmotion}>
            <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[all, "calm", "confused", "frustrated", "angry", "panicked"].map((item) => <SelectItem key={item} value={item}>{item === all ? "All emotions" : item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={ambiguity} onValueChange={setAmbiguity}>
            <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[all, "low", "medium", "high"].map((item) => <SelectItem key={item} value={item}>{item === all ? "All ambiguity" : item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={complexity} onValueChange={setComplexity}>
            <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[all, "none", "single_tool", "multi_tool", "failed_tool", "conflicting_tools"].map((item) => <SelectItem key={item} value={item}>{item === all ? "All tools" : item.replaceAll("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={scoreRange} onValueChange={setScoreRange}>
            <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={all}>All realism</SelectItem>
              <SelectItem value="80">80-100</SelectItem>
              <SelectItem value="60">60-79</SelectItem>
              <SelectItem value="40">Below 60</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 lg:col-span-4">
            <div className="flex items-center gap-2 text-sm text-white/65">
              <Filter className="h-4 w-4 text-sky-300" />
              {filtered.length} scenarios matching filters
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              Expected escalation only
              <Switch checked={escalationOnly} onCheckedChange={setEscalationOnly} />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((scenario) => (
          <Card key={scenario.id} className="glass-panel">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">{scenario.title}</CardTitle>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">{scenario.customerOpeningMessage}</p>
                </div>
                <Badge className={scenario.riskLevel === "critical" ? "bg-red-500/15 text-red-100" : scenario.riskLevel === "high" ? "bg-amber-500/15 text-amber-100" : "bg-sky-500/15 text-sky-100"}>
                  {scenario.riskLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/10 text-white/60"><Layers className="mr-1 h-3 w-3" />{scenario.industry}</Badge>
                <Badge variant="outline" className="border-white/10 text-white/60">{scenario.realism.customerEmotion}</Badge>
                <Badge variant="outline" className="border-white/10 text-white/60">{scenario.realism.toolComplexity.replaceAll("_", " ")}</Badge>
                {scenario.industry === "voice" ? <Badge className="bg-violet-500/15 text-violet-100"><Mic className="mr-1 h-3 w-3" />voice</Badge> : null}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-xs text-white/40">Realism</p>
                  <p className="mt-1 text-xl font-semibold text-white">{scenario.realism.realismScore}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-xs text-white/40">Band</p>
                  <p className="mt-1 text-sm font-medium text-white">{realismBand(scenario.realism.realismScore)}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-xs text-white/40">Trace</p>
                  <p className="mt-1 text-xl font-semibold text-white">{scenario.transcript.length}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-between gap-2">
                <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Link href={`/dashboard/scenarios/${scenario.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Inspect scenario
                  </Link>
                </Button>
                <Button asChild className="bg-white text-slate-950 hover:bg-white/90">
                  <Link href={`/dashboard/run?source=${scenario.industry === "voice" ? "mixed-ops" : scenario.industry === "delivery" ? "doordish" : scenario.industry === "ecommerce" ? "retail-live" : "seeded"}`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Run similar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 ? (
        <Card className="glass-panel">
          <CardContent className="p-8 text-center text-white/55">
            <List className="mx-auto mb-3 h-8 w-8 text-white/25" />
            No scenarios match these filters.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
