"use client";

import { useState } from "react";
import { ChevronDown, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ScenarioResult } from "@/lib/types";
import { badgeClass } from "@/lib/evals/rubric";
import { cn } from "@/lib/utils";

export function TranscriptViewer({ results }: { results: ScenarioResult[] }) {
  const [open, setOpen] = useState(results[0]?.id);

  return (
    <div className="space-y-3">
      {results.map((result) => {
        const expanded = open === result.id;
        return (
          <Card key={result.id} className="glass-panel overflow-hidden">
            <button
              className="flex w-full items-center justify-between gap-4 p-4 text-left"
              onClick={() => setOpen(expanded ? "" : result.id)}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{result.scenarioName}</p>
                  <Badge className={badgeClass(result.result)}>{result.result}</Badge>
                  <Badge variant="outline" className="border-white/10 text-white/55">
                    {result.score}/100
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-white/50">{result.failureReason}</p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-white/50 transition", expanded && "rotate-180")} />
            </button>
            {expanded ? (
              <CardContent className="border-t border-white/10 p-0">
                <div className="grid gap-0 lg:grid-cols-[1.2fr_.8fr]">
                  <div className="space-y-3 p-4">
                    {result.transcript.map((turn) => (
                      <div key={turn.id} className="rounded-md border border-white/10 bg-black/20 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="outline" className="border-white/10 capitalize text-white/60">
                            {turn.role}
                          </Badge>
                          {turn.toolCall ? (
                            <Badge className="border-sky-400/30 bg-sky-500/15 text-sky-100">
                              <Terminal className="mr-1 h-3 w-3" />
                              {turn.toolCall.name}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-sm leading-6 text-white/75">{turn.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 p-4 lg:border-l lg:border-t-0">
                    <p className="text-sm font-medium text-white">Evaluator notes</p>
                    <p className="mt-2 text-sm leading-6 text-white/60">{result.evaluatorNotes}</p>
                    <div className="mt-4 space-y-2">
                      {Object.entries(result.scores).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="capitalize text-white/50">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className="font-mono text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="mt-5 w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                      Add to regression suite
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
