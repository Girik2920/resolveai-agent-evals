"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  ClipboardCheck,
  GitCompareArrows,
  Home,
  Mic,
  PlayCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/agents", label: "Agents", icon: Bot },
  { href: "/dashboard/test-suites", label: "Test Suites", icon: ClipboardCheck },
  { href: "/dashboard/run", label: "Run Evaluation", icon: PlayCircle },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/dashboard/voice-lab", label: "Voice Lab", icon: Mic },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
      <Link href="/" className="mb-7 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-sky-500 to-violet-500">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-white">ResolveAI</p>
          <p className="text-xs text-white/45">Agent evals</p>
        </div>
      </Link>
      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white",
                active && "bg-white/10 text-white shadow-lg shadow-sky-950/30"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-md border border-sky-400/20 bg-sky-500/10 p-3 text-sm text-sky-100">
        <p className="font-medium">Demo workspace</p>
        <p className="mt-1 text-xs text-sky-100/60">Seeded reports, agents, tools, and transcripts are active.</p>
      </div>
    </aside>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <Sidebar />
      </div>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/55 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-white/10 bg-white/5 lg:hidden">
                  <Home className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-white/10 bg-slate-950 p-0 text-white">
                <SheetTitle className="sr-only">ResolveAI navigation</SheetTitle>
                <Sidebar />
              </SheetContent>
            </Sheet>
            <DashboardSearch />
            <Badge className="hidden border-emerald-400/30 bg-emerald-500/15 text-emerald-100 sm:inline-flex">
              Demo mode
            </Badge>
            <Badge className="hidden border-sky-400/30 bg-sky-500/15 text-sky-100 md:inline-flex">
              openai/gpt-5.4 ready
            </Badge>
            <Button asChild variant="outline" className="hidden border-white/10 bg-white/5 text-white hover:bg-white/10 md:inline-flex">
              <Link href="https://github.com/Girik2920/resolveai-agent-evals" target="_blank" rel="noreferrer">
                GitHub
              </Link>
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
