/**
 * Security Types
 */

export interface Security {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSecurityInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateSecurityInput {
  title?: string;
  description?: string;
  status?: string;
}
