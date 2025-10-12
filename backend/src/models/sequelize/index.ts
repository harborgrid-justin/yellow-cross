/**
 * Sequelize Models Index
 * Exports all Sequelize models
 */

import { User } from './User';
import { Case } from './Case';
import { CaseNote } from './CaseNote';
import { CaseTimelineEvent } from './CaseTimelineEvent';
import { Document } from './Document';
import { DocumentVersion } from './DocumentVersion';
import { DocumentReview } from './DocumentReview';
import { Task } from './Task';
import { TaskComment } from './TaskComment';
import { TaskTemplate } from './TaskTemplate';
import { Workflow } from './Workflow';
import { Evidence } from './Evidence';
import { PrivilegeLog } from './PrivilegeLog';
import { Production } from './Production';
import { LegalHold } from './LegalHold';

// Named exports
export {
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
