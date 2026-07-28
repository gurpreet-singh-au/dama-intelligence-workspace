import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/0001_initial_schema.sql"), "utf8");
const rlsMigration = readFileSync(join(process.cwd(), "supabase/migrations/0002_rls_policies.sql"), "utf8");
const seed = readFileSync(join(process.cwd(), "supabase/seed.sql"), "utf8");

describe("schema migration safety gates", () => {
  it("defines the approved comparison view from structured rules, not candidate records", () => {
    const viewSql = migration.slice(migration.indexOf("create view public.approved_comparison_rows"));

    expect(viewSql).toContain("from public.dama_occupation_rules dor");
    expect(viewSql).toContain("dor.review_status = 'approved'");
    expect(viewSql).toContain("s.status = 'approved_for_production_rules'");
    expect(viewSql).not.toContain("candidate_extraction_records");
  });

  it("keeps RLS enabled for candidate records and audit events", () => {
    expect(rlsMigration).toContain("alter table public.candidate_extraction_records enable row level security;");
    expect(rlsMigration).toContain("alter table public.audit_events enable row level security;");
    expect(rlsMigration).toContain("Researchers create candidate records only");
  });

  it("does not seed occupation availability, subclass availability or concessions", () => {
    expect(seed).not.toContain("dama_occupation_rules");
    expect(seed).not.toContain("dama_visa_availability_rules");
    expect(seed).not.toContain("dama_concession_rules");
  });
});
