/**
 * Compliance Types
 */

export interface Compliance {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateComplianceInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateComplianceInput {
  title?: string;
  description?: string;
  status?: string;
}
