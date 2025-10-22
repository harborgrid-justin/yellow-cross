/**
 * Securities Types
 */

export interface Securities {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSecuritiesInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateSecuritiesInput {
  title?: string;
  description?: string;
  status?: string;
}
