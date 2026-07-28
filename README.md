# DAMA Intelligence Workspace

Phase 1 controlled MVP foundation for an internal DAMA occupation and ANZSCO comparison workspace.

## Phase 1 Boundary

- Internal professional workspace only.
- No client-facing eligibility advice.
- No seeded real occupation availability, subclass availability or concessions.
- Candidate extraction records are never production comparison data.
- Approved structured records must be source-backed and reviewed before comparison use.

## Stack

- Next.js + TypeScript
- Supabase/Postgres
- Supabase Storage bucket plan for `source-snapshots`
- Vitest tests for Phase 1 safety gates

## Local Setup

```bash
npm install
npm run test
npm run dev
```

Copy `.env.example` to `.env.local` and provide Supabase project values for live integration. Do not commit real secrets.

## Supabase

Migrations are in `supabase/migrations`:

1. `0001_initial_schema.sql` - canonical enums, MVP schema, comparison view.
2. `0002_rls_policies.sql` - RLS and role-aware policies.
3. `0003_storage_buckets.sql` - source snapshot bucket and storage policies.

`supabase/seed.sql` creates only configurable pilot-region placeholders and reference values. It does not seed real DAMA legal facts, source URLs, occupation availability or concessions.
