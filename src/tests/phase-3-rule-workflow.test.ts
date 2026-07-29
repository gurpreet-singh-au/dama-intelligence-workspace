import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildApprovedComparisonRows } from "@/features/comparison/comparison-policy";
import { canPromoteProductionRule } from "@/features/rules/review-promotion";
import type {
  Citation,
  EntityCitation,
  MaterialRuleSafetyFields,
  SourceRecord,
  StructuredComparisonCandidate,
  StructuredConcessionRule,
  StructuredVisaAvailabilityRule
} from "@/types/database";

const phaseThreeMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/0005_structured_rule_workflow.sql"),
  "utf8"
);

const approvedSource: SourceRecord = {
  id: "source-1",
  workspaceId: "workspace-1",
  title: "Approved official source placeholder",
  authorityTier: "tier_2_dama_region_official_source",
  status: "approved_for_production_rules"
};

const parentCitation: Citation = {
  id: "parent-citation-1",
  workspaceId: "workspace-1",
  sourceId: "source-1",
  sourceSnapshotId: "snapshot-1",
  citationLabel: "Parent rule citation",
  accessedAt: "2026-07-28T00:00:00Z"
};

const parentEntityCitation: EntityCitation = {
  id: "parent-entity-citation-1",
  workspaceId: "workspace-1",
  entityType: "dama_occupation_rule",
  entityId: "occupation-rule-1",
  citationId: "parent-citation-1",
  citationRole: "primary_support"
};

function childCitation(entityType: "dama_visa_availability_rule" | "dama_concession_rule", entityId: string) {
  const citation: Citation = {
    id: `${entityId}-citation`,
    workspaceId: "workspace-1",
    sourceId: "source-1",
    sourceSnapshotId: "snapshot-1",
    citationLabel: `${entityId} citation`,
    accessedAt: "2026-07-28T00:00:00Z"
  };

  const entityCitation: EntityCitation = {
    id: `${entityId}-entity-citation`,
    workspaceId: "workspace-1",
    entityType,
    entityId,
    citationId: citation.id,
    citationRole: "primary_support"
  };

  return { citation, entityCitation };
}

function baseRecord(overrides: Partial<StructuredComparisonCandidate> = {}): StructuredComparisonCandidate {
  return {
    id: "occupation-rule-1",
    workspaceId: "workspace-1",
    damaRegionName: "Pilot DAMA",
    occupationTitle: "Source-backed occupation placeholder",
    matchType: "exact_title_match",
    reviewStatus: "approved",
    dataConfidence: "unknown",
    source: approvedSource,
    sourceSnapshotId: "snapshot-1",
    primaryCitationId: "parent-citation-1",
    entityCitations: [parentEntityCitation],
    citations: [parentCitation],
    conflictFlag: false,
    ...overrides
  };
}

function visaRule(overrides: Partial<StructuredVisaAvailabilityRule> = {}): StructuredVisaAvailabilityRule {
  const { citation, entityCitation } = childCitation("dama_visa_availability_rule", "visa-rule-482");

  return {
    id: "visa-rule-482",
    workspaceId: "workspace-1",
    subclass: "482",
    availabilityStatus: "available",
    reviewStatus: "approved",
    dataConfidence: "unknown",
    source: approvedSource,
    sourceSnapshotId: "snapshot-1",
    primaryCitationId: citation.id,
    entityCitations: [entityCitation],
    citations: [citation],
    conflictFlag: false,
    ...overrides
  };
}

function concessionRule(overrides: Partial<StructuredConcessionRule> = {}): StructuredConcessionRule {
  const { citation, entityCitation } = childCitation("dama_concession_rule", "concession-rule-salary");

  return {
    id: "concession-rule-salary",
    workspaceId: "workspace-1",
    concessionType: "salary",
    availabilityStatus: "available",
    reviewStatus: "approved",
    dataConfidence: "unknown",
    source: approvedSource,
    sourceSnapshotId: "snapshot-1",
    primaryCitationId: citation.id,
    entityCitations: [entityCitation],
    citations: [citation],
    conflictFlag: false,
    ...overrides
  };
}

function promotionRule(overrides: Partial<MaterialRuleSafetyFields> = {}): MaterialRuleSafetyFields {
  return {
    id: "rule-1",
    workspaceId: "workspace-1",
    reviewStatus: "approved",
    dataConfidence: "unknown",
    source: approvedSource,
    sourceSnapshotId: "snapshot-1",
    primaryCitationId: "citation-1",
    conflictFlag: false,
    ...overrides
  };
}

describe("Phase 3 structured rule workflow", () => {
  it("requires independently cited visa subclass rules before comparison use", () => {
    const [safeRow] = buildApprovedComparisonRows([
      baseRecord({ visaAvailabilityRules: [visaRule()] })
    ]);
    const [unsafeRow] = buildApprovedComparisonRows([
      baseRecord({ visaAvailabilityRules: [visaRule({ primaryCitationId: undefined })] })
    ]);

    expect(safeRow.subclass482Status).toBe("available");
    expect(unsafeRow.subclass482Status).toBe("unknown");
  });

  it("requires independently cited concession rules before comparison use", () => {
    const [safeRow] = buildApprovedComparisonRows([
      baseRecord({ concessionRules: [concessionRule()] })
    ]);
    const [unsafeRow] = buildApprovedComparisonRows([
      baseRecord({ concessionRules: [concessionRule({ sourceSnapshotId: undefined })] })
    ]);

    expect(safeRow.salaryConcessionStatus).toBe("available");
    expect(unsafeRow.salaryConcessionStatus).toBe("unknown");
  });

  it("does not infer subclass or concession availability from occupation approval", () => {
    const [row] = buildApprovedComparisonRows([
      baseRecord({
        subclass482Status: "available",
        salaryConcessionStatus: "available"
      })
    ]);

    expect(row.subclass482Status).toBe("unknown");
    expect(row.salaryConcessionStatus).toBe("unknown");
  });

  it("prevents owner-only production legal approval promotion", () => {
    expect(canPromoteProductionRule({ roles: ["owner"], rule: promotionRule() }).allowed).toBe(false);
    expect(
      canPromoteProductionRule({
        roles: ["lawyer_reviewer"],
        rule: promotionRule()
      }).allowed
    ).toBe(true);
  });

  it("adds Phase 3 child-rule citation gates to the database view", () => {
    expect(phaseThreeMigration).toContain("add column source_snapshot_id uuid references public.source_snapshots(id)");
    expect(phaseThreeMigration).toContain("vec.entity_type = 'dama_visa_availability_rule'");
    expect(phaseThreeMigration).toContain("cec.entity_type = 'dama_concession_rule'");
    expect(phaseThreeMigration).toContain("vc.source_snapshot_id = v.source_snapshot_id");
    expect(phaseThreeMigration).toContain("cc.source_snapshot_id = ccr.source_snapshot_id");
    expect(phaseThreeMigration).toContain("coalesce(v482.availability_status, 'unknown'::public.availability_status)");
    expect(phaseThreeMigration).not.toContain("candidate_extraction_records");
  });
});
