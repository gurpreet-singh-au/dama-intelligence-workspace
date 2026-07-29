import type {
  AppRole,
  AvailabilityStatus,
  DataConfidence,
  ExtractionRecordStatus,
  MatchType,
  ReviewRequiredReason,
  ReviewStatus,
  SourceAuthorityTier,
  SourceStatus
} from "./enums";

export type WorkspaceMembership = {
  workspaceId: string;
  userId: string;
  role: AppRole;
};

export type SourceRecord = {
  id: string;
  workspaceId: string;
  title: string;
  url?: string;
  authorityTier: SourceAuthorityTier;
  status: SourceStatus;
  sourceDate?: string;
  effectiveDate?: string;
  accessedAt?: string;
};

export type SourceSnapshotExtract = {
  id: string;
  workspaceId: string;
  sourceSnapshotId: string;
  pageNumber?: number;
  sectionHeading?: string;
  extractText: string;
  extractionMethod: "manual" | "pdf_text" | "ocr" | "web_scrape" | "ai_assisted";
  confidenceScore?: number;
};

export type Citation = {
  id: string;
  workspaceId: string;
  sourceId: string;
  sourceSnapshotId: string;
  sourceSnapshotExtractId?: string;
  citationLabel: string;
  quotedText?: string;
  pageNumber?: number;
  sectionHeading?: string;
  urlAnchor?: string;
  sourceDate?: string;
  accessedAt: string;
};

export type EntityCitation = {
  id: string;
  workspaceId: string;
  entityType:
    | "dama_occupation_rule"
    | "dama_visa_availability_rule"
    | "dama_concession_rule"
    | "candidate_extraction_record"
    | "source"
    | "source_snapshot";
  entityId: string;
  citationId: string;
  citationRole: "primary_support" | "secondary_support" | "conflicting_source" | "background_only";
};

export type SourceGovernanceNote = {
  id: string;
  workspaceId: string;
  sourceId: string;
  noteType: "lawyer_review_note" | "mapping_decision" | "data_quality_note" | "governance_note";
  noteText: string;
  createdBy?: string;
  createdAt: string;
};

export type CandidateExtractionRecord = {
  id: string;
  workspaceId: string;
  sourceId?: string;
  status: ExtractionRecordStatus;
  dataConfidence: DataConfidence;
  reviewRequiredReason?: ReviewRequiredReason;
};

export type MaterialRuleSafetyFields = {
  id: string;
  workspaceId: string;
  reviewStatus: ReviewStatus;
  dataConfidence?: DataConfidence;
  reviewRequiredReason?: ReviewRequiredReason;
  source: SourceRecord | null;
  sourceSnapshotId?: string;
  primaryCitationId?: string;
  supersededDate?: string;
  conflictFlag?: boolean;
};

export type StructuredVisaAvailabilityRule = MaterialRuleSafetyFields & {
  subclass: "482" | "186" | "494";
  availabilityStatus: AvailabilityStatus;
  entityCitations?: EntityCitation[];
  citations?: Citation[];
};

export type StructuredConcessionRule = MaterialRuleSafetyFields & {
  concessionType: "salary" | "english" | "age" | "skills";
  availabilityStatus: AvailabilityStatus;
  entityCitations?: EntityCitation[];
  citations?: Citation[];
};

export type StructuredComparisonCandidate = {
  id: string;
  workspaceId: string;
  damaRegionName: string;
  occupationTitle: string;
  anzscoCode?: string;
  matchType: MatchType;
  reviewStatus: ReviewStatus;
  dataConfidence: DataConfidence;
  reviewRequiredReason?: ReviewRequiredReason;
  source: SourceRecord | null;
  sourceSnapshotId?: string;
  supersededDate?: string;
  conflictFlag: boolean;
  primaryCitationId?: string;
  primaryCitationLabel?: string;
  entityCitations?: EntityCitation[];
  citations?: Citation[];
  subclass482Status?: AvailabilityStatus;
  subclass186Status?: AvailabilityStatus;
  subclass494Status?: AvailabilityStatus;
  salaryConcessionStatus?: AvailabilityStatus;
  englishConcessionStatus?: AvailabilityStatus;
  ageConcessionStatus?: AvailabilityStatus;
  skillsConcessionStatus?: AvailabilityStatus;
  visaAvailabilityRules?: StructuredVisaAvailabilityRule[];
  concessionRules?: StructuredConcessionRule[];
};

export type ApprovedComparisonRow = Required<
  Pick<
    StructuredComparisonCandidate,
    | "workspaceId"
    | "damaRegionName"
    | "occupationTitle"
    | "matchType"
    | "reviewStatus"
    | "dataConfidence"
    | "conflictFlag"
    | "subclass482Status"
    | "subclass186Status"
    | "subclass494Status"
    | "salaryConcessionStatus"
    | "englishConcessionStatus"
    | "ageConcessionStatus"
    | "skillsConcessionStatus"
  >
> & {
  anzscoCode: string;
  ruleId: string;
  source: SourceRecord;
  sourceTitle: string;
  sourceUrl?: string;
  sourceReference: string;
  sourceAuthorityTier: SourceAuthorityTier;
  sourceDate?: string;
  accessedAt?: string;
  sourceSnapshotId: string;
  primaryCitationId: string;
  primaryCitationLabel: string;
  effectiveDate?: string;
  supersededDate?: string;
  reviewRequiredReason?: ReviewRequiredReason;
  internalWarningLabel: string;
};
