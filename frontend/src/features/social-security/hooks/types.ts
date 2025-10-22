/**
 * SocialSecurity Types
 */

export interface SocialSecurity {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSocialSecurityInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateSocialSecurityInput {
  title?: string;
  description?: string;
  status?: string;
}
