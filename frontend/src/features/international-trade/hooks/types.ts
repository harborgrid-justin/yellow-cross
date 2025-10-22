/**
 * InternationalTrade Types
 */

export interface InternationalTrade {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateInternationalTradeInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateInternationalTradeInput {
  title?: string;
  description?: string;
  status?: string;
}
