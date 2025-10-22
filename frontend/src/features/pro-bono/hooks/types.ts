/**
 * ProBono Types
 */

export interface ProBono {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProBonoInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateProBonoInput {
  title?: string;
  description?: string;
  status?: string;
}
