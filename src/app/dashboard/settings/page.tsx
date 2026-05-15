import { Download, KeyRound, SlidersHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-white/55">Auth-ready workspace settings, model defaults, API keys, and export controls.</p>
      </div>
      <Tabs defaultValue="api" className="space-y-5">
        <TabsList className="bg-white/5"><TabsTrigger value="api">API keys</TabsTrigger><TabsTrigger value="models">Models</TabsTrigger><TabsTrigger value="workspace">Workspace</TabsTrigger></TabsList>
        <TabsContent value="api">
          <Card className="glass-panel"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><KeyRound className="h-5 w-5 text-sky-300" />Environment</CardTitle></CardHeader><CardContent className="grid gap-4"><div className="grid gap-2"><Label>OPENAI_API_KEY</Label><Input value="Stored in .env.local or Vercel encrypted env vars" readOnly className="border-white/10 bg-white/5 text-white/60" /></div><div className="grid gap-2"><Label>Supabase URL</Label><Input value="NEXT_PUBLIC_SUPABASE_URL" readOnly className="border-white/10 bg-white/5 text-white/60" /></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="models">
          <Card className="glass-panel"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><SlidersHorizontal className="h-5 w-5 text-violet-300" />Evaluation defaults</CardTitle></CardHeader><CardContent className="grid gap-4"><div className="grid gap-2"><Label>Default model</Label><Select defaultValue="openai/gpt-5.4"><SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="openai/gpt-5.4">openai/gpt-5.4</SelectItem><SelectItem value="openai/gpt-4.1-mini">openai/gpt-4.1-mini</SelectItem></SelectContent></Select></div><div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] p-4"><div><Label>Strict tool-order validation</Label><p className="text-sm text-white/50">Flags unnecessary high-risk calls and missing prerequisites.</p></div><Switch defaultChecked /></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="workspace">
          <Card className="glass-panel"><CardHeader><CardTitle className="flex items-center gap-2 text-white"><Users className="h-5 w-5 text-emerald-300" />Team workspace</CardTitle></CardHeader><CardContent className="grid gap-4"><div className="grid gap-2"><Label>Workspace name</Label><Input defaultValue="ResolveAI Demo Workspace" className="border-white/10 bg-white/5 text-white" /></div><Button className="w-fit bg-white text-slate-950 hover:bg-white/90"><Download className="mr-2 h-4 w-4" />Export all demo data</Button></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
