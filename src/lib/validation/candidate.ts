import { z } from "zod";
import { DATA_CONFIDENCE_VALUES, EXTRACTION_RECORD_STATUSES, REVIEW_REQUIRED_REASONS } from "@/types/enums";

export const candidateExtractionSchema = z.object({
  workspaceId: z.string().uuid(),
  sourceId: z.string().uuid().optional(),
  extractedPayload: z.record(z.unknown()).default({}),
  status: z.enum(EXTRACTION_RECORD_STATUSES).refine((status) => status !== "promoted_to_structured_record", {
    message: "Promotion requires a reviewed structured record workflow, not direct candidate insertion."
  }),
  dataConfidence: z.enum(DATA_CONFIDENCE_VALUES).default("unknown"),
  reviewRequiredReason: z.enum(REVIEW_REQUIRED_REASONS).optional(),
  notes: z.string().optional()
});
