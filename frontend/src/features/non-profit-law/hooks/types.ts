/**
 * NonProfit Types
 */

export interface NonProfit {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateNonProfitInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateNonProfitInput {
  title?: string;
  description?: string;
  status?: string;
}
