import { LegalSafetyBanner } from "@/components/legal-safety/LegalSafetyBanner";
import { ComparisonTable } from "@/components/tables/ComparisonTable";
import { buildApprovedComparisonRows, comparisonSafetyCopy } from "@/features/comparison/comparison-policy";

const rows = buildApprovedComparisonRows([]);

export default function ComparisonPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Internal comparison table</div>
          <h1>Occupation + ANZSCO Comparison</h1>
          <p>Approved structured records only. Unknown is used where subclass or concession availability is not clearly sourced.</p>
        </div>
      </div>
      <LegalSafetyBanner>{comparisonSafetyCopy.internalWarning}</LegalSafetyBanner>
      <br />
      <LegalSafetyBanner>{comparisonSafetyCopy.comparisonWarning}</LegalSafetyBanner>
      <br />
      <ComparisonTable rows={rows} />
    </>
  );
}
