"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sentiment = [
  { turn: "1", sentiment: 72 },
  { turn: "2", sentiment: 64 },
  { turn: "3", sentiment: 48 },
  { turn: "4", sentiment: 42 },
  { turn: "5", sentiment: 58 },
  { turn: "6", sentiment: 70 },
  { turn: "7", sentiment: 76 },
];

const issues = [
  { type: "Interruptions", count: 14 },
  { type: "Unclear speech", count: 9 },
  { type: "Noise", count: 8 },
  { type: "Metadata gaps", count: 11 },
];

export function VoiceLabCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        {["Customer sentiment over call turns", "Voice quality issue counts"].map((title) => (
          <Card key={title} className="glass-panel">
            <CardHeader><CardTitle className="text-white">{title}</CardTitle></CardHeader>
            <CardContent className="h-72"><div className="h-full animate-pulse rounded-md bg-white/[0.04]" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="glass-panel">
        <CardHeader><CardTitle className="text-white">Customer sentiment over call turns</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentiment}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="turn" stroke="rgba(255,255,255,.45)" />
              <YAxis stroke="rgba(255,255,255,.45)" />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
              <Line type="monotone" dataKey="sentiment" stroke="#60a5fa" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="glass-panel">
        <CardHeader><CardTitle className="text-white">Voice quality issue counts</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={issues}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="type" stroke="rgba(255,255,255,.45)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,.45)" />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
