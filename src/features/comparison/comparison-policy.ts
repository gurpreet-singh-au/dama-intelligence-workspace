import {
  COMPARISON_WARNING,
  INTERNAL_WORKSPACE_WARNING,
  availabilityLabel
} from "@/lib/legal-safety";
import type { ApprovedComparisonRow, CandidateExtractionRecord, StructuredComparisonCandidate } from "@/types/database";

export function isApprovedComparisonCandidate(record: StructuredComparisonCandidate): boolean {
  return Boolean(
    record.reviewStatus === "approved" &&
      record.source?.status === "approved_for_production_rules" &&
      record.source &&
      record.source.id &&
      record.sourceSnapshotId &&
      record.primaryCitationId &&
      !record.supersededDate
  );
}

export function buildApprovedComparisonRows(records: StructuredComparisonCandidate[]): ApprovedComparisonRow[] {
  return records.filter(isApprovedComparisonCandidate).map((record) => ({
    workspaceId: record.workspaceId,
    damaRegionName: record.damaRegionName,
    occupationTitle: record.occupationTitle,
    anzscoCode: record.anzscoCode ?? "unknown",
    matchType: record.matchType,
    ruleId: record.id,
    reviewStatus: record.reviewStatus,
    dataConfidence: record.dataConfidence,
    reviewRequiredReason: record.reviewRequiredReason,
    conflictFlag: record.conflictFlag,
    source: record.source as ApprovedComparisonRow["source"],
    sourceTitle: record.source?.title ?? "Unknown source",
    sourceUrl: record.source?.url,
    sourceReference: record.source?.url ?? record.source?.title ?? "Unknown source reference",
    sourceAuthorityTier:
      record.source?.authorityTier ?? "tier_4_non_authoritative_reference",
    sourceDate: record.source?.sourceDate,
    accessedAt: record.source?.accessedAt,
    sourceSnapshotId: record.sourceSnapshotId as string,
    primaryCitationId: record.primaryCitationId as string,
    primaryCitationLabel: record.primaryCitationLabel ?? "Primary citation",
    effectiveDate: record.source?.effectiveDate,
    supersededDate: record.supersededDate,
    subclass482Status: availabilityLabel(record.subclass482Status),
    subclass186Status: availabilityLabel(record.subclass186Status),
    subclass494Status: availabilityLabel(record.subclass494Status),
    salaryConcessionStatus: availabilityLabel(record.salaryConcessionStatus),
    englishConcessionStatus: availabilityLabel(record.englishConcessionStatus),
    ageConcessionStatus: availabilityLabel(record.ageConcessionStatus),
    skillsConcessionStatus: availabilityLabel(record.skillsConcessionStatus),
    internalWarningLabel: INTERNAL_WORKSPACE_WARNING
  }));
}

export function candidateRecordsToComparisonRows(_records: CandidateExtractionRecord[]): ApprovedComparisonRow[] {
  return [];
}

export const comparisonSafetyCopy = {
  internalWarning: INTERNAL_WORKSPACE_WARNING,
  comparisonWarning: COMPARISON_WARNING,
  unavailableMessage: "The data is not available in the structured source records."
};
