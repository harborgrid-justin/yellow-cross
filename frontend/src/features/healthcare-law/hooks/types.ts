/**
 * Healthcare Types
 */

export interface Healthcare {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateHealthcareInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateHealthcareInput {
  title?: string;
  description?: string;
  status?: string;
}
