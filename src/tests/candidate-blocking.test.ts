import { describe, expect, it } from "vitest";
import { candidateRecordsToComparisonRows } from "@/features/comparison/comparison-policy";
import { candidateExtractionSchema } from "@/lib/validation/candidate";
import type { CandidateExtractionRecord } from "@/types/database";

describe("candidate blocking", () => {
  it("never converts candidate extraction records to production comparison rows", () => {
    const candidates: CandidateExtractionRecord[] = [
      {
        id: "candidate-1",
        workspaceId: "workspace-1",
        status: "candidate",
        dataConfidence: "low",
        reviewRequiredReason: "low_confidence_extraction"
      }
    ];

    expect(candidateRecordsToComparisonRows(candidates)).toEqual([]);
  });

  it("rejects direct insertion as a promoted structured record", () => {
    const result = candidateExtractionSchema.safeParse({
      workspaceId: "00000000-0000-0000-0000-000000000001",
      extractedPayload: {},
      status: "promoted_to_structured_record",
      dataConfidence: "unknown"
    });

    expect(result.success).toBe(false);
  });
});
