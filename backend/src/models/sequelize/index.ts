/**
 * Sequelize Models Index
 * Exports all Sequelize models
 */

export { User } from './User';
export { Case } from './Case';
export { CaseNote } from './CaseNote';
export { CaseTimelineEvent } from './CaseTimelineEvent';
export { Document } from './Document';
export { DocumentVersion } from './DocumentVersion';
export { DocumentReview } from './DocumentReview';
export { Task } from './Task';
export { TaskComment } from './TaskComment';
export { TaskTemplate } from './TaskTemplate';
export { Workflow } from './Workflow';
export { Evidence } from './Evidence';
export { PrivilegeLog } from './PrivilegeLog';
export { Production } from './Production';
export { LegalHold } from './LegalHold';

// Export all models as a default object
export default {
  User,
  Case,
  CaseNote,
  CaseTimelineEvent,
  Document,
  DocumentVersion,
  DocumentReview,
  Task,
  TaskComment,
  TaskTemplate,
  Workflow,
  Evidence,
  PrivilegeLog,
  Production,
  LegalHold
};
