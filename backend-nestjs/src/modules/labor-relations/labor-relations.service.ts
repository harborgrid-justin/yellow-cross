/**
 * LaborRelations Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { LaborRelationsMatter } from '../../models/sequelize/LaborRelationsMatter';

@Injectable()
export class LaborRelationsService extends BaseService<LaborRelationsMatter> {
  constructor(
    @InjectModel(LaborRelationsMatter)
    model: typeof LaborRelationsMatter,
  ) {
    super(model);
  }
}
