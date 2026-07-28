import { LegalSafetyBanner } from "@/components/legal-safety/LegalSafetyBanner";
import { CANDIDATE_RECORD_WARNING } from "@/lib/legal-safety";

export default async function SourceDetailPage({ params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Source detail</div>
          <h1>Source {sourceId}</h1>
          <p>Phase 1 detail shell for source metadata, status, authority tier, snapshots and internal review notes.</p>
        </div>
      </div>
      <LegalSafetyBanner>{CANDIDATE_RECORD_WARNING}</LegalSafetyBanner>
    </>
  );
}
