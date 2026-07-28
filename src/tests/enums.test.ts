import { describe, expect, it } from "vitest";
import {
  APP_ROLES,
  AVAILABILITY_STATUSES,
  DATA_CONFIDENCE_VALUES,
  EXTRACTION_RECORD_STATUSES,
  MATCH_TYPES,
  REVIEW_REQUIRED_REASONS,
  REVIEW_STATUSES,
  SOURCE_AUTHORITY_TIERS,
  SOURCE_STATUSES
} from "@/types/enums";

describe("canonical enums", () => {
  it("preserves source_status exactly", () => {
    expect(SOURCE_STATUSES).toEqual([
      "candidate",
      "verified",
      "approved_for_extraction",
      "approved_for_production_rules",
      "superseded",
      "conflicting_source",
      "unavailable",
      "rejected"
    ]);
  });

  it("preserves availability_status exactly", () => {
    expect(AVAILABILITY_STATUSES).toEqual(["available", "not_available", "unknown"]);
  });

  it("preserves review_status exactly", () => {
    expect(REVIEW_STATUSES).toEqual(["draft", "needs_review", "reviewed", "approved", "do_not_send"]);
  });

  it("preserves data_confidence exactly", () => {
    expect(DATA_CONFIDENCE_VALUES).toEqual(["high", "medium", "low", "conflicting", "unknown"]);
  });

  it("preserves match_type exactly", () => {
    expect(MATCH_TYPES).toEqual([
      "exact_anzsco_match",
      "exact_title_match",
      "synonym_match",
      "keyword_match",
      "related_occupation_match",
      "no_match"
    ]);
  });

  it("preserves review_required_reason exactly", () => {
    expect(REVIEW_REQUIRED_REASONS).toEqual([
      "missing_citation",
      "stale_source",
      "conflicting_source",
      "low_confidence_extraction",
      "occupation_ambiguity",
      "legal_interpretation_required",
      "source_hierarchy_conflict",
      "missing_effective_date",
      "superseded_source"
    ]);
  });

  it("preserves source_authority_tier exactly", () => {
    expect(SOURCE_AUTHORITY_TIERS).toEqual([
      "tier_1_commonwealth_government_or_formal_dama_instrument",
      "tier_2_dama_region_official_source",
      "tier_3_supporting_administrative_material",
      "tier_4_non_authoritative_reference"
    ]);
  });

  it("preserves app_role and extraction statuses exactly", () => {
    expect(APP_ROLES).toEqual([
      "owner",
      "lawyer_reviewer",
      "authorised_professional_reviewer",
      "admin_reviewer",
      "researcher",
      "viewer"
    ]);
    expect(EXTRACTION_RECORD_STATUSES).toEqual([
      "candidate",
      "needs_review",
      "rejected",
      "promoted_to_structured_record"
    ]);
  });
});
