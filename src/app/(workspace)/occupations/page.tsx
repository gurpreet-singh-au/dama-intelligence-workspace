export default function OccupationsPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Occupation matching</div>
          <h1>Occupations</h1>
          <p>ANZSCO and alias structures are prepared for the first workflow. No real occupation availability is seeded.</p>
        </div>
      </div>
      <div className="empty-state">
        <h2>No occupation records seeded</h2>
        <p>Phase 2 should import source-backed occupation records after official sources and snapshots are approved.</p>
      </div>
    </>
  );
}
