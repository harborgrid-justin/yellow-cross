/**
 * Mediation Types
 */

export interface Mediation {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMediationInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateMediationInput {
  title?: string;
  description?: string;
  status?: string;
}
