/**
 * PersonalInjury Types
 */

export interface PersonalInjury {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePersonalInjuryInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdatePersonalInjuryInput {
  title?: string;
  description?: string;
  status?: string;
}
