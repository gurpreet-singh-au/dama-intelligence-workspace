import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  canDisplayMaterialRuleAsVerified,
  hasPrimaryCitationForEntity
} from "@/features/sources/citation-policy";
import type { Citation, EntityCitation, SourceRecord } from "@/types/database";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/0004_source_citation_backbone.sql"), "utf8");

const approvedSource: SourceRecord = {
  id: "source-1",
  workspaceId: "workspace-1",
  title: "Approved official source placeholder",
  authorityTier: "tier_2_dama_region_official_source",
  status: "approved_for_production_rules"
};

const primaryCitation: Citation = {
  id: "citation-1",
  workspaceId: "workspace-1",
  sourceId: "source-1",
  sourceSnapshotId: "snapshot-1",
  citationLabel: "Official source, captured snapshot",
  accessedAt: "2026-07-28T00:00:00Z"
};

const entityCitation: EntityCitation = {
  id: "entity-citation-1",
  workspaceId: "workspace-1",
  entityType: "dama_occupation_rule",
  entityId: "rule-1",
  citationId: "citation-1",
  citationRole: "primary_support"
};

describe("Phase 2 citation backbone", () => {
  it("adds source extracts, citations, entity citations and governance notes with RLS", () => {
    expect(migration).toContain("create table public.source_snapshot_extracts");
    expect(migration).toContain("create table public.citations");
    expect(migration).toContain("create table public.entity_citations");
    expect(migration).toContain("create table public.source_governance_notes");
    expect(migration).toContain("alter table public.citations enable row level security;");
  });

  it("requires a primary support citation before displaying a material rule as verified", () => {
    expect(
      canDisplayMaterialRuleAsVerified({
        source: approvedSource,
        sourceSnapshotId: "snapshot-1",
        entityType: "dama_occupation_rule",
        entityId: "rule-1",
        entityCitations: [entityCitation],
        citations: [primaryCitation]
      })
    ).toBe(true);
  });

  it("does not verify material rules without a matching source, snapshot and citation chain", () => {
    expect(hasPrimaryCitationForEntity("dama_occupation_rule", "rule-1", [])).toBe(false);
    expect(
      canDisplayMaterialRuleAsVerified({
        source: approvedSource,
        sourceSnapshotId: "different-snapshot",
        entityType: "dama_occupation_rule",
        entityId: "rule-1",
        entityCitations: [entityCitation],
        citations: [primaryCitation]
      })
    ).toBe(false);
  });

  it("tightens approved comparison rows to primary citations and excludes candidate records", () => {
    const viewSql = migration.slice(migration.indexOf("create view public.approved_comparison_rows"));

    expect(viewSql).toContain("ec.citation_role = 'primary_support'");
    expect(viewSql).toContain("c.source_snapshot_id = dor.source_snapshot_id");
    expect(viewSql).not.toContain("candidate_extraction_records");
  });
});
