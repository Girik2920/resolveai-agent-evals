import type { ScenarioRealism, TranscriptTurn } from "@/lib/types";

const ambiguity = { low: 8, medium: 16, high: 24 };
const emotion = { calm: 5, confused: 10, frustrated: 15, angry: 20, panicked: 24 };
const risk = { low: 6, medium: 13, high: 20 };
const tools = { none: 2, single_tool: 8, multi_tool: 15, failed_tool: 20, conflicting_tools: 24 };

export function calculateRealismScore(input: Omit<ScenarioRealism, "realismScore"> & {
  transcript: TranscriptTurn[];
  hasConflictingEvidence?: boolean;
}) {
  const transcriptDepth = Math.min(14, Math.max(0, input.transcript.length - 4) * 2);
  const escalation = input.expectedEscalation ? 8 : 0;
  const conflict = input.hasConflictingEvidence ? 8 : 0;
  const score =
    ambiguity[input.ambiguityLevel] +
    emotion[input.customerEmotion] +
    risk[input.businessRisk] +
    risk[input.policyRisk] +
    tools[input.toolComplexity] +
    transcriptDepth +
    escalation +
    conflict;

  return Math.min(100, Math.max(35, score));
}

export function realismBand(score: number) {
  if (score >= 80) return "messy enterprise";
  if (score >= 55) return "moderately realistic";
  return "clean baseline";
}
