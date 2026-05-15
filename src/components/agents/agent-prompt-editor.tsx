"use client";

import { useState } from "react";
import { Save, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Agent } from "@/lib/types";

export function AgentPromptEditor({ agent }: { agent: Agent }) {
  const latest = agent.versions.at(-1)!;
  const [prompt, setPrompt] = useState(latest.systemPrompt);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">System prompt</p>
          <p className="text-sm text-white/50">Local demo editing is instant and auth-ready for Supabase persistence.</p>
        </div>
        <Badge className="border-sky-400/30 bg-sky-500/15 text-sky-100">
          <Sparkles className="mr-1 h-3 w-3" />
          {latest.version} score {latest.score}
        </Badge>
      </div>
      <Textarea
        value={prompt}
        onChange={(event) => {
          setPrompt(event.target.value);
          setSaved(false);
        }}
        className="min-h-64 border-white/10 bg-black/25 font-mono text-sm leading-6 text-white"
      />
      <div className="flex justify-end">
        <Button
          onClick={() => setSaved(true)}
          className="bg-gradient-to-r from-sky-500 to-violet-500 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {saved ? "Saved locally" : "Save prompt"}
        </Button>
      </div>
    </div>
  );
}
