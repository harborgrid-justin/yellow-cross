/**
 * RealEstate Types
 */

export interface RealEstate {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRealEstateInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateRealEstateInput {
  title?: string;
  description?: string;
  status?: string;
}
