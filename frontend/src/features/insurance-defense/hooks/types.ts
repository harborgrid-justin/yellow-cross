/**
 * Insurance Types
 */

export interface Insurance {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateInsuranceInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateInsuranceInput {
  title?: string;
  description?: string;
  status?: string;
}
