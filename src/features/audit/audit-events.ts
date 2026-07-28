export const auditEventTypes = [
  "source_created",
  "source_updated",
  "source_status_changed",
  "snapshot_added",
  "candidate_extraction_record_created",
  "candidate_extraction_record_reviewed",
  "candidate_extraction_record_rejected",
  "candidate_extraction_record_promoted",
  "structured_rule_created",
  "structured_rule_approved",
  "comparison_table_accessed"
] as const;

export type AuditEventType = (typeof auditEventTypes)[number];
