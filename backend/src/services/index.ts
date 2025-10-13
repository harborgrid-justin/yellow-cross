/**
 * Services Index
 * Exports all service classes
 */

export { BaseService } from './BaseService';
export { CaseService } from './CaseService';
export { ClientService } from './ClientService';
export { DocumentService } from './DocumentService';
export { TaskService } from './TaskService';

// Re-export for convenience
import { BaseService } from './BaseService';
import { CaseService } from './CaseService';
import { ClientService } from './ClientService';
import { DocumentService } from './DocumentService';
import { TaskService } from './TaskService';

export default {
  BaseService,
  CaseService,
  ClientService,
  DocumentService,
  TaskService
};
