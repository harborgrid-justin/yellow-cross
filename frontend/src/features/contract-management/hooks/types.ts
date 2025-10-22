/**
 * Contract Types
 */

export interface Contract {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateContractInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateContractInput {
  title?: string;
  description?: string;
  status?: string;
}
