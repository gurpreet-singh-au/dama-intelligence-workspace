import type { AvailabilityStatus, ReviewStatus } from "@/types/enums";

export const INTERNAL_WORKSPACE_WARNING = "Internal preliminary workspace only. Not client-facing legal advice.";

export const AI_ASSISTED_RESEARCH_NOTE =
  "AI-assisted research note. Source-backed where cited. Requires lawyer or authorised professional verification before client advice, lodgement strategy, submission drafting or action.";

export const COMPARISON_WARNING =
  "This comparison is based on available structured DAMA records and cited sources. It is not a final eligibility assessment.";

export const CANDIDATE_RECORD_WARNING =
  "Candidate record. Requires lawyer or authorised professional review before use in production comparison outputs.";

export const UNKNOWN_AVAILABILITY_WARNING =
  "Unknown availability. The source does not clearly state availability. Do not infer availability from silence.";

export const APPROVED_STRUCTURED_RECORD_LABEL =
  "Approved structured record. May support internal comparison output subject to citation and review controls.";

export function availabilityLabel(status: AvailabilityStatus | undefined): AvailabilityStatus {
  return status ?? "unknown";
}

export function legalSafetyLabelForReviewStatus(status: ReviewStatus): string {
  if (status === "approved") {
    return APPROVED_STRUCTURED_RECORD_LABEL;
  }

  if (status === "do_not_send") {
    return "Do-not-send record. Blocked from production comparison outputs.";
  }

  return CANDIDATE_RECORD_WARNING;
}
