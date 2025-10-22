/**
 * Report Types
 */

export interface Report {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateReportInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateReportInput {
  title?: string;
  description?: string;
  status?: string;
}
