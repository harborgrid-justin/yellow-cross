/**
 * Financial Types
 */

export interface Financial {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFinancialInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateFinancialInput {
  title?: string;
  description?: string;
  status?: string;
}
