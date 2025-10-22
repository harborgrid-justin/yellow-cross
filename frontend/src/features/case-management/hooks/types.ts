/**
 * Case Management Types
 * TypeScript interfaces for Case Management feature
 */

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Closed' | 'Archived';
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  clientId?: string;
  clientName?: string;
  assignedTo?: string;
  practiceArea?: string;
  caseType?: string;
  openedDate: Date;
  closedDate?: Date;
  tags?: string[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CaseNote {
  id: string;
  caseId: string;
  caseNumber: string;
  content: string;
  noteType?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CaseTimelineEvent {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description?: string;
  eventType: string;
  eventDate: Date;
  createdBy?: string;
  createdAt?: Date;
}

export interface CreateCaseInput {
  title: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  practiceArea?: string;
  caseType?: string;
  priority?: string;
  assignedTo?: string;
  tags?: string[];
  createdBy: string;
}

export interface UpdateCaseInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  tags?: string[];
}

export interface CreateNoteInput {
  caseId: string;
  caseNumber: string;
  content: string;
  noteType?: string;
  createdBy: string;
}

export interface CaseAnalytics {
  totalCases: number;
  openCases: number;
  closedCases: number;
  casesByStatus: Record<string, number>;
  casesByPracticeArea: Record<string, number>;
  recentCases: Case[];
}
