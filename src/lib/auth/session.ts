import type { AppRole } from "@/types/enums";

export type InternalSession = {
  userId: string;
  workspaceId: string;
  roles: AppRole[];
};

export const unauthenticatedSession: InternalSession | null = null;
