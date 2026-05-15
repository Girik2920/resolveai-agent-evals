import { NextResponse } from "next/server";
import { z } from "zod";
import { getRun } from "@/lib/data/seed";

const schema = z.object({
  runId: z.string(),
  format: z.enum(["json", "csv", "markdown"]).default("json"),
});

function csv(run: NonNullable<ReturnType<typeof getRun>>) {
  const rows = [
    ["Scenario", "Intent", "Risk", "Result", "Score", "Failure reason"],
    ...run.scenarioResults.map((scenario) => [
      scenario.scenarioName,
      scenario.customerIntent,
      scenario.riskType,
      scenario.result,
      String(scenario.score),
      scenario.failureReason,
    ]),
  ];
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

function markdown(run: NonNullable<ReturnType<typeof getRun>>) {
  return `# ${run.name}

Overall score: ${run.overallScore}

${run.executiveSummary}

## Scenario results

${run.scenarioResults
  .map((scenario) => `- ${scenario.result.toUpperCase()} ${scenario.scenarioName}: ${scenario.failureReason}`)
  .join("\n")}

## Recommendations

${run.recommendations.map((rec) => `- ${rec.title}: ${rec.description}`).join("\n")}
`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = schema.parse({
    runId: url.searchParams.get("runId"),
    format: url.searchParams.get("format") ?? "json",
  });
  const run = getRun(input.runId);
  if (!run) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  if (input.format === "csv") {
    return new Response(csv(run), {
      headers: {
        "content-type": "text/csv",
        "content-disposition": `attachment; filename="${run.id}.csv"`,
      },
    });
  }

  if (input.format === "markdown") {
    return new Response(markdown(run), {
      headers: {
        "content-type": "text/markdown",
        "content-disposition": `attachment; filename="${run.id}.md"`,
      },
    });
  }

  return NextResponse.json(run);
}
