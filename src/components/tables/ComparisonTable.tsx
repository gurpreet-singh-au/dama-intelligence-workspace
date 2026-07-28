import { UNKNOWN_AVAILABILITY_WARNING } from "@/lib/legal-safety";
import type { ApprovedComparisonRow } from "@/types/database";
import { StatusPill } from "../ui/StatusPill";

export function ComparisonTable({ rows }: { rows: ApprovedComparisonRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <h2>No approved comparison rows</h2>
        <p>The data is not available in the structured source records.</p>
        <p>{UNKNOWN_AVAILABILITY_WARNING}</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>DAMA Region</th>
            <th>Occupation</th>
            <th>ANZSCO</th>
            <th>Match</th>
            <th>482</th>
            <th>186</th>
            <th>494</th>
            <th>Salary</th>
            <th>English</th>
            <th>Age</th>
            <th>Skills</th>
            <th>Source Title</th>
            <th>Source URL / Reference</th>
            <th>Authority Tier</th>
            <th>Source Date</th>
            <th>Accessed At</th>
            <th>Snapshot ID</th>
            <th>Effective Date</th>
            <th>Superseded Date</th>
            <th>Review</th>
            <th>Review Required</th>
            <th>Confidence</th>
            <th>Conflict</th>
            <th>Internal Warning</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.ruleId}>
              <td>{row.damaRegionName}</td>
              <td>{row.occupationTitle}</td>
              <td>{row.anzscoCode}</td>
              <td>
                <StatusPill>{row.matchType}</StatusPill>
              </td>
              <td>{row.subclass482Status}</td>
              <td>{row.subclass186Status}</td>
              <td>{row.subclass494Status}</td>
              <td>{row.salaryConcessionStatus}</td>
              <td>{row.englishConcessionStatus}</td>
              <td>{row.ageConcessionStatus}</td>
              <td>{row.skillsConcessionStatus}</td>
              <td>{row.sourceTitle}</td>
              <td>
                {row.sourceUrl ? (
                  <a href={row.sourceUrl} target="_blank" rel="noreferrer">
                    {row.sourceUrl}
                  </a>
                ) : (
                  row.sourceReference
                )}
              </td>
              <td>{row.sourceAuthorityTier}</td>
              <td>{row.sourceDate ?? "unknown"}</td>
              <td>{row.accessedAt ?? "unknown"}</td>
              <td>{row.sourceSnapshotId}</td>
              <td>{row.effectiveDate ?? "unknown"}</td>
              <td>{row.supersededDate ?? "not superseded"}</td>
              <td>
                <StatusPill>{row.reviewStatus}</StatusPill>
              </td>
              <td>{row.reviewRequiredReason ?? "none"}</td>
              <td>{row.dataConfidence}</td>
              <td>{row.conflictFlag ? "conflict flagged" : "no conflict flag"}</td>
              <td>{row.internalWarningLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
