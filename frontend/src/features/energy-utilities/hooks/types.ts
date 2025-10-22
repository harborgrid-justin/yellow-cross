/**
 * Energy Types
 */

export interface Energy {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEnergyInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateEnergyInput {
  title?: string;
  description?: string;
  status?: string;
}
