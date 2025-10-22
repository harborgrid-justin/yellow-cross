/**
 * Evidence Types
 */

export interface Evidence {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEvidenceInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateEvidenceInput {
  title?: string;
  description?: string;
  status?: string;
}
