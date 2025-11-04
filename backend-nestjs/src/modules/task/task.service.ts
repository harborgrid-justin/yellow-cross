/**
 * Task Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Task } from '../../models/sequelize/Task';

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(
    @InjectModel(Task)
    model: typeof Task,
  ) {
    super(model);
  }
}
