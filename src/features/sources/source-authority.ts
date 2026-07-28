import type { SourceAuthorityTier } from "@/types/enums";

export const sourceAuthorityLabels: Record<SourceAuthorityTier, string> = {
  tier_1_commonwealth_government_or_formal_dama_instrument: "Tier 1 - Commonwealth government or formal DAMA instrument",
  tier_2_dama_region_official_source: "Tier 2 - DAMA region official source",
  tier_3_supporting_administrative_material: "Tier 3 - Supporting administrative material",
  tier_4_non_authoritative_reference: "Tier 4 - Non-authoritative reference"
};

export function canSupportProductionRules(tier: SourceAuthorityTier): boolean {
  return (
    tier === "tier_1_commonwealth_government_or_formal_dama_instrument" ||
    tier === "tier_2_dama_region_official_source"
  );
}
