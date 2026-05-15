"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Bot, ClipboardCheck, FileText, GitCompareArrows, Home, PlayCircle, Search, Settings } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { demoAgents, evaluationRuns, testSuites } from "@/lib/data/seed";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home, hint: "Dashboard" },
  { href: "/dashboard/agents", label: "Agents", icon: Bot, hint: "Workspace" },
  { href: "/dashboard/test-suites", label: "Test Suites", icon: ClipboardCheck, hint: "Regression" },
  { href: "/dashboard/run", label: "Run Evaluation", icon: PlayCircle, hint: "Pipeline" },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3, hint: "Scorecards" },
  { href: "/dashboard/compare", label: "Compare", icon: GitCompareArrows, hint: "Prompts" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, hint: "Config" },
];

export function DashboardSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const records = useMemo(
    () => ({
      agents: demoAgents.map((agent) => ({
        href: `/dashboard/agents/${agent.id}`,
        label: agent.name,
        hint: agent.industry,
      })),
      suites: testSuites.map((suite) => ({
        href: `/dashboard/run?suite=${suite.id}`,
        label: suite.name,
        hint: suite.riskLevel,
      })),
      reports: evaluationRuns.map((run) => ({
        href: `/dashboard/reports/${run.id}`,
        label: run.name,
        hint: `${run.overallScore} ${run.status}`,
      })),
    }),
    []
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-full max-w-xl flex-1 items-center rounded-md border border-white/10 bg-white/[0.06] px-3 text-left text-sm text-white/40 transition hover:bg-white/[0.09] hover:text-white/65"
      >
        <Search className="mr-2 h-4 w-4 text-white/35" />
        Search runs, failures, agents...
        <span className="ml-auto hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/35 sm:inline">
          CMD K
        </span>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search ResolveAI"
        description="Jump to agents, reports, suites, and settings."
        className="border-white/10 bg-slate-950 text-white"
      >
        <Command className="bg-slate-950 text-white">
          <CommandInput placeholder="Search agents, reports, suites..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {navItems.map((item) => (
                <CommandItem key={item.href} value={`${item.label} ${item.hint}`} onSelect={() => go(item.href)}>
                  <item.icon className="h-4 w-4 text-sky-300" />
                  {item.label}
                  <CommandShortcut>{item.hint}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Agents">
              {records.agents.map((item) => (
                <CommandItem key={item.href} value={`${item.label} ${item.hint}`} onSelect={() => go(item.href)}>
                  <Bot className="h-4 w-4 text-violet-300" />
                  {item.label}
                  <CommandShortcut>{item.hint}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Reports">
              {records.reports.map((item) => (
                <CommandItem key={item.href} value={`${item.label} ${item.hint}`} onSelect={() => go(item.href)}>
                  <FileText className="h-4 w-4 text-emerald-300" />
                  {item.label}
                  <CommandShortcut>{item.hint}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Run Suites">
              {records.suites.map((item) => (
                <CommandItem key={item.href} value={`${item.label} ${item.hint}`} onSelect={() => go(item.href)}>
                  <ClipboardCheck className="h-4 w-4 text-amber-300" />
                  {item.label}
                  <CommandShortcut>{item.hint}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
