"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  GitCompareArrows,
  MessageSquareWarning,
  ShieldCheck,
  TerminalSquare,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features: Array<[string, LucideIcon]> = [
  ["AI customer simulation", Bot],
  ["Hallucination detection", BrainCircuit],
  ["Tool-call validation", TerminalSquare],
  ["Policy compliance testing", ShieldCheck],
  ["Prompt version regression testing", GitCompareArrows],
  ["Human escalation checks", MessageSquareWarning],
];

const workflow = ["Define your agent", "Run test suites", "Review failures", "Ship safer agents"];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden text-white">
      <section className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_.95fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="mb-5 border-sky-400/30 bg-sky-500/15 text-sky-100">Production agent quality control</Badge>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">Stress-test AI agents</span> before they reach customers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
            ResolveAI simulates real customer conversations, catches hallucinations, verifies tool calls, and measures containment before production.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-to-r from-sky-500 to-violet-500 text-white">
              <Link href="/dashboard">
                Launch Demo Workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link href="/dashboard/reports/run-refund-v2">View Evaluation Report</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/45">
            {["Structured judge", "Prompt injection", "PII leakage", "API failure", "Tool order"].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="glass-panel rounded-lg p-3"
        >
          <div className="rounded-md border border-white/10 bg-slate-950/80 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Evaluation report</p>
                <p className="text-xl font-semibold">E-commerce Refund Agent v2</p>
              </div>
              <Badge className="border-emerald-400/30 bg-emerald-500/15 text-emerald-100">88 pass</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Tool accuracy 91%", "Hallucination 7%", "Escalation 86%"].map((metric) => (
                <div key={metric} className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">
                  {metric}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Prompt injection", "Blocked unsafe refund approval", "pass"],
                ["API failure", "Created ticket, did not claim success", "pass"],
                ["Outside policy", "Tone good, escalation late", "warning"],
              ].map(([name, note, status]) => (
                <div key={name} className="flex items-center justify-between rounded-md border border-white/10 bg-black/25 p-3">
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-white/45">{note}</p>
                  </div>
                  <Badge className={status === "pass" ? "bg-emerald-500/15 text-emerald-100" : "bg-amber-500/15 text-amber-100"}>
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md bg-black/35 p-4 font-mono text-xs leading-6 text-sky-100/75">
              <p>$ resolveai run suite-refunds --agent ecommerce-v2</p>
              <p className="text-emerald-200">PASS tool-call order: checkOrderStatus {"->"} checkRefundEligibility</p>
              <p className="text-amber-200">WARN escalation: delayed after repeat manager request</p>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([feature, Icon]) => (
            <Card key={feature as string} className="glass-panel">
              <CardContent className="p-5">
                <Icon className="mb-4 h-5 w-5 text-sky-300" />
                <p className="font-medium text-white">{feature}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Scenario coverage, expected behaviors, judge rubrics, and exportable evidence.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-lg p-6">
          <div className="grid gap-5 md:grid-cols-4">
            {workflow.map((item, index) => (
              <div key={item} className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 text-sm">{index + 1}</div>
                <div>
                  <p className="font-medium">{item}</p>
                  <p className="mt-1 text-sm text-white/50">A focused workflow for shipping safer AI support automation.</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
            <div>
              <p className="text-2xl font-semibold">Ready to inspect a real report?</p>
              <p className="mt-1 text-white/55">Open the seeded workspace and run a demo evaluation in under a minute.</p>
            </div>
            <Button asChild className="bg-white text-slate-950 hover:bg-white/90">
              <Link href="/dashboard/run">
                Start evaluation
                <Workflow className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
