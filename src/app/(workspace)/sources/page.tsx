import { StatusPill } from "@/components/ui/StatusPill";
import { sourceRegisterEmptyState } from "@/features/sources/mock-data";
import { sourceAuthorityLabels } from "@/features/sources/source-authority";

export default function SourcesPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Source register</div>
          <h1>Sources</h1>
          <p>Register official source metadata, authority tier, status, snapshot references and review notes.</p>
        </div>
        <StatusPill>internal only</StatusPill>
      </div>
      <div className="empty-state">
        <h2>Source and citation backbone</h2>
        <p>{sourceRegisterEmptyState}</p>
      </div>
      <br />
      <div className="grid">
        <section className="card">
          <h2>Required evidence chain</h2>
          <ol className="compact-list">
            <li>Source metadata with approved authority tier and status.</li>
            <li>Snapshot reference with storage path, hash and access date.</li>
            <li>Extracted text chunk where exact evidence can be inspected.</li>
            <li>Primary citation linked to the structured entity under review.</li>
          </ol>
        </section>
        <section className="card">
          <h2>Verification gate</h2>
          <p>Material DAMA rules stay unverified until the source, snapshot and primary citation all align. Governance notes support review but never replace Tier 1 or Tier 2 authority.</p>
        </section>
      </div>
      <br />
      <section className="card">
        <h2>Authority hierarchy</h2>
        {Object.entries(sourceAuthorityLabels).map(([tier, label]) => (
          <p key={tier}>
            <strong>{label}</strong>
          </p>
        ))}
      </section>
    </>
  );
}
