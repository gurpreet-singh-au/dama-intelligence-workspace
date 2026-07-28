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

export type CandidateExtractionRecord = {
  id: string;
  workspaceId: string;
  sourceId?: string;
  status: ExtractionRecordStatus;
  dataConfidence: DataConfidence;
  reviewRequiredReason?: ReviewRequiredReason;
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
  subclass482Status?: AvailabilityStatus;
  subclass186Status?: AvailabilityStatus;
  subclass494Status?: AvailabilityStatus;
  salaryConcessionStatus?: AvailabilityStatus;
  englishConcessionStatus?: AvailabilityStatus;
  ageConcessionStatus?: AvailabilityStatus;
  skillsConcessionStatus?: AvailabilityStatus;
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
  effectiveDate?: string;
  supersededDate?: string;
  reviewRequiredReason?: ReviewRequiredReason;
  internalWarningLabel: string;
};
