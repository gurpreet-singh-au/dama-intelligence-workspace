import type { AppRole } from "@/types/enums";

export type Permission =
  | "read_internal_records"
  | "create_source"
  | "create_candidate_extraction"
  | "check_metadata"
  | "approve_production_rule"
  | "manage_workspace";

const rolePermissions: Record<AppRole, Permission[]> = {
  owner: ["read_internal_records", "create_source", "create_candidate_extraction", "check_metadata", "manage_workspace"],
  lawyer_reviewer: ["read_internal_records", "create_source", "create_candidate_extraction", "check_metadata", "approve_production_rule"],
  authorised_professional_reviewer: [
    "read_internal_records",
    "create_source",
    "create_candidate_extraction",
    "check_metadata",
    "approve_production_rule"
  ],
  admin_reviewer: ["read_internal_records", "create_source", "create_candidate_extraction", "check_metadata"],
  researcher: ["read_internal_records", "create_source", "create_candidate_extraction"],
  viewer: ["read_internal_records"]
};

export function hasPermission(roles: AppRole[], permission: Permission): boolean {
  return roles.some((role) => rolePermissions[role].includes(permission));
}

export function canApproveProductionRule(roles: AppRole[]): boolean {
  return hasPermission(roles, "approve_production_rule");
}

export function canCreateCandidateExtraction(roles: AppRole[]): boolean {
  return hasPermission(roles, "create_candidate_extraction");
}

export function roleBoundaryNote(role: AppRole): string {
  if (role === "owner") {
    return "Owner can administer the workspace, but owner status alone does not permit legal approval.";
  }

  if (role === "admin_reviewer") {
    return "Administrative review covers completeness, formatting, citations and metadata only.";
  }

  if (role === "researcher") {
    return "Researchers may create sources and candidate records, but cannot approve production rules.";
  }

  if (role === "viewer") {
    return "Viewers have read-only access to permitted internal records.";
  }

  return "Professional reviewer may approve source-backed structured records within authorised scope.";
}
