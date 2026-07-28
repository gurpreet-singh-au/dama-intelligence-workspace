import { auditEventTypes } from "@/features/audit/audit-events";

export default function AuditLogPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Audit foundation</div>
          <h1>Audit Log</h1>
          <p>Append-only audit event structures are ready for source, snapshot, candidate, review and comparison events.</p>
        </div>
      </div>
      <section className="card">
        <h2>Tracked event types</h2>
        {auditEventTypes.map((eventType) => (
          <p key={eventType}>{eventType}</p>
        ))}
      </section>
    </>
  );
}
