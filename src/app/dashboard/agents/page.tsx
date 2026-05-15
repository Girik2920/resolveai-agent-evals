import Link from "next/link";
import { Plus, Settings2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { demoAgents } from "@/lib/data/seed";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold text-white">Agents</h1>
          <p className="mt-2 text-white/55">Create, inspect, and version support agents before running regression suites.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-sky-500 to-violet-500 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create agent
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-slate-950 text-white">
            <DialogHeader>
              <DialogTitle>Create new agent</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2"><Label>Name</Label><Input className="border-white/10 bg-white/5" placeholder="Claims Support Agent" /></div>
              <div className="grid gap-2"><Label>Model</Label><Select defaultValue="openai/gpt-5.4"><SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="openai/gpt-5.4">openai/gpt-5.4</SelectItem><SelectItem value="openai/gpt-4.1-mini">openai/gpt-4.1-mini</SelectItem></SelectContent></Select></div>
              <div className="grid gap-2"><Label>System prompt</Label><Textarea className="min-h-32 border-white/10 bg-white/5" placeholder="Define role, policy rules, tools, and escalation triggers..." /></div>
              <Button className="bg-white text-slate-950 hover:bg-white/90">Save demo agent</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {demoAgents.map((agent) => (
          <Card key={agent.id} className="glass-panel">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-white">{agent.name}</CardTitle>
                  <p className="mt-1 text-sm text-white/50">{agent.industry}</p>
                </div>
                <Badge className={agent.status === "ready" ? "bg-emerald-500/15 text-emerald-100" : agent.status === "testing" ? "bg-sky-500/15 text-sky-100" : "bg-amber-500/15 text-amber-100"}>
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-white/60">{agent.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {agent.tools.map((tool) => (
                  <Badge key={tool.id} variant="outline" className="border-white/10 text-white/60">
                    <Wrench className="mr-1 h-3 w-3" />
                    {tool.name}
                  </Badge>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-sm text-white/45">Latest version</p>
                  <p className="font-mono text-sm text-white">{agent.versions.at(-1)?.version} / {agent.versions.at(-1)?.score}</p>
                </div>
                <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Link href={`/dashboard/agents/${agent.id}`}>
                    <Settings2 className="mr-2 h-4 w-4" />
                    Open
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
