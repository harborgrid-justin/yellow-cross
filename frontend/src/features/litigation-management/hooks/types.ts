/**
 * Litigation Types
 */

export interface Litigation {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateLitigationInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateLitigationInput {
  title?: string;
  description?: string;
  status?: string;
}
