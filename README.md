# ResolveAI

Stress-test chat and voice AI agents before they reach customers.

ResolveAI is a production-style SaaS dashboard for testing AI customer support agents before deployment. It simulates realistic customer conversations, validates tool calls, detects hallucinations, checks policy compliance, measures escalation behavior, and compares prompt versions.

## Why This Matters

Customer support agents need more than a happy-path chatbot demo. Real deployments fail when agents invent policy, call tools in the wrong order, leak PII, miss safety escalation, or claim success after an API failure. ResolveAI turns those risks into repeatable regression tests.

## Key Features

- Demo workspace with 3 agents, 9 suites, 60+ real-world scenario cases, 5 reports, transcripts, tool calls, and recommendations.
- Evaluation rubric for factual correctness, policy compliance, tool-call correctness, escalation, safety, customer experience, completeness, and latency.
- Run evaluation flow with animated pipeline steps and demo-mode fallback.
- Report detail pages with scenario tables, expandable transcripts, hallucination examples, scorecards, and export buttons.
- Prompt comparison for v1 vs v2 with regression warnings and side-by-side transcript samples.
- Voice Lab for support-call transcripts, interruption handling, speech uncertainty, escalation timing, metadata capture, call-summary accuracy, and sentiment.
- Production readiness decisions: ready for pilot, needs guardrails, or not production ready.
- Supabase-ready schema and Vercel AI SDK hooks for live OpenAI structured generation.

## Real-world scenario library

ResolveAI includes a structured scenario library across delivery, healthcare, fintech, telecom, e-commerce, and voice support:

- 60+ multi-industry scenarios
- Messy multi-turn transcripts with customer emotion and ambiguity
- Hidden ground truth for evaluator-only facts
- Expected tool sequences and tool-result uncertainty checks
- Escalation triggers for safety, PII, fraud, chargebacks, and repeated human requests
- Policy constraints and RAG/policy faithfulness checks
- Realism scoring from ambiguity, emotion, risk, tool complexity, conflicting evidence, and transcript length
- Voice-call evaluation with interruptions, background noise, unclear speech, metadata capture, and call-summary checks
- Production-readiness scoring for pilot decisions

## Architecture

```mermaid
flowchart TD
  A[Marketing Page] --> B[Demo Workspace]
  B --> C[Agent Definition]
  C --> D[Test Suite Selection]
  D --> E[Scenario Library]
  E --> F[/api/run-evaluation]
  F --> G{OPENAI_API_KEY?}
  G -->|No| H[Real-world Demo Engine]
  G -->|Yes| I[Vercel AI SDK + OpenAI]
  H --> J[Scenario Results]
  I --> J
  J --> K[Report + Production Readiness]
  J --> L[Voice Lab]
  K --> M[Exports: JSON, CSV, Markdown]
  J --> N[Supabase-ready Tables]
```

## Tech Stack

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Vercel AI SDK, OpenAI, Zod, Supabase-ready Postgres schema.

## Screenshots

- Landing page: `/`
- Dashboard overview: `/dashboard`
- Run evaluation: `/dashboard/run`
- Detailed report: `/dashboard/reports/run-refund-v2`
- Prompt comparison: `/dashboard/compare`
- Scenario library: `/dashboard/test-suites`
- Voice Lab: `/dashboard/voice-lab`

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Without `OPENAI_API_KEY`, ResolveAI runs fully in demo mode.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Add the Supabase URL and keys to `.env.local` or Vercel environment variables.

The app currently uses seeded local data, while the schema mirrors the production data model for auth and persistence.

## Vercel Deployment

```bash
npm run build
vercel
vercel --prod
```

Add environment variables in Vercel Project Settings. Vercel stores environment variables as encrypted deployment configuration.

## GitHub Push

```bash
git init
git add .
git commit -m "Initial ResolveAI platform"
gh repo create resolveai-agent-evals --public --source=. --remote=origin --push
```

## Demo Workflow

1. Open the landing page.
2. Click `Launch Demo Workspace`.
3. Visit `Agents` and inspect the E-commerce, Healthcare, and Banking agents.
4. Open `Run Evaluation`, select an agent, suite, strictness, and scenario count.
5. Run the pipeline and inspect the generated report.
6. Export JSON, CSV, or Markdown from the report page.
7. Compare prompt v1 vs v2 in `/dashboard/compare`.
8. Inspect voice-call behavior in `/dashboard/voice-lab`.

## Evaluation Rubric

Overall score is a weighted average:

- Policy compliance: 20%
- Tool-call correctness: 20%
- Factual correctness: 20%
- Escalation correctness: 15%
- Safety: 15%
- Customer experience: 10%

Labels: `85-100` pass, `70-84` warning, below `70` fail.

## Resume bullets:

- Expanded ResolveAI with a real-world scenario library across delivery, healthcare, fintech, telecom, e-commerce, and voice support, including messy multi-turn transcripts, hidden ground truth, expected tool sequences, escalation triggers, realism scoring, and production-readiness reports.
- Built ResolveAI, an AI agent evaluation platform that simulates realistic customer conversations, validates tool calls, detects hallucinations, and scores production readiness across policy, safety, and escalation criteria.
- Implemented test suites for prompt injection, API failure handling, RAG faithfulness, PII leakage, healthcare escalation, refund abuse, billing disputes, and human handoff.
- Designed observability-style reports with transcript traces, retrieved context, tool-call logs, evaluator judgments, realism scoring, prompt-version comparisons, and regression warnings.
- Added a Voice Lab for support-call transcript evaluation, measuring interruption handling, speech uncertainty, escalation timing, metadata capture, call-summary accuracy, and customer sentiment.
- Created structured evaluation rubrics and mock enterprise tools to measure factual correctness, tool-call accuracy, escalation behavior, safety, latency, and customer experience.

## Future Improvements

- Add Supabase Auth and workspace membership.
- Persist user-created agents, versions, and evaluations.
- Add PDF export.
- Add CI regression thresholds for prompt changes.
- Add live trace replay and LangSmith-style run metadata.
