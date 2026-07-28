import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComparisonTable } from "@/components/tables/ComparisonTable";
import { LegalSafetyBanner } from "@/components/legal-safety/LegalSafetyBanner";
import {
  CANDIDATE_RECORD_WARNING,
  INTERNAL_WORKSPACE_WARNING,
  UNKNOWN_AVAILABILITY_WARNING
} from "@/lib/legal-safety";

describe("legal safety labels", () => {
  it("renders internal-only warning labels", () => {
    render(<LegalSafetyBanner>{INTERNAL_WORKSPACE_WARNING}</LegalSafetyBanner>);
    expect(screen.getByText(INTERNAL_WORKSPACE_WARNING)).toBeInTheDocument();
  });

  it("renders candidate warning labels", () => {
    render(<LegalSafetyBanner tone="danger">{CANDIDATE_RECORD_WARNING}</LegalSafetyBanner>);
    expect(screen.getByText(CANDIDATE_RECORD_WARNING)).toBeInTheDocument();
  });

  it("renders unknown availability warning in empty comparison state", () => {
    render(<ComparisonTable rows={[]} />);
    expect(screen.getByText(UNKNOWN_AVAILABILITY_WARNING)).toBeInTheDocument();
  });
});
