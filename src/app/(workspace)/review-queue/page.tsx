import { LegalSafetyBanner } from "@/components/legal-safety/LegalSafetyBanner";
import { candidateExtractionQueue } from "@/features/extraction-queue/mock-data";
import { CANDIDATE_RECORD_WARNING } from "@/lib/legal-safety";

export default function ReviewQueuePage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Candidate extraction queue</div>
          <h1>Review Queue</h1>
          <p>Phase 1 implements data structures and labels only. Production AI extraction is not implemented.</p>
        </div>
      </div>
      <LegalSafetyBanner tone="danger">{CANDIDATE_RECORD_WARNING}</LegalSafetyBanner>
      <br />
      <div className="empty-state">
        <h2>{candidateExtractionQueue.length} candidate records</h2>
        <p>Candidate records require review before promotion and never appear in approved comparison rows.</p>
      </div>
    </>
  );
}
