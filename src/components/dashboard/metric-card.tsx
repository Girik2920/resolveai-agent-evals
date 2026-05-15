import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red" | "violet";
};

const tones = {
  blue: "from-sky-500/20 to-cyan-400/5 text-sky-200",
  green: "from-emerald-500/20 to-teal-400/5 text-emerald-200",
  amber: "from-amber-500/20 to-orange-400/5 text-amber-200",
  red: "from-red-500/20 to-rose-400/5 text-red-200",
  violet: "from-violet-500/20 to-fuchsia-400/5 text-violet-200",
};

export function MetricCard({ label, value, detail, icon: Icon, tone = "blue" }: MetricCardProps) {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
            <p className="mt-2 text-sm text-white/55">{detail}</p>
          </div>
          <div className={`rounded-md bg-gradient-to-br p-2.5 ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
