import { RuleEntryFoundation } from "@/components/rules/RuleEntryFoundation";
import { LegalSafetyBanner } from "@/components/legal-safety/LegalSafetyBanner";
import { INTERNAL_WORKSPACE_WARNING } from "@/lib/legal-safety";

export default function RulesPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Phase 3 rule workflow</div>
          <h1>Structured Rules</h1>
          <p>Manual internal foundations for occupation, subclass availability and concession rule entry.</p>
        </div>
      </div>
      <LegalSafetyBanner>{INTERNAL_WORKSPACE_WARNING}</LegalSafetyBanner>
      <RuleEntryFoundation />
    </>
  );
}
