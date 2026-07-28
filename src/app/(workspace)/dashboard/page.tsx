import { LegalSafetyBanner } from "@/components/legal-safety/LegalSafetyBanner";
import { AI_ASSISTED_RESEARCH_NOTE, INTERNAL_WORKSPACE_WARNING } from "@/lib/legal-safety";

export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Phase 1 foundation</div>
          <h1>Internal DAMA workspace</h1>
          <p>Controlled MVP foundation for source register, candidate queue, audit logging and approved-record comparison.</p>
        </div>
      </div>
      <div className="grid">
        <section className="card">
          <h2>Production comparison gate</h2>
          <p>Only approved structured records with approved production sources and snapshot references can appear in comparison rows.</p>
        </section>
        <section className="card">
          <h2>Candidate extraction queue</h2>
          <p>Candidate records remain unreviewed and cannot support production comparison outputs.</p>
        </section>
        <section className="card">
          <h2>Source hierarchy</h2>
          <p>Tier 4 sources are discovery references only and cannot act as production authority.</p>
        </section>
      </div>
      <br />
      <LegalSafetyBanner>{INTERNAL_WORKSPACE_WARNING}</LegalSafetyBanner>
      <br />
      <LegalSafetyBanner>{AI_ASSISTED_RESEARCH_NOTE}</LegalSafetyBanner>
    </>
  );
}
