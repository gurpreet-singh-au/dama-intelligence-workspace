import {
  COMPARISON_WARNING,
  INTERNAL_WORKSPACE_WARNING,
  availabilityLabel
} from "@/lib/legal-safety";
import {
  isStructuredComparisonCandidateSafe,
  safeAvailabilityOrUnknown
} from "@/features/rules/rule-validation";
import type { ApprovedComparisonRow, CandidateExtractionRecord, StructuredComparisonCandidate } from "@/types/database";

export function isApprovedComparisonCandidate(record: StructuredComparisonCandidate): boolean {
  return isStructuredComparisonCandidateSafe(record);
}

export function buildApprovedComparisonRows(records: StructuredComparisonCandidate[]): ApprovedComparisonRow[] {
  return records.filter(isApprovedComparisonCandidate).map((record) => {
    const subclass482Rule = record.visaAvailabilityRules?.find((rule) => rule.subclass === "482");
    const subclass186Rule = record.visaAvailabilityRules?.find((rule) => rule.subclass === "186");
    const subclass494Rule = record.visaAvailabilityRules?.find((rule) => rule.subclass === "494");
    const salaryConcessionRule = record.concessionRules?.find((rule) => rule.concessionType === "salary");
    const englishConcessionRule = record.concessionRules?.find((rule) => rule.concessionType === "english");
    const ageConcessionRule = record.concessionRules?.find((rule) => rule.concessionType === "age");
    const skillsConcessionRule = record.concessionRules?.find((rule) => rule.concessionType === "skills");

    return {
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
      subclass482Status: availabilityLabel(
        subclass482Rule
          ? safeAvailabilityOrUnknown(subclass482Rule, "dama_visa_availability_rule")
          : undefined
      ),
      subclass186Status: availabilityLabel(
        subclass186Rule
          ? safeAvailabilityOrUnknown(subclass186Rule, "dama_visa_availability_rule")
          : undefined
      ),
      subclass494Status: availabilityLabel(
        subclass494Rule
          ? safeAvailabilityOrUnknown(subclass494Rule, "dama_visa_availability_rule")
          : undefined
      ),
      salaryConcessionStatus: availabilityLabel(
        salaryConcessionRule
          ? safeAvailabilityOrUnknown(salaryConcessionRule, "dama_concession_rule")
          : undefined
      ),
      englishConcessionStatus: availabilityLabel(
        englishConcessionRule
          ? safeAvailabilityOrUnknown(englishConcessionRule, "dama_concession_rule")
          : undefined
      ),
      ageConcessionStatus: availabilityLabel(
        ageConcessionRule
          ? safeAvailabilityOrUnknown(ageConcessionRule, "dama_concession_rule")
          : undefined
      ),
      skillsConcessionStatus: availabilityLabel(
        skillsConcessionRule
          ? safeAvailabilityOrUnknown(skillsConcessionRule, "dama_concession_rule")
          : undefined
      ),
      internalWarningLabel: INTERNAL_WORKSPACE_WARNING
    };
  });
}

export function candidateRecordsToComparisonRows(_records: CandidateExtractionRecord[]): ApprovedComparisonRow[] {
  return [];
}

export const comparisonSafetyCopy = {
  internalWarning: INTERNAL_WORKSPACE_WARNING,
  comparisonWarning: COMPARISON_WARNING,
  unavailableMessage: "The data is not available in the structured source records."
};
