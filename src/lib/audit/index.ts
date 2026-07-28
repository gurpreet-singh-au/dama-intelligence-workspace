import type { AuditEventType } from "@/features/audit/audit-events";

export type AuditEventInput = {
  workspaceId: string;
  actorId?: string;
  action: AuditEventType;
  entityType: string;
  entityId?: string;
  reason?: string;
};

export function createAuditEvent(input: AuditEventInput) {
  return {
    ...input,
    createdAt: new Date().toISOString()
  };
}
