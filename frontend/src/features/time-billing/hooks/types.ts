/**
 * Billing Types
 */

export interface Billing {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBillingInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateBillingInput {
  title?: string;
  description?: string;
  status?: string;
}
