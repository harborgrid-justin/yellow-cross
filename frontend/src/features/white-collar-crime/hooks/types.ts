/**
 * WhiteCollarCrime Types
 */

export interface WhiteCollarCrime {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateWhiteCollarCrimeInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateWhiteCollarCrimeInput {
  title?: string;
  description?: string;
  status?: string;
}
