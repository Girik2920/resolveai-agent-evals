create extension if not exists "pgcrypto";

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  industry text not null,
  description text,
  model text not null default 'openai/gpt-5.4',
  status text not null default 'ready',
  created_at timestamptz not null default now()
);

create table agent_versions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  version text not null,
  label text not null,
  system_prompt text not null,
  score integer default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table tools (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  name text not null,
  description text not null,
  risk text not null,
  input_schema jsonb not null default '{}'::jsonb
);

create table knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  title text not null,
  content text not null,
  policy_facts jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table test_suites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  description text not null,
  risk_level text not null,
  category text not null,
  last_run_score integer default 0
);

create table test_scenarios (
  id uuid primary key default gen_random_uuid(),
  suite_id uuid references test_suites(id) on delete cascade,
  name text not null,
  customer_intent text not null,
  risk_type text not null,
  risk_level text not null,
  expected_behavior text not null,
  expected_tools jsonb not null default '[]'::jsonb,
  expected_policy_facts jsonb not null default '[]'::jsonb,
  includes_prompt_injection boolean not null default false,
  includes_api_failure boolean not null default false
);

create table evaluation_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  suite_id uuid references test_suites(id) on delete set null,
  prompt_version text not null,
  name text not null,
  status text not null,
  overall_score integer not null,
  hallucination_rate numeric not null,
  tool_call_accuracy numeric not null,
  escalation_accuracy numeric not null,
  containment_rate numeric not null,
  average_latency_ms integer not null,
  cost_estimate_usd numeric(10, 4) not null,
  executive_summary text not null,
  score_breakdown jsonb not null,
  created_at timestamptz not null default now()
);

create table scenario_results (
  id uuid primary key default gen_random_uuid(),
  evaluation_run_id uuid references evaluation_runs(id) on delete cascade,
  scenario_id uuid references test_scenarios(id) on delete set null,
  scenario_name text not null,
  customer_intent text not null,
  risk_type text not null,
  result text not null,
  score integer not null,
  failure_reason text,
  hallucination_examples jsonb not null default '[]'::jsonb,
  scores jsonb not null,
  evaluator_notes text
);

create table conversation_turns (
  id uuid primary key default gen_random_uuid(),
  scenario_result_id uuid references scenario_results(id) on delete cascade,
  role text not null,
  content text not null,
  tool_call jsonb,
  created_at timestamptz not null default now()
);

create table recommendations (
  id uuid primary key default gen_random_uuid(),
  evaluation_run_id uuid references evaluation_runs(id) on delete cascade,
  category text not null,
  title text not null,
  description text not null,
  priority text not null
);

create index evaluation_runs_workspace_created_idx on evaluation_runs(workspace_id, created_at desc);
create index scenario_results_run_idx on scenario_results(evaluation_run_id);
create index conversation_turns_result_idx on conversation_turns(scenario_result_id);
