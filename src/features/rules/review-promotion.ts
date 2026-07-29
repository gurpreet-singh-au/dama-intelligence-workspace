import { canApproveProductionRule } from "@/lib/permissions";
import type { MaterialRuleSafetyFields } from "@/types/database";
import type { AppRole } from "@/types/enums";
import { isComparisonSafeMaterialRule } from "./rule-validation";

export type PromotionDecision = {
  allowed: boolean;
  reason: string;
};

export function canPromoteProductionRule(args: {
  roles: AppRole[];
  rule: MaterialRuleSafetyFields;
}): PromotionDecision {
  if (!canApproveProductionRule(args.roles)) {
    return {
      allowed: false,
      reason: "Production legal rules can only be approved by a lawyer reviewer or authorised professional reviewer."
    };
  }

  if (!isComparisonSafeMaterialRule(args.rule)) {
    return {
      allowed: false,
      reason: "Rule is missing approved source, snapshot, primary citation, clean review state or comparison-safe status."
    };
  }

  return {
    allowed: true,
    reason: "Rule is eligible for professional approval promotion."
  };
}
