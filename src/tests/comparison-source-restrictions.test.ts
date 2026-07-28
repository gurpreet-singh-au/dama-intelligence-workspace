import { describe, expect, it } from "vitest";
import { buildApprovedComparisonRows } from "@/features/comparison/comparison-policy";
import type { StructuredComparisonCandidate } from "@/types/database";

const approvedSource = {
  id: "source-1",
  workspaceId: "workspace-1",
  title: "Approved official source placeholder",
  authorityTier: "tier_2_dama_region_official_source",
  status: "approved_for_production_rules"
} as const;

function baseRecord(overrides: Partial<StructuredComparisonCandidate> = {}): StructuredComparisonCandidate {
  return {
    id: "rule-1",
    workspaceId: "workspace-1",
    damaRegionName: "Pilot DAMA",
    occupationTitle: "Source-backed occupation placeholder",
    anzscoCode: "unknown",
    matchType: "exact_title_match",
    reviewStatus: "approved",
    dataConfidence: "unknown",
    source: approvedSource,
    sourceSnapshotId: "snapshot-1",
    primaryCitationId: "citation-1",
    primaryCitationLabel: "Primary official source citation",
    conflictFlag: false,
    ...overrides
  };
}

describe("comparison source restrictions", () => {
  it("includes only approved structured records backed by production-approved sources and snapshots", () => {
    const rows = buildApprovedComparisonRows([baseRecord()]);

    expect(rows).toHaveLength(1);
    expect(rows[0].source.status).toBe("approved_for_production_rules");
  });

  it("blocks records with non-approved review status", () => {
    expect(buildApprovedComparisonRows([baseRecord({ reviewStatus: "reviewed" })])).toEqual([]);
  });

  it("blocks records whose sources are not approved for production rules", () => {
    expect(
      buildApprovedComparisonRows([
        baseRecord({
          source: {
            ...approvedSource,
            status: "approved_for_extraction"
          }
        })
      ])
    ).toEqual([]);
  });

  it("blocks records without a source snapshot reference", () => {
    expect(buildApprovedComparisonRows([baseRecord({ sourceSnapshotId: undefined })])).toEqual([]);
  });

  it("blocks records without a primary citation reference", () => {
    expect(buildApprovedComparisonRows([baseRecord({ primaryCitationId: undefined })])).toEqual([]);
  });

  it("defaults missing subclass and concession statuses to unknown", () => {
    const [row] = buildApprovedComparisonRows([baseRecord()]);

    expect(row.subclass482Status).toBe("unknown");
    expect(row.subclass186Status).toBe("unknown");
    expect(row.subclass494Status).toBe("unknown");
    expect(row.salaryConcessionStatus).toBe("unknown");
    expect(row.englishConcessionStatus).toBe("unknown");
    expect(row.ageConcessionStatus).toBe("unknown");
    expect(row.skillsConcessionStatus).toBe("unknown");
  });
});
