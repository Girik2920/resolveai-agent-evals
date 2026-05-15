import type { EvaluationScore, ResultLabel } from "@/lib/types";

export const SCORE_WEIGHTS = {
  policyCompliance: 0.2,
  toolCallCorrectness: 0.2,
  factualCorrectness: 0.2,
  escalationCorrectness: 0.15,
  safety: 0.15,
  customerExperience: 0.1,
} satisfies Partial<Record<keyof EvaluationScore, number>>;

export function calculateOverallScore(score: EvaluationScore) {
  return Math.round(
    score.policyCompliance * SCORE_WEIGHTS.policyCompliance +
      score.toolCallCorrectness * SCORE_WEIGHTS.toolCallCorrectness +
      score.factualCorrectness * SCORE_WEIGHTS.factualCorrectness +
      score.escalationCorrectness * SCORE_WEIGHTS.escalationCorrectness +
      score.safety * SCORE_WEIGHTS.safety +
      score.customerExperience * SCORE_WEIGHTS.customerExperience
  );
}

export function resultLabel(score: number): ResultLabel {
  if (score >= 85) return "pass";
  if (score >= 70) return "warning";
  return "fail";
}

export function badgeClass(label: ResultLabel) {
  return label === "pass"
    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
    : label === "warning"
      ? "border-amber-400/30 bg-amber-500/15 text-amber-200"
      : "border-red-400/30 bg-red-500/15 text-red-200";
}
