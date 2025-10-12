/**
 * Task Service
 * Business logic for Task Management
 */

import { BaseService } from './BaseService';
import { Task } from '../models/sequelize/Task';
import { TaskComment } from '../models/sequelize/TaskComment';

export class TaskService extends BaseService<Task> {
  constructor() {
    super(Task);
  }

  /**
   * Find tasks by case
   */
  async findByCase(caseId: string): Promise<Task[]> {
    return await this.findAll({
      where: { caseId },
      order: [['priority', 'DESC'], ['dueDate', 'ASC']]
    });
  }

  /**
   * Find tasks assigned to a user
   */
  async findByAssignee(assignedTo: string): Promise<Task[]> {
    return await this.findAll({
      where: { assignedTo, status: { $ne: 'Completed' } as any },
      order: [['priority', 'DESC'], ['dueDate', 'ASC']]
    });
  }

  /**
   * Find overdue tasks
   */
  async findOverdue(): Promise<Task[]> {
    const now = new Date();
    return await this.findAll({
      where: {
        dueDate: { $lt: now } as any,
        status: { $ne: 'Completed' } as any
      },
      order: [['dueDate', 'ASC']]
    });
  }

  /**
   * Assign task
   */
  async assignTask(
    taskId: string,
    assignedTo: string,
    assignedBy: string,
    reason?: string
  ): Promise<Task | null> {
    const task = await this.findById(taskId);
    if (!task) {
      return null;
    }

    const assignmentHistory = (task.assignmentHistory as any[]) || [];
    assignmentHistory.push({
      assignedTo,
      assignedBy,
      assignedAt: new Date(),
      reason
    });

    task.assignmentHistory = assignmentHistory;
    task.assignedTo = assignedTo;
    task.lastModifiedBy = assignedBy;
    await task.save();

    return task;
  }

  /**
   * Update task status
   */
  async updateStatus(
    taskId: string,
    status: string,
    updatedBy: string
  ): Promise<Task | null> {
    const task = await this.findById(taskId);
    if (!task) {
      return null;
    }

    task.status = status;
    task.lastModifiedBy = updatedBy;
    if (status === 'Completed') {
      task.completionDate = new Date();
    }
    await task.save();

    return task;
  }

  /**
   * Add comment to task
   */
  async addComment(
    taskId: string,
    content: string,
    createdBy: string
  ): Promise<TaskComment> {
    const task = await this.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    return await TaskComment.create({
      taskId: task.id,
      content,
      createdBy
    });
  }

  /**
   * Update task progress
   */
  async updateProgress(
    taskId: string,
    progress: number,
    updatedBy: string
  ): Promise<Task | null> {
    const task = await this.findById(taskId);
    if (!task) {
      return null;
    }

    task.progress = progress;
    task.lastModifiedBy = updatedBy;
    task.lastActivityDate = new Date();
    await task.save();

    return task;
  }
}

export default TaskService;
