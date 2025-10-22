/**
 * CivilRights Types
 */

export interface CivilRights {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCivilRightsInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateCivilRightsInput {
  title?: string;
  description?: string;
  status?: string;
}
