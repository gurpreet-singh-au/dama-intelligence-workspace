import { describe, expect, it } from "vitest";
import { canSupportProductionRules, sourceAuthorityLabels } from "@/features/sources/source-authority";

describe("source hierarchy mapping", () => {
  it("labels all approved source authority tiers", () => {
    expect(Object.keys(sourceAuthorityLabels)).toEqual([
      "tier_1_commonwealth_government_or_formal_dama_instrument",
      "tier_2_dama_region_official_source",
      "tier_3_supporting_administrative_material",
      "tier_4_non_authoritative_reference"
    ]);
  });

  it("does not allow Tier 4 sources to support production rules", () => {
    expect(canSupportProductionRules("tier_4_non_authoritative_reference")).toBe(false);
  });

  it("allows only Tier 1 and Tier 2 sources as production authority tiers", () => {
    expect(canSupportProductionRules("tier_1_commonwealth_government_or_formal_dama_instrument")).toBe(true);
    expect(canSupportProductionRules("tier_2_dama_region_official_source")).toBe(true);
    expect(canSupportProductionRules("tier_3_supporting_administrative_material")).toBe(false);
  });
});
