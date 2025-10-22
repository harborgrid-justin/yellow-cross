/**
 * Bankruptcy Types
 */

export interface Bankruptcy {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBankruptcyInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateBankruptcyInput {
  title?: string;
  description?: string;
  status?: string;
}
