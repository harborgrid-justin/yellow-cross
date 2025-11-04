/**
 * ClassAction Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { ClassActionCase } from '../../models/sequelize/ClassActionCase';

@Injectable()
export class ClassActionService extends BaseService<ClassActionCase> {
  constructor(
    @InjectModel(ClassActionCase)
    model: typeof ClassActionCase,
  ) {
    super(model);
  }
}
