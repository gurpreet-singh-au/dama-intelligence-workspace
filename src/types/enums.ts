export const SOURCE_STATUSES = [
  "candidate",
  "verified",
  "approved_for_extraction",
  "approved_for_production_rules",
  "superseded",
  "conflicting_source",
  "unavailable",
  "rejected"
] as const;

export const AVAILABILITY_STATUSES = ["available", "not_available", "unknown"] as const;

export const REVIEW_STATUSES = ["draft", "needs_review", "reviewed", "approved", "do_not_send"] as const;

export const DATA_CONFIDENCE_VALUES = ["high", "medium", "low", "conflicting", "unknown"] as const;

export const MATCH_TYPES = [
  "exact_anzsco_match",
  "exact_title_match",
  "synonym_match",
  "keyword_match",
  "related_occupation_match",
  "no_match"
] as const;

export const REVIEW_REQUIRED_REASONS = [
  "missing_citation",
  "stale_source",
  "conflicting_source",
  "low_confidence_extraction",
  "occupation_ambiguity",
  "legal_interpretation_required",
  "source_hierarchy_conflict",
  "missing_effective_date",
  "superseded_source"
] as const;

export const SOURCE_AUTHORITY_TIERS = [
  "tier_1_commonwealth_government_or_formal_dama_instrument",
  "tier_2_dama_region_official_source",
  "tier_3_supporting_administrative_material",
  "tier_4_non_authoritative_reference"
] as const;

export const APP_ROLES = [
  "owner",
  "lawyer_reviewer",
  "authorised_professional_reviewer",
  "admin_reviewer",
  "researcher",
  "viewer"
] as const;

export const EXTRACTION_RECORD_STATUSES = [
  "candidate",
  "needs_review",
  "rejected",
  "promoted_to_structured_record"
] as const;

export type SourceStatus = (typeof SOURCE_STATUSES)[number];
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export type DataConfidence = (typeof DATA_CONFIDENCE_VALUES)[number];
export type MatchType = (typeof MATCH_TYPES)[number];
export type ReviewRequiredReason = (typeof REVIEW_REQUIRED_REASONS)[number];
export type SourceAuthorityTier = (typeof SOURCE_AUTHORITY_TIERS)[number];
export type AppRole = (typeof APP_ROLES)[number];
export type ExtractionRecordStatus = (typeof EXTRACTION_RECORD_STATUSES)[number];
