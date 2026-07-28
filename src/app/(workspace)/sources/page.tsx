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
        <h2>Source list</h2>
        <p>{sourceRegisterEmptyState}</p>
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
