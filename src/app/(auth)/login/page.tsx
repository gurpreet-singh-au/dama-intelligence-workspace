import { LegalSafetyBanner } from "@/components/legal-safety/LegalSafetyBanner";
import { INTERNAL_WORKSPACE_WARNING } from "@/lib/legal-safety";

export default function LoginPage() {
  return (
    <main className="main">
      <div className="page-header">
        <div>
          <div className="eyebrow">Internal access</div>
          <h1>Sign in</h1>
          <p>Authentication is wired for Supabase integration in Phase 1. Production identity setup remains a deployment task.</p>
        </div>
      </div>
      <LegalSafetyBanner>{INTERNAL_WORKSPACE_WARNING}</LegalSafetyBanner>
    </main>
  );
}
