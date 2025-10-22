/**
 * LandlordTenant Types
 */

export interface LandlordTenant {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateLandlordTenantInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateLandlordTenantInput {
  title?: string;
  description?: string;
  status?: string;
}
