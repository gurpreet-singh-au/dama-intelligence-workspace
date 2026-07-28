import { describe, expect, it } from "vitest";
import { canApproveProductionRule, canCreateCandidateExtraction, hasPermission } from "@/lib/permissions";

describe("RLS role assumptions mirrored in application helpers", () => {
  it("prevents viewers and researchers from approval actions", () => {
    expect(canApproveProductionRule(["viewer"])).toBe(false);
    expect(canApproveProductionRule(["researcher"])).toBe(false);
  });

  it("prevents owner status alone from legal production approval", () => {
    expect(canApproveProductionRule(["owner"])).toBe(false);
    expect(canApproveProductionRule(["owner", "lawyer_reviewer"])).toBe(true);
  });

  it("allows researchers to create candidate records", () => {
    expect(canCreateCandidateExtraction(["researcher"])).toBe(true);
  });

  it("keeps viewers read-only", () => {
    expect(hasPermission(["viewer"], "read_internal_records")).toBe(true);
    expect(hasPermission(["viewer"], "create_source")).toBe(false);
  });
});
