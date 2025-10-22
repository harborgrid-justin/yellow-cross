/**
 * Appellate Types
 */

export interface Appellate {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAppellateInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateAppellateInput {
  title?: string;
  description?: string;
  status?: string;
}
