/**
 * Task Validation Schemas using Joi
 * Input validation for task and workflow management operations
 */

import Joi from 'joi';

// Validation schema for task creation
const createTaskSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  taskType: Joi.string().valid(
    'Legal Research', 'Document Review', 'Court Filing', 'Client Meeting', 
    'Hearing Preparation', 'Discovery', 'Contract Review', 'Correspondence', 
    'Administrative', 'Other'
  ).default('Other'),
  category: Joi.string().trim().allow('').max(100),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  assignedTo: Joi.string().trim().allow('').max(100),
  dueDate: Joi.date().optional(),
  startDate: Joi.date().optional(),
  estimatedHours: Joi.number().min(0).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(50),
  workflowId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  templateId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  checklist: Joi.array().items(Joi.object({
    item: Joi.string().required()
  })).optional(),
  createdBy: Joi.string().required().trim(),
  slaEnabled: Joi.boolean().default(false),
  slaDueDate: Joi.date().optional(),
  isUrgent: Joi.boolean().default(false)
});

// Validation schema for task assignment
const assignTaskSchema = Joi.object({
  assignedTo: Joi.string().required().trim().min(2).max(100),
  assignedBy: Joi.string().required().trim().min(2).max(100),
  reason: Joi.string().trim().allow('').max(500)
});

// Validation schema for task status update
const updateTaskStatusSchema = Joi.object({
  status: Joi.string().required().valid(
    'Not Started', 'In Progress', 'On Hold', 'Pending Review', 'Completed', 'Cancelled'
  ),
  updatedBy: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(1000),
  completionPercentage: Joi.number().min(0).max(100).optional()
});

// Validation schema for task dependencies
const addDependencySchema = Joi.object({
  dependentTaskId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  dependentTaskNumber: Joi.string().required().trim(),
  dependencyType: Joi.string().valid(
    'Finish-to-Start', 'Start-to-Start', 'Finish-to-Finish', 'Start-to-Finish'
  ).default('Finish-to-Start'),
  updatedBy: Joi.string().required().trim()
});

// Validation schema for priority update
const updatePrioritySchema = Joi.object({
  priority: Joi.string().required().valid('Low', 'Medium', 'High', 'Critical'),
  updatedBy: Joi.string().required().trim(),
  reason: Joi.string().trim().allow('').max(500),
  isUrgent: Joi.boolean().optional(),
  escalationLevel: Joi.number().min(0).max(5).optional()
});

// Validation schema for progress tracking
const updateProgressSchema = Joi.object({
  completionPercentage: Joi.number().required().min(0).max(100),
  updatedBy: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(500),
  actualHours: Joi.number().min(0).optional()
});

// Validation schema for task collaboration
const collaborateSchema = Joi.object({
  action: Joi.string().required().valid('comment', 'mention', 'attach', 'react'),
  username: Joi.string().required().trim(),
  content: Joi.string().trim().allow('').max(2000),
  mentions: Joi.array().items(Joi.string().trim()).optional(),
  attachments: Joi.array().items(Joi.object({
    filename: Joi.string().required(),
    fileType: Joi.string().required(),
    fileSize: Joi.number().required(),
    storagePath: Joi.string().required()
  })).optional(),
  reactionType: Joi.string().valid('Like', 'Love', 'Agree', 'Disagree', 'Helpful').optional()
});

// Validation schema for workflow creation
const createWorkflowSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  workflowType: Joi.string().required().valid(
    'Case Workflow', 'Document Workflow', 'Approval Workflow', 'Onboarding', 
    'Discovery', 'Contract Review', 'Litigation', 'Custom'
  ),
  category: Joi.string().trim().allow('').max(100),
  practiceArea: Joi.string().trim().allow('').max(100),
  steps: Joi.array().items(Joi.object({
    stepNumber: Joi.number().required().min(1),
    stepName: Joi.string().required(),
    stepDescription: Joi.string().allow(''),
    stepType: Joi.string().required().valid('Task', 'Approval', 'Notification', 'Condition', 'Delay', 'Action'),
    assignTo: Joi.string().allow(''),
    estimatedDuration: Joi.number().min(0).optional(),
    isRequired: Joi.boolean().default(true),
    taskTemplate: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().allow(''),
      taskType: Joi.string().allow(''),
      priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical')
    }).optional()
  })).min(1).required(),
  triggers: Joi.array().items(Joi.object({
    triggerType: Joi.string().required().valid(
      'Manual', 'Case Created', 'Status Change', 'Date Based', 
      'Document Upload', 'Approval Complete', 'Custom Event'
    ),
    isActive: Joi.boolean().default(true)
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim(),
  isTemplate: Joi.boolean().default(false)
});

// Validation schema for task template creation
const createTaskTemplateSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  category: Joi.string().required().trim().min(2).max(100),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  templateType: Joi.string().valid('Single Task', 'Task Group', 'Workflow').default('Single Task'),
  taskDefinition: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    taskType: Joi.string().valid(
      'Legal Research', 'Document Review', 'Court Filing', 'Client Meeting', 
      'Hearing Preparation', 'Discovery', 'Contract Review', 'Correspondence', 
      'Administrative', 'Other'
    ).default('Other'),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
    estimatedHours: Joi.number().min(0).optional(),
    defaultAssignee: Joi.string().allow(''),
    tags: Joi.array().items(Joi.string().trim()).optional()
  }).required(),
  tasks: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    taskType: Joi.string().allow(''),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical'),
    estimatedHours: Joi.number().min(0).optional(),
    order: Joi.number().min(1).required(),
    dependsOn: Joi.array().items(Joi.number()).optional()
  })).optional(),
  checklist: Joi.array().items(Joi.object({
    item: Joi.string().required(),
    isRequired: Joi.boolean().default(false)
  })).optional(),
  variables: Joi.array().items(Joi.object({
    variableName: Joi.string().required(),
    variableType: Joi.string().required().valid('Text', 'Number', 'Date', 'Boolean', 'Select'),
    defaultValue: Joi.string().allow(''),
    isRequired: Joi.boolean().default(false),
    selectOptions: Joi.array().items(Joi.string()).optional()
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim(),
  isPublic: Joi.boolean().default(false)
});

// Validation schema for workflow automation
const automateWorkflowSchema = Joi.object({
  workflowId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(50),
  customData: Joi.object().optional(),
  startImmediately: Joi.boolean().default(true),
  createdBy: Joi.string().required().trim()
});

export {

  createTaskSchema,
  assignTaskSchema,
  updateTaskStatusSchema,
  addDependencySchema,
  updatePrioritySchema,
  updateProgressSchema,
  collaborateSchema,
  createWorkflowSchema,
  createTaskTemplateSchema,
  automateWorkflowSchema

};
