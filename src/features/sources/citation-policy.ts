import type { Citation, EntityCitation, SourceRecord } from "@/types/database";

export const citationBackboneEmptyState =
  "Phase 2 is ready for source metadata, immutable snapshots, extracted text chunks, citation records and source governance notes. No real DAMA facts are seeded.";

export function hasPrimaryCitationForEntity(
  entityType: EntityCitation["entityType"],
  entityId: string,
  entityCitations: EntityCitation[]
): boolean {
  return entityCitations.some(
    (entityCitation) =>
      entityCitation.entityType === entityType &&
      entityCitation.entityId === entityId &&
      entityCitation.citationRole === "primary_support"
  );
}

export function canDisplayMaterialRuleAsVerified(args: {
  source: SourceRecord | null;
  sourceSnapshotId?: string;
  entityType: EntityCitation["entityType"];
  entityId: string;
  entityCitations: EntityCitation[];
  citations: Citation[];
}): boolean {
  if (!args.source || args.source.status !== "approved_for_production_rules" || !args.sourceSnapshotId) {
    return false;
  }

  return args.entityCitations.some((entityCitation) => {
    const citation = args.citations.find((candidate) => candidate.id === entityCitation.citationId);

    return (
      Boolean(citation) &&
      entityCitation.entityType === args.entityType &&
      entityCitation.entityId === args.entityId &&
      entityCitation.citationRole === "primary_support" &&
      citation?.sourceId === args.source?.id &&
      citation?.sourceSnapshotId === args.sourceSnapshotId
    );
  });
}
