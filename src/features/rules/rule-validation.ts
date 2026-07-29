import type {
  Citation,
  EntityCitation,
  MaterialRuleSafetyFields,
  SourceRecord,
  StructuredConcessionRule,
  StructuredComparisonCandidate,
  StructuredVisaAvailabilityRule
} from "@/types/database";
import type { AvailabilityStatus } from "@/types/enums";

export type MaterialRuleEntityType =
  | "dama_occupation_rule"
  | "dama_visa_availability_rule"
  | "dama_concession_rule";

export type RuleCitationContext = {
  entityType: MaterialRuleEntityType;
  entityId: string;
  workspaceId: string;
  source: SourceRecord | null;
  sourceSnapshotId?: string;
  primaryCitationId?: string;
  entityCitations: EntityCitation[];
  citations: Citation[];
};

export function hasSameWorkspacePrimaryCitationChain(args: RuleCitationContext): boolean {
  if (!args.source || !args.sourceSnapshotId || !args.primaryCitationId) {
    return false;
  }

  if (args.source.workspaceId !== args.workspaceId) {
    return false;
  }

  return args.entityCitations.some((entityCitation) => {
    const citation = args.citations.find((candidate) => candidate.id === entityCitation.citationId);

    return (
      Boolean(citation) &&
      entityCitation.workspaceId === args.workspaceId &&
      entityCitation.entityType === args.entityType &&
      entityCitation.entityId === args.entityId &&
      entityCitation.citationRole === "primary_support" &&
      entityCitation.citationId === args.primaryCitationId &&
      citation?.workspaceId === args.workspaceId &&
      citation?.sourceId === args.source?.id &&
      citation?.sourceSnapshotId === args.sourceSnapshotId
    );
  });
}

export function isComparisonSafeMaterialRule(
  rule: MaterialRuleSafetyFields,
  citationContext?: Omit<RuleCitationContext, "entityId" | "workspaceId" | "source" | "sourceSnapshotId" | "primaryCitationId">
): boolean {
  if (
    rule.reviewStatus !== "approved" ||
    rule.source?.status !== "approved_for_production_rules" ||
    !rule.sourceSnapshotId ||
    !rule.primaryCitationId ||
    rule.supersededDate ||
    rule.conflictFlag ||
    rule.reviewRequiredReason ||
    rule.dataConfidence === "low" ||
    rule.dataConfidence === "conflicting"
  ) {
    return false;
  }

  if (!citationContext) {
    return true;
  }

  return hasSameWorkspacePrimaryCitationChain({
    ...citationContext,
    entityId: rule.id,
    workspaceId: rule.workspaceId,
    source: rule.source,
    sourceSnapshotId: rule.sourceSnapshotId,
    primaryCitationId: rule.primaryCitationId
  });
}

export function safeAvailabilityOrUnknown<T extends StructuredVisaAvailabilityRule | StructuredConcessionRule>(
  rule: T | undefined,
  entityType: MaterialRuleEntityType
): AvailabilityStatus {
  if (!rule) {
    return "unknown";
  }

  const isSafe = isComparisonSafeMaterialRule(rule, {
    entityType,
    entityCitations: rule.entityCitations ?? [],
    citations: rule.citations ?? []
  });

  return isSafe ? rule.availabilityStatus : "unknown";
}

export function isStructuredComparisonCandidateSafe(record: StructuredComparisonCandidate): boolean {
  return isComparisonSafeMaterialRule(
    {
      id: record.id,
      workspaceId: record.workspaceId,
      reviewStatus: record.reviewStatus,
      dataConfidence: record.dataConfidence,
      reviewRequiredReason: record.reviewRequiredReason,
      source: record.source,
      sourceSnapshotId: record.sourceSnapshotId,
      primaryCitationId: record.primaryCitationId,
      supersededDate: record.supersededDate,
      conflictFlag: record.conflictFlag
    },
    {
      entityType: "dama_occupation_rule",
      entityCitations: record.entityCitations ?? [],
      citations: record.citations ?? []
    }
  );
}
