"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTrend, failureCategories, statusDistribution } from "@/lib/data/seed";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-base text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  );
}

export function OverviewCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-5 xl:grid-cols-3">
        {["Score over time", "Failure categories", "Pass / warning / fail"].map((title) => (
          <ChartCard key={title} title={title}>
            <div className="h-full animate-pulse rounded-md bg-white/[0.04]" />
          </ChartCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <ChartCard title="Score over time">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dashboardTrend}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="date" stroke="rgba(255,255,255,.45)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,.45)" fontSize={12} />
            <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
            <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="hallucinations" stroke="#a78bfa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Failure categories">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={failureCategories}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,.45)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,.45)" fontSize={12} />
            <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#818cf8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Pass / warning / fail">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={statusDistribution} innerRadius={58} outerRadius={90} dataKey="value" paddingAngle={4}>
              {statusDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
