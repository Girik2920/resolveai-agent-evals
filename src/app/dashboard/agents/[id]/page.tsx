import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { AgentPromptEditor } from "@/components/agents/agent-prompt-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { demoAgents, evaluationRuns, getAgent } from "@/lib/data/seed";

export function generateStaticParams() {
  return demoAgents.map((agent) => ({ id: agent.id }));
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) notFound();
  const runs = evaluationRuns.filter((run) => run.agentId === agent.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge className="mb-3 border-white/10 bg-white/5 text-white/60">{agent.industry}</Badge>
          <h1 className="text-3xl font-semibold text-white">{agent.name}</h1>
          <p className="mt-2 max-w-3xl text-white/55">{agent.description}</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-sky-500 to-violet-500 text-white">
          <Link href={`/dashboard/run?agent=${agent.id}`}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Run test
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="bg-white/5">
          {["overview", "prompt", "tools", "knowledge", "versions", "test runs"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-5 lg:grid-cols-3">
            {agent.versions.map((version) => (
              <Card key={version.id} className="glass-panel">
                <CardHeader><CardTitle className="text-white">{version.label}</CardTitle></CardHeader>
                <CardContent><p className="text-4xl font-semibold text-white">{version.score}</p><p className="mt-2 text-sm text-white/55">{version.notes}</p></CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="prompt"><Card className="glass-panel"><CardContent className="p-5"><AgentPromptEditor agent={agent} /></CardContent></Card></TabsContent>
        <TabsContent value="tools">
          <Card className="glass-panel"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Risk</TableHead><TableHead>Description</TableHead></TableRow></TableHeader><TableBody>{agent.tools.map((tool) => (<TableRow key={tool.id}><TableCell className="font-mono text-white">{tool.name}</TableCell><TableCell><Badge variant="outline" className="border-white/10 text-white/60">{tool.risk}</Badge></TableCell><TableCell className="text-white/60">{tool.description}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="knowledge">
          <div className="grid gap-4">{agent.knowledgeBase.map((doc) => (<Card key={doc.id} className="glass-panel"><CardHeader><CardTitle className="text-white">{doc.title}</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-white/60">{doc.content}</p><div className="mt-4 flex flex-wrap gap-2">{doc.policyFacts.map((fact) => <Badge key={fact} className="bg-violet-500/15 text-violet-100">{fact}</Badge>)}</div></CardContent></Card>))}</div>
        </TabsContent>
        <TabsContent value="versions">
          <Card className="glass-panel"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Version</TableHead><TableHead>Score</TableHead><TableHead>Created</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader><TableBody>{agent.versions.map((version) => (<TableRow key={version.id}><TableCell className="font-mono text-white">{version.version}</TableCell><TableCell className="text-white">{version.score}</TableCell><TableCell className="text-white/55">{new Date(version.createdAt).toLocaleDateString()}</TableCell><TableCell className="text-white/60">{version.notes}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="test runs">
          <Card className="glass-panel"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Run</TableHead><TableHead>Suite</TableHead><TableHead>Score</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{runs.map((run) => (<TableRow key={run.id}><TableCell className="text-white">{run.name}</TableCell><TableCell className="text-white/60">{run.suiteName}</TableCell><TableCell className="text-white">{run.overallScore}</TableCell><TableCell className="text-right"><Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5 text-white"><Link href={`/dashboard/reports/${run.id}`}>View</Link></Button></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
