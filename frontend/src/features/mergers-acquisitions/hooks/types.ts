/**
 * MergersAcquisitions Types
 */

export interface MergersAcquisitions {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMergersAcquisitionsInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateMergersAcquisitionsInput {
  title?: string;
  description?: string;
  status?: string;
}
